import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown, Zap, TrendingUp, Users, MessageCircle, Eye, ThumbsUp, Rocket, BarChart3, Send, Play, Hash } from 'lucide-react';

const tools = [
  {
    id: 'dex-ranking',
    icon: BarChart3,
    name: 'Dex Ranking',
    description: 'Get your token trending on DEX platforms',
    pricing: [
      { duration: '1 Hour', price: '0.5 SOL' },
      { duration: '6 Hours', price: '2.5 SOL' },
      { duration: '24 Hours', price: '8 SOL' },
    ],
  },
  {
    id: 'volume-boosters',
    icon: TrendingUp,
    name: 'Volume Boosters',
    description: 'Increase trading volume organically',
    pricing: [
      { duration: '$10K Volume', price: '1 SOL' },
      { duration: '$50K Volume', price: '4 SOL' },
      { duration: '$100K Volume', price: '7 SOL' },
    ],
  },
  {
    id: 'bumps',
    icon: Rocket,
    name: 'Bumps',
    description: 'Keep your token visible in feeds',
    pricing: [
      { duration: '50 Bumps', price: '0.3 SOL' },
      { duration: '200 Bumps', price: '1 SOL' },
      { duration: '500 Bumps', price: '2 SOL' },
    ],
  },
  {
    id: 'bundle-terminal',
    icon: Zap,
    name: 'Bundle Terminal',
    description: 'All-in-one launch package',
    pricing: [
      { duration: 'Starter', price: '5 SOL' },
      { duration: 'Pro', price: '15 SOL' },
      { duration: 'Elite', price: '30 SOL' },
    ],
  },
  {
    id: 'phantom-trending',
    icon: TrendingUp,
    name: 'Phantom Trending',
    description: 'Get featured on Phantom wallet',
    pricing: [
      { duration: '1 Hour', price: '2 SOL' },
      { duration: '6 Hours', price: '10 SOL' },
      { duration: '24 Hours', price: '35 SOL' },
    ],
  },
  {
    id: 'dex-reactions',
    icon: ThumbsUp,
    name: 'DEX Reactions',
    description: 'Boost engagement on DEX listings',
    pricing: [
      { duration: '100 Reactions', price: '0.5 SOL' },
      { duration: '500 Reactions', price: '2 SOL' },
      { duration: '1000 Reactions', price: '3.5 SOL' },
    ],
  },
  {
    id: 'holder-boost',
    icon: Users,
    name: 'Holder Boost',
    description: 'Increase unique wallet holders',
    pricing: [
      { duration: '100 Holders', price: '1 SOL' },
      { duration: '500 Holders', price: '4 SOL' },
      { duration: '1000 Holders', price: '7 SOL' },
    ],
  },
  {
    id: 'chat-managers',
    icon: MessageCircle,
    name: 'Chat Managers',
    description: 'Professional community management',
    pricing: [
      { duration: '1 Week', price: '3 SOL' },
      { duration: '2 Weeks', price: '5 SOL' },
      { duration: '1 Month', price: '8 SOL' },
    ],
  },
  {
    id: 'raiders',
    icon: Send,
    name: 'Raiders',
    description: 'Coordinated social media campaigns',
    pricing: [
      { duration: '10 Raiders', price: '1 SOL' },
      { duration: '25 Raiders', price: '2 SOL' },
      { duration: '50 Raiders', price: '3.5 SOL' },
    ],
  },
  {
    id: 'pf-stream-viewers',
    icon: Play,
    name: 'PF Stream Viewers',
    description: 'Boost Pump.fun stream visibility',
    pricing: [
      { duration: '100 Viewers', price: '0.5 SOL' },
      { duration: '500 Viewers', price: '2 SOL' },
      { duration: '1000 Viewers', price: '3.5 SOL' },
    ],
  },
  {
    id: 'pf-comments',
    icon: Hash,
    name: 'PF Comments',
    description: 'Engagement on Pump.fun listings',
    pricing: [
      { duration: '50 Comments', price: '0.5 SOL' },
      { duration: '200 Comments', price: '1.5 SOL' },
      { duration: '500 Comments', price: '3 SOL' },
    ],
  },
];

const ToolCard = ({ tool, index }: { tool: typeof tools[0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glass-card rounded-2xl overflow-hidden gpu-accelerated"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center gap-4 text-left hover:bg-loq-dark-purple/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-loq-gradient flex items-center justify-center shrink-0">
          <tool.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3">
              {tool.pricing.map((tier) => (
                <div
                  key={tier.duration}
                  className="flex items-center justify-between p-4 rounded-xl bg-loq-dark-purple/50 border border-loq-card-border/50"
                >
                  <span className="text-foreground font-medium">{tier.duration}</span>
                  <span className="text-loq-pink font-bold">{tier.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ToolsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="tools" className="py-24 px-4 relative" ref={sectionRef}>
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">Launch </span>
            <span className="gradient-text">Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional-grade tools to amplify your token launch. Click any tool to see pricing.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-loq-purple/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
