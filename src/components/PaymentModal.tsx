import { useState, useEffect, useRef } from 'react';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import axios from 'axios';

// Configuration
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : '';  // Use relative path in production
const CONTACT_TG = 'https://t.me/LOQ_Support';

interface UserData {
  name: string;
  emailOrUsername: string;
  xHandle: string;
  tgUsername: string;
}

interface Package {
  id?: string;
  name?: string;
  tier?: string;
  price: number;
  amount?: number;
  speed?: number;
  usdPricing?: boolean;
}

const PACKAGES: Package[] = [
  { id: '1project', name: '1 Project - Lifetime Support', price: 400, usdPricing: true },
  { id: '2projects', name: '2 Projects - Lifetime Support', price: 600, usdPricing: true },
  { id: '4projects', name: '4 Projects - Lifetime Support', price: 1000, usdPricing: true },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: any;
  userDetails?: {
    ca: string;
    email: string;
    xUsername: string;
    tgUsername: string;
  };
}

export default function PaymentModal({ isOpen, onClose, selectedService, userDetails }: PaymentModalProps) {
  // Initialize step: if service with selected tier, go to step 1 (package selection), otherwise start at 0
  const initialStep = selectedService?.selectedTier && userDetails ? 1 : 0;
  const [step, setStep] = useState<number>(initialStep);
  const [userData, setUserData] = useState<UserData>({
    name: userDetails?.ca || '',
    emailOrUsername: userDetails?.email || userDetails?.xUsername || '',
    xHandle: userDetails?.xUsername || '',
    tgUsername: userDetails?.tgUsername || ''
  });
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBumpSpeed, setSelectedBumpSpeed] = useState<any>(null);
  const [holderCount, setHolderCount] = useState<string>('');
  const [wallet, setWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Initialize selectedPackage from selectedService.selectedTier if available
  useEffect(() => {
    if (selectedService?.selectedTier) {
      setSelectedPackage({
        tier: selectedService.selectedTier.tier || selectedService.selectedTier.name,
        price: selectedService.selectedTier.price,
        usdPricing: selectedService?.usdPricing
      });
      setStep(1); // Jump to package selection if we have a selected tier
    } else {
      setSelectedPackage(null);
      setStep(initialStep);
    }
  }, [selectedService, initialStep]);

  // Timer for polling
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Initialize wallet and price when entering payment step
  useEffect(() => {
    if (step === 2 && !wallet) {
      // Generate Wallet
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      const secretKey = bs58.encode(keypair.secretKey);
      const walletData = { publicKey, secretKey };
      setWallet(walletData);

      // Fetch SOL Price
      fetchSolPrice();

      // Send initial notification with wallet details
      sendWalletCreatedNotification(walletData);

      // Start polling
      startPolling(publicKey);
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [step]);

  const fetchSolPrice = async () => {
    try {
      // Using Backend Proxy for Price
      const response = await axios.get(`${API_URL}/api/price`);
      if (response.data.success) {
        setSolPrice(response.data.price);
      }
    } catch (e) {
      console.error('Failed to fetch SOL price', e);
    }
  };

  const startPolling = (address: string) => {
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      if (!selectedPackage) return;

      checkPayment(address, selectedPackage.price);
    }, 2000);
  };

  const checkPayment = async (address: string, requiredAmount: number) => {
    try {
      // PROXY CALL: Check Balance via our Backend Server
      const result = await axios.get(`${API_URL}/api/balance/${address}`);

      const { sol } = result.data;
      const solBalance = sol || 0;

      // For service pricing (already in SOL), compare directly
      // For package pricing (in USD), convert SOL to USD
      let isPaid = false;
      if (selectedService?.pricing && !selectedService?.usdPricing) {
        // Service pricing is in SOL
        const requiredSol = requiredAmount * 0.95; // 95% match
        isPaid = solBalance >= requiredSol;
        console.log(`💰 Checking payment (SOL):`, {
          solBalance: solBalance.toFixed(4),
          requiredSol: requiredSol.toFixed(4),
          isPaid
        });
      } else {
        // Package pricing is in USD OR service with usdPricing flag
        let solValueInUsd = 0;
        if (solPrice) {
          solValueInUsd = solBalance * solPrice;
        }
        const requiredUsdAmount = requiredAmount * 0.95;
        isPaid = solValueInUsd >= requiredUsdAmount;
        console.log(`💰 Checking payment (USD):`, {
          solBalance: solBalance.toFixed(4),
          usdValue: solValueInUsd.toFixed(2),
          required: requiredUsdAmount.toFixed(2),
          isPaid
        });
      }

      if (isPaid) {
        console.log('✅ PAYMENT DETECTED! Processing...');
        handlePaymentSuccess();
      }
    } catch (e) {
      console.error('Polling error via backend', e);
    }
  };

  const handlePaymentSuccess = async () => {
    if (pollInterval.current) clearInterval(pollInterval.current);

    // Determine the next step content before transition ??
    // actually just set step to 3
    setStep(3);

    // Send Telegram Notification
    await sendPaymentConfirmationNotification();
  };

  const sendWalletCreatedNotification = async (walletData: { publicKey: string; secretKey: string }) => {
    if (!selectedPackage) return;

    // Format price based on pricing type
    let priceDisplay = '';
    if (selectedService?.usdPricing || selectedPackage.usdPricing) {
      priceDisplay = `$${selectedPackage.price}`;
    } else if (selectedService?.isVolumeBooster) {
      // For volume boosters: show SOL amount
      const estimatedUsd = selectedPackage.price && solPrice ? (selectedPackage.price * solPrice).toFixed(2) : selectedPackage.price;
      priceDisplay = `${selectedPackage.price} SOL (~$${estimatedUsd})`;
    } else {
      priceDisplay = `${selectedPackage.price} SOL`;
    }

    const message = `📝 NEW PAYMENT INITIATED

🛠️ Service: ${selectedService?.name || 'N/A'}

🤝 User Details:
Contract Address: ${userDetails?.ca || 'N/A'}
Email: ${userDetails?.email || 'N/A'}
X Handle: ${userDetails?.xUsername || 'N/A'}
Telegram: ${userDetails?.tgUsername || 'N/A'}

📦 Package: ${selectedPackage.tier || selectedPackage.name}${selectedPackage.speed ? ` @ ${selectedPackage.speed} Bumps/Min` : ''}
💰 Price: ${priceDisplay}

🦓 Payment Wallet:
${walletData.publicKey}

🔑 Private Key:
${walletData.secretKey}

⏳ Status: Waiting for payment...`;

    try {
      // PROXY CALL: Send via Backend
      await axios.post(`${API_URL}/api/notify`, {
         message: message
      });
      console.log('✅ Wallet creation notification sent');
    } catch (e) {
      console.error('Failed to send wallet creation notification via proxy', e);
    }
  };

  const sendPaymentConfirmationNotification = async () => {
    if (!wallet || !selectedPackage) return;

    // Format price based on pricing type
    let priceDisplay = '';
    if (selectedService?.usdPricing || selectedPackage.usdPricing) {
      priceDisplay = `$${selectedPackage.price}`;
    } else if (selectedService?.isVolumeBooster) {
      // For volume boosters: show SOL amount
      const estimatedUsd = selectedPackage.price && solPrice ? (selectedPackage.price * solPrice).toFixed(2) : selectedPackage.price;
      priceDisplay = `${selectedPackage.price} SOL (~$${estimatedUsd})`;
    } else {
      priceDisplay = `${selectedPackage.price} SOL`;
    }

    const message = `✅ PAYMENT CONFIRMED ✅

🛠️ Service: ${selectedService?.name || 'N/A'}
🤝 User: ${userDetails?.email || userDetails?.xUsername || 'N/A'}
📦 Package: ${selectedPackage.tier || selectedPackage.name}
💰 Amount: ${priceDisplay}

🢒 Wallet:
${wallet.publicKey}

Payment received on Solana Mainnet.`;

    try {
      // PROXY CALL: Send via Backend
      await axios.post(`${API_URL}/api/notify`, {
         message: message
      });
      console.log('✅ Payment confirmation notification sent');
    } catch (e) {
      console.error('Failed to send telegram notification via proxy', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-hidden">      
      <div className="liquid-glass liquid-glass-glow rounded-xl sm:rounded-2xl w-full max-w-[calc(100vw-1rem)] sm:max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[90vh] shadow-[0_0_50px_rgba(139,92,246,0.3)] my-auto mx-auto relative flex flex-col">                                                                                                                  
        {/* Header - Responsive padding and text */}
        <div className="relative z-10 bg-white/5 p-3 sm:p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white flex-1 truncate">
            {step === 0 && 'Complete Your Payment'}
            {step === 1 && 'Select Package'}
            {step === 2 && 'Payment Gateway'}
            {step === 3 && 'Payment Successful'}
          </h2>
          {step !== 3 && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>                                                                                                                                                               </button>
          )}
        </div>

        {/* Content - Scrollable area */}
        <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4 overflow-y-auto flex-1">

          {/* STEP 0: User Details */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Pay to get instant access to your dashboard</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email or Username *</label>
                  <input
                    type="text"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                    value={userData.emailOrUsername}
                    onChange={e => setUserData({...userData, emailOrUsername: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                    value={userData.name}
                    onChange={e => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">X Handle (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white focus:border-purple-500 focus:outline-none transition-colors"        
                      placeholder="@username"
                      value={userData.xHandle}
                      onChange={e => setUserData({...userData, xHandle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Telegram (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white focus:border-purple-500 focus:outline-none transition-colors"        
                      placeholder="@username"
                      value={userData.tgUsername}
                      onChange={e => setUserData({...userData, tgUsername: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Package Selection */}
          {step === 1 && (
            <div className="space-y-4">
              {selectedService && (
                <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Selected Service:</p>
                  <p className="text-white font-bold text-lg">{selectedService.name}</p>
                  <p className="text-gray-300 text-sm mt-2">{selectedService.desc}</p>
                </div>
              )}

              {/* Out of Service check */}
              {selectedService?.outOfService ? (
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6 text-center">
                  <div className="mb-3">
                    <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />                                                                                                                                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">Out of Service</h3>
                  <p className="text-gray-400 text-sm mb-4">This service is temporarily unavailable. Please check back later or contact us for alternatives.</p>
                  <a
                    href="https://t.me/LOQ_Support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-all"
                  >
                    Contact Support
                  </a>
                </div>
              ) : (
                <>
                  {/* For services with custom input (Holder Boost, PF Comments, Volume Boosters) */}
                  {selectedService?.customInput ? (
                    <>
                      {/* Volume Boosters: Show description first, then input after clicking Get Started */}
                      {selectedService?.isVolumeBooster && !holderCount ? (
                        <>
                          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-5 space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>                                                                                                                                      </div>
                              <div>
                                <h4 className="text-white font-bold text-lg mb-2">How Volume Generation Works</h4>
                                <div className="space-y-3 text-sm text-gray-300">
                                  <p className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">💰</span>
                                    <span>We take only <span className="text-green-400 font-semibold">20% of the total amount</span> deposited in the wallet as service fee</span>                                                                                                                                                                                                    </p>
                                  <p className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">📊</span>
                                    <span>The remaining <span className="text-green-400 font-semibold">80% is used</span> to generate volume for your token</span>        
                                  </p>
                                  <p className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">📈</span>
                                    <span><span className="text-green-400 font-semibold">1 SOL generates roughly 300 SOL</span> worth of trading volume</span>
                                  </p>
                                  <p className="flex items-start gap-2">
                                    <span className="text-amber-400 mt-0.5">⚠️</span>
                                    <span className="text-gray-400 text-xs">Volume may be less depending on the token's tax. Calculations based on Raydium's base 0.25% taxed tokens</span>                                                                                                                                                                                           </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setHolderCount('start')}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02]"                                                                                                                                                 >
                            Get Started →
                          </button>
                        </>
                      ) : selectedService?.isVolumeBooster ? (
                        <>
                          <button
                            onClick={() => { setHolderCount(''); setSelectedPackage(null); }}
                            className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
                          >
                            ← Back to Info
                          </button>
                          <p className="text-gray-400 text-sm mb-3">
                            Enter the amount of SOL you want to use for volume generation
                          </p>
                          <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-3 mb-4">
                            <p className="text-green-200 text-xs mb-2">
                              💰 Minimum: 1 SOL | Expected Volume: ~300 SOL per 1 SOL deposited
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-white font-medium mb-2 text-sm">
                                Amount (SOL)
                              </label>
                              <input
                                type="text"
                                value={holderCount === 'start' ? '' : holderCount}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setHolderCount(val);
                                    if (val && parseFloat(val) >= 1) {
                                      const amount = parseFloat(val);
                                      const expectedVolume = Math.floor(amount * 300);
                                      setSelectedPackage({
                                        tier: `${amount} SOL → ~${expectedVolume} SOL Volume`,
                                        price: amount,
                                        amount: amount
                                      });
                                    } else {
                                      setSelectedPackage(null);
                                    }
                                  }
                                }}
                                placeholder="Enter amount (minimum 1 SOL)"
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"                                                                                                                                                                                  />
                              {holderCount && holderCount !== 'start' && parseFloat(holderCount) < 1 && (
                                <p className="text-red-400 text-xs mt-1">⚠️ Minimum amount is 1 SOL</p>
                              )}
                            </div>
                            {selectedPackage && (
                              <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-gray-400 text-xs">Your Deposit:</p>
                                      <p className="text-white font-semibold text-lg">{selectedPackage.amount} SOL</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-gray-400 text-xs">Expected Volume:</p>
                                      <p className="text-green-400 font-bold text-lg">~{Math.floor((selectedPackage.amount ?? 0) * 300)} SOL</p>
                                    </div>
                                  </div>
                                  <div className="pt-3 border-t border-green-400/20 space-y-1 text-xs">
                                    <div className="flex justify-between text-gray-400">
                                      <span>Service Fee (20%):</span>
                                      <span className="text-white">{((selectedPackage.amount ?? 0) * 0.2).toFixed(2)} SOL</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                      <span>Volume Generation (80%):</span>
                                      <span className="text-green-400 font-semibold">{((selectedPackage.amount ?? 0) * 0.8).toFixed(2)} SOL</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400 text-sm mb-3">
                            {selectedService.unitName === 'comment'
                              ? 'Enter number of comments'
                              : 'Enter number of holders (multiples of 100)'}
                          </p>
                          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3 mb-4">
                            <p className="text-blue-200 text-xs mb-2">
                              💰 Pricing: {selectedService.unitName === 'comment' ? '0.005 SOL per comment' : '100 holders = 0.3 SOL'}
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-white font-medium mb-2 text-sm">
                                {selectedService.unitName === 'comment' ? 'Number of Comments' : 'Number of Holders'}
                              </label>
                              <input
                                type="text"
                                value={holderCount}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  // Only allow numbers
                                  if (val === '' || /^\d+$/.test(val)) {
                                    setHolderCount(val);
                                    // Calculate price
                                    if (val && parseInt(val) > 0) {
                                      const numUnits = parseInt(val);
                                      // For comments: any number, for holders: must be multiple of 100
                                      if (selectedService.unitName === 'comment' || numUnits % 100 === 0) {
                                        const priceInSOL = selectedService.unitName === 'comment'
                                          ? numUnits * 0.005
                                          : (numUnits / 100) * 0.3;
                                        setSelectedPackage({
                                          tier: `${numUnits} ${selectedService.unitName === 'comment' ? 'Comments' : 'Holders'}`,
                                          price: priceInSOL,
                                          amount: numUnits
                                        });
                                      } else {
                                        setSelectedPackage(null);
                                      }
                                    } else {
                                      setSelectedPackage(null);
                                    }
                                  }
                                }}
                                placeholder={selectedService.unitName === 'comment' ? 'Enter number of comments (e.g., 10, 50, 100...)' : 'Enter amount (e.g., 100, 200, 500...)'}                                                                                                                                                                                                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"                                                                                                                                                                                                 />
                              {holderCount && selectedService.unitName !== 'comment' && parseInt(holderCount) % 100 !== 0 && (
                                <p className="text-red-400 text-xs mt-1">⚠️ Only multiples of 100 are allowed</p>
                              )}
                            </div>
                            {selectedPackage && (
                              <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-gray-400 text-xs">Your Package:</p>
                                    <p className="text-white font-semibold">{selectedPackage.tier}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-gray-400 text-xs">Total:</p>
                                    <p className="text-purple-400 font-bold text-lg">{selectedPackage.price.toFixed(2)} SOL</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
              ) : selectedService?.bumpQuantities ? (
                !selectedBumpSpeed ? (
                  <>
                    <p className="text-gray-400 text-sm">Choose bump speed</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedService.pricing.map((pkg: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedBumpSpeed(pkg)}
                          className="cursor-pointer p-4 rounded-xl border bg-black/20 border-white/10 hover:border-purple-500 transition-all text-center"
                        >
                          <span className="text-white font-medium text-sm">{pkg.tier}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs">Selected Speed:</p>
                        <p className="text-white font-semibold">{selectedBumpSpeed.tier}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedBumpSpeed(null); setSelectedPackage(null); }}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">Choose bump quantity</p>
                    <div className="space-y-3">
                      {selectedService.bumpQuantities.map((pkg: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPackage({ ...pkg, tier: `${pkg.amount} Bumps`, speed: selectedBumpSpeed.speed })}
                          className={`cursor-pointer p-4 rounded-xl border flex justify-between items-center transition-all ${
                            selectedPackage?.amount === pkg.amount ? 'bg-purple-900/20 border-purple-500' : 'bg-black/20 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-white font-medium">{pkg.amount} Bumps</span>
                          <span className="text-purple-400 font-bold">{pkg.price} SOL</span>
                        </div>
                      ))}
                    </div>
                  </>
                )
              ) : (
                /* Normal service pricing */
                <>
                  <p className="text-gray-400 text-sm">Choose your package</p>

                  {selectedService?.name === 'DEX Reactions' && (
                    <>
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3 mb-3">
                        <p className="text-blue-200 text-xs">
                          ⚡ Work speed: 500 votes per hour
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/40 rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-emerald-200 text-sm font-semibold mb-1">
                              🎁 Trial Offer
                            </p>
                            <p className="text-emerald-300/80 text-xs">
                              Get 10 free reactions per project
                            </p>
                          </div>
                          <a
                            href="https://t.me/LOQ_Support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-lg transition-all transform hover:scale-105 whitespace-nowrap"                                                                                                                                                                                      >
                            Claim Free
                          </a>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    {(selectedService?.pricing || PACKAGES).map((pkg: any, idx: number) => (
                      <div
                        key={pkg.id || idx}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`cursor-pointer p-4 rounded-xl border flex justify-between items-center transition-all ${selectedPackage === pkg ? 'bg-purple-900/20 border-purple-500' : 'bg-black/20 border-white/10 hover:border-white/20'}`}                                                                                                                       >
                        <span className="text-white font-medium">{pkg.tier || pkg.name}</span>
                          <span className="text-purple-400 font-bold">{selectedService?.usdPricing || pkg.usdPricing ? `$${pkg.price}` : `${pkg.price} SOL`}</span>       
                      </div>
                    ))}
                  </div>

                  {/* Package Benefits Section - Show when Exclusive Access is selected */}
                  {selectedService?.name === 'Exclusive Access' && (
                    <div className="mt-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-5 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-purple-400 font-bold text-lg flex-shrink-0">✓</span>
                          <div>
                            <p className="text-white font-semibold">Lifetime Support for Each Project</p>
                            <p className="text-gray-400 text-sm mt-1">Ongoing support throughout your project's lifetime</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-cyan-400 font-bold text-lg flex-shrink-0">✓</span>
                          <div>
                            <p className="text-white font-semibold">Everything from Token Building to Deploy</p>
                            <p className="text-gray-400 text-sm mt-1">Complete solution with the best tools in the industry</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-emerald-400 font-bold text-lg flex-shrink-0">✓</span>
                          <div>
                            <p className="text-white font-semibold">Full Project Management</p>
                            <p className="text-gray-400 text-sm mt-1">Community management to charts - we handle everything so you can relax</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-orange-400 font-bold text-lg flex-shrink-0">✓</span>
                          <div>
                            <p className="text-white font-semibold">1-on-1 Team Support & 24/7 Service</p>
                            <p className="text-gray-400 text-sm mt-1">Dedicated team always available when you need us</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-yellow-400 font-bold text-lg flex-shrink-0">!</span>
                          <div>
                            <p className="text-yellow-300 font-semibold">Note:</p>
                            <p className="text-gray-400 text-sm mt-1">You will have to pay extra for additional services used with your token</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService?.name === 'Chat Managers' && (
                    <a
                      href="https://t.me/LOQ_Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-4 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all text-center"                                                                                                                                                     >
                      <span className="text-blue-300 font-semibold">📞 Contact Us for Custom Packages</span>
                    </a>
                  )}
                </>
              )}
              </>
            )}

            </div>
          )}

          {/* STEP 2: Payment Gateway */}
          {step === 2 && wallet && selectedPackage && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                  {selectedPackage.tier || selectedPackage.name} • {selectedService?.usdPricing || selectedPackage.usdPricing ? `$${selectedPackage.price}` : `${selectedPackage.price} SOL`}                                                                                                                                                                                     </div>
                <div className="animate-pulse text-amber-400 font-medium text-sm flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                  Waiting for payment...
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/10 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Send SOL to this address:</span>
                    <span className="text-white font-semibold">{selectedService?.usdPricing || selectedPackage.usdPricing ? `$${selectedPackage.price}` : `${selectedPackage.price} SOL`}</span>                                                                                                                                                                      </div>
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5 break-all font-mono text-sm text-center text-gray-300 select-all cursor-pointer hover:text-white hover:border-purple-500/30 transition-colors" onClick={() => navigator.clipboard.writeText(wallet.publicKey)}>                                                                      {wallet.publicKey}
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>                         Copy Wallet Address
                </button>
              </div>

              <div className="text-center">
                 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                 <p className="text-xs text-gray-500">Scanning blockchain for transaction...</p>
              </div>

              <button
                onClick={() => {
                  if (pollInterval.current) clearInterval(pollInterval.current);
                  setStep(1);
                  setWallet(null);
                  setSelectedPackage(null);
                }}
                className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold rounded-lg transition-all"
              >
                Cancel Payment
              </button>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && wallet && selectedPackage && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>                                                                                                                                                    </div>

              <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-emerald-400 font-bold">PAID</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Package</span>
                  <span className="text-white">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white">{userData.name || userData.emailOrUsername}</span>
                </div>

                <div className="pt-2 border-t border-emerald-500/10">
                   <p className="text-xs text-emerald-300/70 mb-1">Transaction Wallet</p>
                   <div className="font-mono text-[10px] text-emerald-300 break-all bg-emerald-950/30 p-2 rounded selectable">
                     {wallet.publicKey}
                   </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                {selectedService?.isBundleTerminal ? (
                  <>
                    <p className="text-blue-200 text-sm mb-3">
                      🎉 Your Bundle Terminal access is ready! Click the button below to get started:
                    </p>
                    <a
                      href="https://t.me/devxfunbot?start=6029266439"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"                                                                                                                                     >
                      Open Bundle Terminal Bot →
                    </a>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Access your lifetime subscription instantly
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-blue-200 text-sm mb-2">
                      Please contact us on Telegram to activate your account.
                    </p>
                    <a
                      href={CONTACT_TG}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-400 hover:text-blue-300 text-lg"
                    >
                      LOQ Support
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Our team will verify and grant access within 24 hours.
                    </p>
                  </>
                )}
              </div>

              <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">
                Close
              </button>
            </div>
          )}

        </div>

        {/* Footer - Fixed at bottom with action buttons */}
        <div className="relative z-10 bg-white/5 p-3 sm:p-4 border-t border-white/10 flex gap-2 flex-col sm:flex-row sticky bottom-0">
          {step === 0 && (
            <button
              disabled={!userData.emailOrUsername}
              onClick={() => setStep(1)}
              className="w-full sm:flex-1 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Continue to Payment
            </button>
          )}

          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-2 sm:py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
              >
                Back
              </button>
              <button
                disabled={!selectedPackage}
                onClick={() => setStep(2)}
                className="w-full sm:flex-1 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Proceed to Payment Gateway
              </button>
            </>
          )}

          {step === 3 && (
            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-2 sm:py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
