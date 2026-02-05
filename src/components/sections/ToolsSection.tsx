import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';
import axios from 'axios';

interface Tool {
  name: string;
  desc: string;
  gradient: string;
  icon: JSX.Element;
  pricing?: Array<{ tier: string; price: number; emoji?: string; speed?: number }>;
  bumpQuantities?: Array<{ amount: number; price: number }>;
  customInput?: boolean;
  isVolumeBooster?: boolean;
  isBundleTerminal?: boolean;
  outOfService?: boolean;
  usdPricing?: boolean;
  price?: number;
  pricePerUnit?: number;
  unitSize?: number;
  unitName?: string;
  fullDesc: string;
}

const tools: Tool[] = [
  {
    name: 'Dex Ranking',
    desc: 'Boost your token visibility across all major DEX platforms',
    gradient: 'from-cyan-500 to-blue-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    pricing: [
      { tier: 'Top 70-100', price: 2.5, emoji: '🔥' },
      { tier: 'Top 50-70', price: 3.5, emoji: '💎' },
      { tier: 'Top 30-50', price: 5.0, emoji: '⚡' },
      { tier: 'Top 20-30', price: 7.0, emoji: '🔑' },
      { tier: 'Top 10-20', price: 10.0, emoji: '⭐' },
      { tier: 'Top 1-10', price: 12.0, emoji: '🔥' },
      { tier: 'Guaranteed Top 1', price: 20.0, emoji: '👑' }
    ],
    fullDesc: 'Dominate DEX rankings and get maximum exposure for your token. Our service ensures your project appears at the top of major decentralized exchanges, attracting organic traders and investors.'
  },
  {
    name: 'Volume Boosters',
    desc: 'Increase trading volume to attract more investors',
    gradient: 'from-green-500 to-emerald-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    customInput: true,
    isVolumeBooster: true,
    price: 1,
    fullDesc: 'We take only 20% of the total amount deposited in the wallet and generate volume with the rest of it. 1 SOL generates roughly around 300 SOL worth of volume (the volume may be less depending on the tax of the token). Our calculations are based on Raydium\'s base 0.25% taxed tokens.'
  },
  {
    name: 'Bumps',
    desc: 'Keep your token trending at the top of listings',
    gradient: 'from-purple-500 to-pink-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
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
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
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
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    pricing: [
      { tier: '6 Hours', price: 200, emoji: '👻' },
      { tier: '12 Hours', price: 370, emoji: '⭐' },
      { tier: '24 Hours', price: 700, emoji: '🚀' }
    ],
    usdPricing: true,
    fullDesc: 'Appear in Phantom wallet trending section and reach millions of active Solana users. Direct exposure to qualified investors who are already using the ecosystem and ready to trade.'
  },
  {
    name: 'DEX Reactions',
    desc: 'Manage community engagement on DEX platforms',
    gradient: 'from-pink-500 to-rose-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    pricing: [
      { tier: '100 votes', price: 8, emoji: '💬' },
      { tier: '500 votes', price: 30, emoji: '🔥' },
      { tier: '1000 votes', price: 55, emoji: '⭐' }
    ],
    usdPricing: true,
    fullDesc: 'Promotion on dexscreener.com is a great way to attract new investors to your project. An increase in likes shows investors how popular your project is. The ratio of added votes will be 50% 🔥 fires and 50% 🚀 rockets.'
  },
  {
    name: 'Holder Boost',
    desc: 'Increase holder count and distribution metrics',
    gradient: 'from-teal-500 to-cyan-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
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
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
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
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    pricing: [
      { tier: '1 Week', price: 120, emoji: '⚔️' },
      { tier: '2 Weeks', price: 210, emoji: '🔥' },
      { tier: '1 Month', price: 400, emoji: '💥' }
    ],
    usdPricing: true,
    fullDesc: 'You will get daily upto 30 raids with targets of 20 on each. Timings are flexible you can decide this with the raiders yourself!'
  },
  {
    name: 'PF Stream Viewers',
    desc: 'Boost your Pump.Fun stream visibility with live viewers',
    gradient: 'from-violet-500 to-purple-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    pricing: [
      { tier: '50 Viewers', price: 1.5, emoji: '📺' },
      { tier: '200 Viewers', price: 5.0, emoji: '🎥' },
      { tier: '500+ Viewers', price: 10.0, emoji: '⭐' }
    ],
    outOfService: true,
    fullDesc: 'Increase your Pump.Fun stream viewer count to attract organic viewers. Higher viewer counts = more visibility = more buyers. Active engagement makes your stream appear at the top of the platform.'
  },
  {
    name: 'PF Comments',
    desc: 'Generate organic engagement on Pump.Fun listings',
    gradient: 'from-emerald-500 to-green-500',
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
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
    icon: <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    pricing: [
      { tier: '1 Week', price: 70, emoji: '👥' },
      { tier: '2 Weeks', price: 120, emoji: '🚀' },
      { tier: '1 Month', price: 200, emoji: '👑' }
    ],
    usdPricing: true,
    fullDesc: '24/7 active chat on Phantom wallet to boost activity and trust'
  }
];

export const ToolsSection = () => {
  const [expandedTool, setExpandedTool] = useState<number | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedToolData, setSelectedToolData] = useState<Tool | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    ca: '',
    email: '',
    xUsername: '',
    tgUsername: ''
  });
  const [tokenData, setTokenData] = useState<any>(null);
  const [isValidatingCA, setIsValidatingCA] = useState(false);
  const [caError, setCAError] = useState('');

  const validateAndFetchCA = async (ca: string) => {
    if (!ca || ca.trim() === '') {
      setTokenData(null);
      setCAError('');
      return;
    }

    setIsValidatingCA(true);
    setCAError('');
    
    try {
      // Fetch from DexScreener API
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
      
      if (response.data && response.data.pairs && response.data.pairs.length > 0) {
        // Get the first pair (usually the most liquid one)
        const pair = response.data.pairs[0];
        
        // Try to fetch holder count from additional info
        let holderCount = 'N/A';
        try {
          // DexScreener doesn't provide holders directly, using approximate from info
          if (pair.info?.holders) {
            holderCount = pair.info.holders;
          } else if (pair.info?.socials) {
            // Sometimes holder info might be in socials or other fields
            holderCount = 'N/A';
          }
        } catch (e) {
          holderCount = 'N/A';
        }
        
        setTokenData({
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          price: pair.priceUsd,
          volume24h: pair.volume?.h24 || 0,
          liquidity: pair.liquidity?.usd || 0,
          txns24h: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
          makers24h: (pair.txns?.h24?.buyers || 0) + (pair.txns?.h24?.sellers || 0),
          marketCap: pair.marketCap || pair.fdv || 0,
          holders: holderCount,
          dexId: pair.dexId,
          pairAddress: pair.pairAddress
        });
        setCAError('');
      } else {
        setTokenData(null);
        setCAError('Invalid contract address. Token not found on DexScreener.');
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
      setTokenData(null);
      setCAError('Unable to verify contract address. Please check and try again.');
    } finally {
      setIsValidatingCA(false);
    }
  };

  const getDisplayFields = (toolName: string) => {
    switch (toolName) {
      case 'Dex Ranking':
      case 'Phantom Trending':
        return ['txns24h', 'marketCap', 'makers24h', 'volume24h'];
      case 'Volume Boosters':
        return ['marketCap', 'volume24h'];
      case 'Bumps':
        return ['marketCap'];
      case 'Holder Boost':
        return ['marketCap'];
      default:
        return [];
    }
  };

  const formatNumber = (num: any) => {
    if (num === 'N/A') return 'N/A';
    const n = parseFloat(num);
    if (isNaN(n)) return 'N/A';
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(2)}K`;
    return `$${n.toFixed(2)}`;
  };

  const formatPrice = (price: any) => {
    const p = parseFloat(price);
    if (isNaN(p)) return 'N/A';
    if (p < 0.000001) return `$${p.toExponential(2)}`;
    if (p < 1) return `$${p.toFixed(6)}`;
    return `$${p.toFixed(4)}`;
  };

  return (
    <section id="tools" className="py-24 px-4 relative bg-gradient-to-b from-[#060010] to-[#0d0620]">
      <div className="w-full max-w-7xl mx-auto">
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
            {tools.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedTool(idx)}
                className="bg-[#0B1120]/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl min-h-[200px] hover:bg-[#0B1120] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col border-2 border-cyan-400/20"
                style={{ borderRadius: 16 }}
              >
                {/* Gradient background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated circles */}
                <div className="absolute -right-6 -top-6 w-16 h-16 bg-cyan-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-purple-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Icon */}
                <div className="relative mb-3 text-cyan-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10">{tool.icon}</div>
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
              <div className="p-8">
                <div className="flex items-start justify-between mb-8 border-b border-cyan-500/20 pb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-cyan-400">{tools[expandedTool].icon}</div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-3">{tools[expandedTool].name}</h2>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">{tools[expandedTool].fullDesc}</p>
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
                    {tools[expandedTool].bumpQuantities ? 'Select your package:' : 'Choose your package:'}
                  </h3>
                  
                  {tools[expandedTool].bumpQuantities ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tools[expandedTool].bumpQuantities!.map((price, pidx) => (
                        <div key={pidx} className="bg-[#1a1a2e]/60 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/60 hover:bg-[#1a1a2e]/80 transition-all duration-300 group/price transform hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <svg className="w-8 h-8 text-cyan-400 group-hover/price:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-cyan-400 font-bold text-2xl">{tools[expandedTool].usdPricing ? `$${price.price}` : `${price.price} SOL`}</span>
                          </div>
                          <div className="text-white font-semibold text-base group-hover/price:text-cyan-400 transition-colors">{price.amount} Bumps</div>
                        </div>
                      ))}
                    </div>
                  ) : tools[expandedTool].customInput ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Custom service - pricing and details will be configured after you provide your requirements.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tools[expandedTool].pricing && tools[expandedTool].pricing!.map((price, pidx) => (
                        <div key={pidx} className="bg-[#1a1a2e]/60 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/60 hover:bg-[#1a1a2e]/80 transition-all duration-300 group/price transform hover:scale-105">
                          <div className="flex items-center justify-between mb-3">
                            <svg className="w-8 h-8 text-cyan-400 group-hover/price:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-cyan-400 font-bold text-2xl">{tools[expandedTool].usdPricing ? `$${price.price}` : `${price.price} SOL`}</span>
                          </div>
                          <div className="text-white font-semibold text-base group-hover/price:text-cyan-400 transition-colors">{price.tier}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => { 
                        setSelectedToolData(tools[expandedTool]); 
                        setExpandedTool(null);
                        // Reset user details and token data for new service
                        setUserDetails({
                          ca: '',
                          email: '',
                          xUsername: '',
                          tgUsername: ''
                        });
                        setTokenData(null);
                        setCAError('');
                        setShowUserForm(true); 
                      }} 
                      className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                    >
                      Get Started Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => {
            setShowUserForm(false);
            setTokenData(null);
            setCAError('');
          }}></div>
          <div className="relative bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border-2 border-cyan-400/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl shadow-cyan-500/20">
            <button onClick={() => {
              setShowUserForm(false);
              setTokenData(null);
              setCAError('');
            }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
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
                        onChange={(e) => {
                          setUserDetails({...userDetails, ca: e.target.value});
                          setTokenData(null);
                          setCAError('');
                        }}
                        onBlur={(e) => validateAndFetchCA(e.target.value)}
                        placeholder="Enter contract address"
                        className={`w-full bg-[#1a1a2e]/60 border ${caError ? 'border-red-500' : 'border-cyan-400/20'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all`}
                      />
                      {isValidatingCA && (
                        <p className="text-cyan-400 text-sm mt-2 flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Validating contract address...
                        </p>
                      )}
                      {caError && (
                        <p className="text-red-400 text-sm mt-2">{caError}</p>
                      )}
                      {tokenData && !caError && (
                        <div className="mt-4 bg-[#0f0f23]/80 border border-cyan-400/30 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl font-bold text-white">{tokenData.symbol}</div>
                            <div className="text-gray-400">{tokenData.name}</div>
                          </div>
                          {getDisplayFields(selectedToolData?.name || '').length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                              {getDisplayFields(selectedToolData?.name || '').map((field) => (
                                <div key={field} className="bg-[#1a1a2e]/60 rounded-lg p-3">
                                  <div className="text-xs text-gray-400 mb-1">
                                    {field === 'txns24h' && 'Transactions (24h)'}
                                    {field === 'marketCap' && 'Market Cap'}
                                    {field === 'makers24h' && 'Makers (24h)'}
                                    {field === 'volume24h' && 'Volume (24h)'}
                                    {field === 'holders' && 'Holders'}
                                  </div>
                                  <div className="text-sm font-semibold text-cyan-400">
                                    {field === 'marketCap' || field === 'volume24h' ? formatNumber(tokenData[field]) : 
                                     field === 'txns24h' || field === 'makers24h' || field === 'holders' ? tokenData[field] :
                                     tokenData[field]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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
                onClick={() => {
                  setShowUserForm(false);
                  setTokenData(null);
                  setCAError('');
                }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Validation logic
                  const needsCA = !selectedToolData?.isBundleTerminal && 
                                  selectedToolData?.name !== 'Chat Managers' && 
                                  selectedToolData?.name !== 'Raiders';
                  
                  if (selectedToolData?.name === 'Chat Managers' || selectedToolData?.name === 'Raiders') {
                    // Only Telegram required
                    if (!userDetails.tgUsername) {
                      alert('Please enter your Telegram username');
                      return;
                    }
                  } else if (needsCA) {
                    // CA required services
                    if (!userDetails.ca) {
                      alert('Please enter a contract address');
                      return;
                    }
                    if (caError) {
                      alert('Invalid contract address. Please enter a valid Solana token address.');
                      return;
                    }
                    if (!tokenData) {
                      alert('Please wait for contract address validation to complete.');
                      return;
                    }
                    if (!userDetails.email || !userDetails.xUsername || !userDetails.tgUsername) {
                      alert('Please fill in all fields');
                      return;
                    }
                  } else {
                    // Bundle Terminal - no CA needed
                    if (!userDetails.email || !userDetails.xUsername || !userDetails.tgUsername) {
                      alert('Please fill in all fields');
                      return;
                    }
                  }
                  
                  setShowUserForm(false);
                  setIsPaymentOpen(true);
                }}
                disabled={(() => {
                  const needsCA = !selectedToolData?.isBundleTerminal && 
                                  selectedToolData?.name !== 'Chat Managers' && 
                                  selectedToolData?.name !== 'Raiders';
                  
                  if (isValidatingCA) return true;
                  if (needsCA && (caError || (!tokenData && userDetails.ca))) return true;
                  
                  return false;
                })()}
                className={`px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50 ${
                  (isValidatingCA || ((() => {
                    const needsCA = !selectedToolData?.isBundleTerminal && 
                                    selectedToolData?.name !== 'Chat Managers' && 
                                    selectedToolData?.name !== 'Raiders';
                    return needsCA && (caError || (!tokenData && userDetails.ca));
                  })()))
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isValidatingCA ? 'Validating...' : 'Continue to Payment'}
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
        tokenData={
          selectedToolData && 
          !selectedToolData.isBundleTerminal && 
          selectedToolData.name !== 'Chat Managers' && 
          selectedToolData.name !== 'Raiders' && 
          selectedToolData.name !== 'PF Stream Viewers' && 
          selectedToolData.name !== 'PF Comments' && 
          selectedToolData.name !== 'Phantom Group Chats'
            ? tokenData 
            : null
        }
      />
    </section>
  );
};
