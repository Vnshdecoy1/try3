import { useState } from 'react';
import PaymentModal from './PaymentModal';

const TOOLS_DATA = [
  {
    name: 'Dex Ranking',
    desc: 'Boost your token visibility across all major DEX platforms',
    gradient: 'from-cyan-500 to-blue-500',
    icon: '📊',
    pricing: [
      { tier: 'Top 70-100', price: 2.5, emoji: '🔥' },
      { tier: 'Top 50-70', price: 3.5, emoji: '💎' },
      { tier: 'Top 30-50', price: 5.0, emoji: '⚡' },
      { tier: 'Top 20-30', price: 7.0, emoji: '🚀' },
      { tier: 'Top 10-20', price: 10.0, emoji: '☄️' },
      { tier: 'Top 1-10', price: 12.0, emoji: '🔥' },
      { tier: 'Guaranteed Top 1', price: 20.0, emoji: '👑' }
    ],
    fullDesc: 'Dominate DEX rankings and get maximum exposure for your token. Our service ensures your project appears at the top of major decentralized exchanges, attracting organic traders and investors. Choose your desired ranking position and watch the volume flow in.'
  },
  {
    name: 'Volume Boosters',
    desc: 'Increase trading volume to attract more investors',
    gradient: 'from-green-500 to-emerald-500',
    icon: '📈',
    customInput: true,
    isVolumeBooster: true,
    price: 1,
    fullDesc: 'We take only 20% of the total amount deposited in the wallet and generate volume with the rest of it. 1 SOL generates roughly around 300 SOL worth of volume (the volume may be less depending on the tax of the token). Our calculations are based on Raydium\'s base 0.25% taxed tokens.'
  },
  {
    name: 'Bumps',
    desc: 'Keep your token trending at the top of listings',
    gradient: 'from-purple-500 to-pink-500',
    icon: '⬆️',
    pricing: [
      { tier: '9 Bumps/Min', speed: 9 },
      { tier: '18 Bumps/Min', speed: 18 },
      { tier: '27 Bumps/Min', speed: 27 },
      { tier: '36 Bumps/Min', speed: 36 },
      { tier: '45 Bumps/Min', speed: 45 },
      { tier: '54 Bumps/Min', speed: 54 },
      { tier: '63 Bumps/Min', speed: 63 },
      { tier: '72 Bumps/Min', speed: 72 },
      { tier: '150 Bumps/Min', speed: 150 },
      { tier: '300 Bumps/Min', speed: 300 },
      { tier: '450 Bumps/Min', speed: 450 },
      { tier: '600 Bumps/Min', speed: 600 }
    ],
    bumpQuantities: [
      { amount: 500, price: 0.2 },
      { amount: 1000, price: 0.4 },
      { amount: 2000, price: 0.75 },
      { amount: 5000, price: 1.75 },
      { amount: 10000, price: 3.4 },
      { amount: 25000, price: 8.2 }
    ],
    fullDesc: 'Stay visible with continuous bumps on major listing platforms. We ensure your token stays at the top of "Recently Listed" and "Trending" sections, maximizing organic discovery and community growth.'
  },
  {
    name: 'Bundle Terminal',
    desc: 'All-in-one toolkit for your launch on Solana',
    gradient: 'from-yellow-500 to-orange-500',
    icon: '💻',
    pricing: [
      { tier: 'Lifetime Access', price: 200, emoji: '🚀' }
    ],
    isBundleTerminal: true,
    usdPricing: true,
    fullDesc: 'All-in-one toolkit for your launch on Solana! Launch & Snipe your token supply with clean bubble maps, anti-detection system, and organic & bundle modes. Trade like a Pro with one-click trading across hundreds of wallets. Includes wallet tools: Bundle Wash, Mixer, Distribute & Withdraw. One-time payment for lifetime access!'
  },
  {
    name: 'Phantom Trending',
    desc: 'Get featured in Phantom wallet trending section',
    gradient: 'from-indigo-500 to-purple-500',
    icon: '⚡',
    pricing: [
      { tier: '6 Hours', price: 200, emoji: '💻' },
      { tier: '12 Hours', price: 370, emoji: '☄️' },
      { tier: '24 Hours', price: 700, emoji: '🚀' }
    ],
    usdPricing: true,
    fullDesc: 'Appear in Phantom wallet trending section and reach millions of active Solana users. Direct exposure to qualified investors who are already using the ecosystem and ready to trade.'
  },
  {
    name: 'DEX Reactions',
    desc: 'Manage community engagement on DEX platforms',
    gradient: 'from-pink-500 to-rose-500',
    icon: '💬',
    pricing: [
      { tier: '100 votes', price: 8, emoji: '💬' },
      { tier: '500 votes', price: 30, emoji: '🔥' },
      { tier: '1000 votes', price: 55, emoji: '☄️' }
    ],
    usdPricing: true,
    fullDesc: 'Promotion on dexscreener.com is a great way to attract new investors to your project. An increase in likes shows investors how popular your project is. The ratio of added votes will be 50% 🔥 fires and 50% 🚀 rockets.'
  },
  {
    name: 'Holder Boost',
    desc: 'Increase holder count and distribution metrics',
    gradient: 'from-teal-500 to-cyan-500',
    icon: '👥',
    pricing: [
      { tier: '100 Holders', price: 0.3, emoji: '👥' }
    ],
    customInput: true,
    pricePerUnit: 0.3,
    unitSize: 100,
    fullDesc: 'Improve your token distribution and holder count metrics. Real wallets with natural distribution patterns that pass all scanner checks. Perfect for building credibility and passing initial holder requirements. Pricing: 100 holders = 0.3 SOL (multiples of 100 only)'
  },
  {
    name: 'Chat Managers',
    desc: 'Professional chat moderation and community management',
    gradient: 'from-blue-500 to-indigo-500',
    icon: '💬',
    pricing: [
      { tier: '1 Week', price: 70, emoji: '💬' },
      { tier: '2 Weeks', price: 120, emoji: '👨‍💼' },
      { tier: '1 Month', price: 200, emoji: '🏆' }
    ],
    usdPricing: true,
    fullDesc: '24/7 Activity, Chat moderation, engages with users, Keep the chat clean. You Will Get 5 Chat managers in each pack they will be active 24/7 which means your chat is active everytime.'
  },
  {
    name: 'Raiders',
    desc: 'Coordinate strategic community raids for maximum impact',
    gradient: 'from-red-500 to-orange-500',
    icon: '⚔️',
    pricing: [
      { tier: '1 Week', price: 120, emoji: '⚔️' },
      { tier: '2 Weeks', price: 210, emoji: '🔥' },
      { tier: '1 Month', price: 400, emoji: '👥' }
    ],
    usdPricing: true,
    fullDesc: 'You will get daily upto 30 raids with targets of 20 on each. Timings are flexible you can decide this with the raiders yourself!'
  },
  {
    name: 'PF Stream Viewers',
    desc: 'Boost your Pump.Fun stream visibility with live viewers',
    gradient: 'from-violet-500 to-purple-500',
    icon: '📺',
    pricing: [
      { tier: '50 Viewers', price: 1.5, emoji: '📹' },
      { tier: '200 Viewers', price: 5.0, emoji: '🎥' },
      { tier: '500+ Viewers', price: 10.0, emoji: '☄️' }
    ],
    outOfService: true,
    fullDesc: 'Increase your Pump.Fun stream viewer count to attract organic viewers. Higher viewer counts = more visibility = more buyers. Active engagement makes your stream appear at the top of the platform.'
  },
  {
    name: 'PF Comments',
    desc: 'Generate organic engagement on Pump.Fun listings',
    gradient: 'from-emerald-500 to-green-500',
    icon: '💬',
    pricing: [
      { tier: '1 Comment', price: 0.005, emoji: '💬' }
    ],
    customInput: true,
    pricePerUnit: 0.005,
    unitSize: 1,
    unitName: 'comment',
    fullDesc: 'Get organic comments for your project on PUMPFUN. Pricing: 0.005 SOL per comment'
  },
  {
    name: 'Phantom Group Chats',
    desc: 'Manage and grow your Phantom wallet community groups',
    gradient: 'from-fuchsia-500 to-pink-500',
    icon: '👥',
    pricing: [
      { tier: '1 Week', price: 70, emoji: '👥' },
      { tier: '2 Weeks', price: 120, emoji: '🚀' },
      { tier: '1 Month', price: 200, emoji: '👑' }
    ],
    usdPricing: true,
    fullDesc: '24/7 active chat on Phantom wallet to boost activity and trust'
  }
];

interface ToolsSectionProps {
  className?: string;
}

export default function ToolsSection({ className = '' }: ToolsSectionProps) {
  const [expandedTool, setExpandedTool] = useState<number | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedToolData, setSelectedToolData] = useState<any>(null);
  const [selectedPricingTier, setSelectedPricingTier] = useState<any>(null);
  const [userDetails, setUserDetails] = useState({
    ca: '',
    email: '',
    xUsername: '',
    tgUsername: ''
  });
  const [showUserForm, setShowUserForm] = useState(false);

  const handleToolClick = (toolIndex: number) => {
    setExpandedTool(toolIndex);
    setSelectedPricingTier(null); // Reset price selection when opening new tool
  };

  const handleGetStarted = (tool: any, pricingTier?: any) => {
    setSelectedToolData({...tool, selectedTier: pricingTier});
    setShowUserForm(true);
    setExpandedTool(null);
  };

  return (
    <div className={`w-full bg-gradient-to-b from-[#060010] to-[#0d0620] relative overflow-y-auto flex items-center justify-center ${className}`}>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full mb-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-purple-400 text-xs sm:text-sm font-medium">Our Arsenal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">TOOLS</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto px-4">
            Professional tools to dominate the markets and scale your project
          </p>
        </div>

        {/* Tools Grid */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid gap-3 sm:gap-4 lg:gap-5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
              maxHeight: '60vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {TOOLS_DATA.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => handleToolClick(idx)}
                className="bg-[#0B1120]/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl min-h-[200px] hover:bg-[#0B1120] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col border-2 border-cyan-400/20"
                style={{ borderRadius: 16 }}
              >
                {/* Gradient background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Animated circles */}
                <div className="absolute -right-6 -top-6 w-16 h-16 bg-cyan-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-purple-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                {/* Icon */}
                <div className={`relative mb-3 text-cyan-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 flex-shrink-0 text-4xl`}>
                  {tool.icon}
                </div>

                {/* Title */}
                <h3 className="relative text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-tight">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="relative text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors flex-1">
                  {tool.desc}
                </p>
                {tool.usdPricing && (
                  <div className="mt-2 text-xs text-green-400 font-semibold">Prices in USD ($)</div>
                )}

                {/* Click hint */}
                <div className="relative mt-3 text-xs text-cyan-400/60 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>Click to view pricing</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Details Modal */}
        {expandedTool !== null && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setExpandedTool(null)}
          >
            <div
              className="bg-[#0f0a1f] border border-cyan-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(125,249,255,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {expandedTool !== null && (() => {
                const tool = TOOLS_DATA[expandedTool];

                return (
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8 border-b border-cyan-500/20 pb-6">
                      <div className="flex items-center gap-6">
                        <div className="text-cyan-400 text-6xl">{tool.icon}</div>
                        <div>
                          <h2 className="text-4xl font-bold text-white mb-3">{tool.name}</h2>
                          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">{tool.fullDesc}</p>
                        </div>
                      </div>
                      <button onClick={() => setExpandedTool(null)} className="text-gray-400 hover:text-white transition-colors p-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Choose your package:
                      </h3>

                      {tool.bumpQuantities ? (
                        /* Bumps service */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {tool.bumpQuantities.map((price: any, pidx: number) => (
                            <div 
                              key={pidx} 
                              onClick={() => setSelectedPricingTier(price)}
                              className={`bg-[#1a1a2e]/60 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 cursor-pointer group/price transform hover:scale-105 ${
                                selectedPricingTier?.amount === price.amount
                                  ? 'border-cyan-400 bg-[#1a1a2e]/95'
                                  : 'border-cyan-400/20 hover:border-cyan-400/60 hover:bg-[#1a1a2e]/80'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <svg className="w-8 h-8 text-cyan-400 group-hover/price:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-cyan-400 font-bold text-2xl">{price.price} SOL</span>
                              </div>
                              <div className="text-white font-semibold text-base group-hover/price:text-cyan-400 transition-colors">{price.amount} Bumps</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Normal service pricing */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {tool.pricing && tool.pricing.map((price: any, pidx: number) => (
                            <div 
                              key={pidx}
                              onClick={() => setSelectedPricingTier(price)}
                              className={`bg-[#1a1a2e]/60 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 cursor-pointer group/price transform hover:scale-105 ${
                                selectedPricingTier?.tier === price.tier || selectedPricingTier?.price === price.price
                                  ? 'border-cyan-400 bg-[#1a1a2e]/95'
                                  : 'border-cyan-400/20 hover:border-cyan-400/60 hover:bg-[#1a1a2e]/80'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <svg className="w-8 h-8 text-cyan-400 group-hover/price:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-cyan-400 font-bold text-2xl">{tool.usdPricing ? `$${price.price}` : `${price.price} SOL`}</span>
                              </div>
                              <div className="text-white font-semibold text-base group-hover/price:text-cyan-400 transition-colors">{price.tier}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-10 flex justify-center">
                        <button
                          disabled={!selectedPricingTier && !tool.customInput}
                          onClick={() => {
                            if (!selectedPricingTier && !tool.customInput) {
                              alert('Please select a package');
                              return;
                            }
                            handleGetStarted(tool, selectedPricingTier);
                            setExpandedTool(null);
                          }}
                          className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                        >
                          {selectedPricingTier || tool.customInput ? 'Get Started Now →' : 'Select a Package →'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* User Details Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUserForm(false)}></div>
            <div className="relative bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border-2 border-cyan-400/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl shadow-cyan-500/20">
              <button onClick={() => setShowUserForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Enter Your Details</h2>
                <p className="text-gray-400">Service: <span className="text-cyan-400 font-semibold">{selectedToolData?.name}</span></p>
              </div>
              <div className="space-y-6">
                {(selectedToolData?.name === 'Chat Managers' || selectedToolData?.name === 'Raiders') ? (
                  <div>
                    <label className="block text-white font-semibold mb-2">Telegram Username</label>
                    <input
                      type="text"
                      value={userDetails.tgUsername}
                      onChange={(e) => setUserDetails({...userDetails, tgUsername: e.target.value})}
                      placeholder="@telegram_username"
                      className="w-full bg-[#1a1a2e]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                    />
                  </div>
                ) : (
                  <>
                    {!selectedToolData?.isBundleTerminal && (
                      <div>
                        <label className="block text-white font-semibold mb-2">Contract Address (CA)</label>
                        <input
                          type="text"
                          value={userDetails.ca}
                          onChange={(e) => setUserDetails({...userDetails, ca: e.target.value})}
                          placeholder="Enter contract address"
                          className="w-full bg-[#1a1a2e]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-white font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full bg-[#1a1a2e]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">X (Twitter) Username</label>
                      <input
                        type="text"
                        value={userDetails.xUsername}
                        onChange={(e) => setUserDetails({...userDetails, xUsername: e.target.value})}
                        placeholder="@username"
                        className="w-full bg-[#1a1a2e]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Telegram Username</label>
                      <input
                        type="text"
                        value={userDetails.tgUsername}
                        onChange={(e) => setUserDetails({...userDetails, tgUsername: e.target.value})}
                        placeholder="@telegram_username"
                        className="w-full bg-[#1a1a2e]/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowUserForm(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if ((selectedToolData?.name === 'Chat Managers' || selectedToolData?.name === 'Raiders') ? userDetails.tgUsername : (userDetails.ca && userDetails.email && userDetails.xUsername && userDetails.tgUsername)) {
                      setShowUserForm(false);
                      setIsPaymentOpen(true);
                    } else {
                      alert('Please fill in all fields');
                    }
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedToolData(null);
          }}
          selectedService={selectedToolData}
          userDetails={userDetails}
        />
      </div>
    </div>
  );
}
