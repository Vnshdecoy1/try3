 import { motion, useInView, AnimatePresence } from 'framer-motion';
 import { useRef, useState } from 'react';
 import { ChevronDown, Zap, TrendingUp, Users, MessageCircle, ThumbsUp, Rocket, BarChart3, Send, Play, Hash, LucideIcon } from 'lucide-react';
 import { useToolsPricing, Tool, PricingTier } from '@/hooks/useToolsPricing';

 // Icon mapping from database icon names to Lucide components
 const iconMap: Record<string, LucideIcon> = {
   BarChart3,
   TrendingUp,
   Rocket,
   Zap,
   ThumbsUp,
   Users,
   MessageCircle,
   Send,
   Play,
   Hash,
 };
 
 // Fallback tools for when database is loading or unavailable
 const fallbackTools = [
   { id: 'dex-ranking', slug: 'dex-ranking', icon: 'BarChart3', name: 'Dex Ranking', description: 'Get your token trending on DEX platforms', pricing_tiers: [{ id: '1', duration: '1 Hour', price: '0.5 SOL', sort_order: 1 }, { id: '2', duration: '6 Hours', price: '2.5 SOL', sort_order: 2 }, { id: '3', duration: '24 Hours', price: '8 SOL', sort_order: 3 }], category: 'general', sort_order: 1 },
   { id: 'volume-boosters', slug: 'volume-boosters', icon: 'TrendingUp', name: 'Volume Boosters', description: 'Increase trading volume organically', pricing_tiers: [{ id: '4', duration: '$10K Volume', price: '1 SOL', sort_order: 1 }, { id: '5', duration: '$50K Volume', price: '4 SOL', sort_order: 2 }, { id: '6', duration: '$100K Volume', price: '7 SOL', sort_order: 3 }], category: 'general', sort_order: 2 },
   { id: 'bumps', slug: 'bumps', icon: 'Rocket', name: 'Bumps', description: 'Keep your token visible in feeds', pricing_tiers: [{ id: '7', duration: '50 Bumps', price: '0.3 SOL', sort_order: 1 }, { id: '8', duration: '200 Bumps', price: '1 SOL', sort_order: 2 }, { id: '9', duration: '500 Bumps', price: '2 SOL', sort_order: 3 }], category: 'general', sort_order: 3 },
   { id: 'bundle-terminal', slug: 'bundle-terminal', icon: 'Zap', name: 'Bundle Terminal', description: 'All-in-one launch package', pricing_tiers: [{ id: '10', duration: 'Starter', price: '5 SOL', sort_order: 1 }, { id: '11', duration: 'Pro', price: '15 SOL', sort_order: 2 }, { id: '12', duration: 'Elite', price: '30 SOL', sort_order: 3 }], category: 'general', sort_order: 4 },
   { id: 'phantom-trending', slug: 'phantom-trending', icon: 'TrendingUp', name: 'Phantom Trending', description: 'Get featured on Phantom wallet', pricing_tiers: [{ id: '13', duration: '1 Hour', price: '2 SOL', sort_order: 1 }, { id: '14', duration: '6 Hours', price: '10 SOL', sort_order: 2 }, { id: '15', duration: '24 Hours', price: '35 SOL', sort_order: 3 }], category: 'general', sort_order: 5 },
   { id: 'dex-reactions', slug: 'dex-reactions', icon: 'ThumbsUp', name: 'DEX Reactions', description: 'Boost engagement on DEX listings', pricing_tiers: [{ id: '16', duration: '100 Reactions', price: '0.5 SOL', sort_order: 1 }, { id: '17', duration: '500 Reactions', price: '2 SOL', sort_order: 2 }, { id: '18', duration: '1000 Reactions', price: '3.5 SOL', sort_order: 3 }], category: 'general', sort_order: 6 },
   { id: 'holder-boost', slug: 'holder-boost', icon: 'Users', name: 'Holder Boost', description: 'Increase unique wallet holders', pricing_tiers: [{ id: '19', duration: '100 Holders', price: '1 SOL', sort_order: 1 }, { id: '20', duration: '500 Holders', price: '4 SOL', sort_order: 2 }, { id: '21', duration: '1000 Holders', price: '7 SOL', sort_order: 3 }], category: 'general', sort_order: 7 },
   { id: 'chat-managers', slug: 'chat-managers', icon: 'MessageCircle', name: 'Chat Managers', description: 'Professional community management', pricing_tiers: [{ id: '22', duration: '1 Week', price: '3 SOL', sort_order: 1 }, { id: '23', duration: '2 Weeks', price: '5 SOL', sort_order: 2 }, { id: '24', duration: '1 Month', price: '8 SOL', sort_order: 3 }], category: 'general', sort_order: 8 },
   { id: 'raiders', slug: 'raiders', icon: 'Send', name: 'Raiders', description: 'Coordinated social media campaigns', pricing_tiers: [{ id: '25', duration: '10 Raiders', price: '1 SOL', sort_order: 1 }, { id: '26', duration: '25 Raiders', price: '2 SOL', sort_order: 2 }, { id: '27', duration: '50 Raiders', price: '3.5 SOL', sort_order: 3 }], category: 'general', sort_order: 9 },
   { id: 'pf-stream-viewers', slug: 'pf-stream-viewers', icon: 'Play', name: 'PF Stream Viewers', description: 'Boost Pump.fun stream visibility', pricing_tiers: [{ id: '28', duration: '100 Viewers', price: '0.5 SOL', sort_order: 1 }, { id: '29', duration: '500 Viewers', price: '2 SOL', sort_order: 2 }, { id: '30', duration: '1000 Viewers', price: '3.5 SOL', sort_order: 3 }], category: 'general', sort_order: 10 },
   { id: 'pf-comments', slug: 'pf-comments', icon: 'Hash', name: 'PF Comments', description: 'Engagement on Pump.fun listings', pricing_tiers: [{ id: '31', duration: '50 Comments', price: '0.5 SOL', sort_order: 1 }, { id: '32', duration: '200 Comments', price: '1.5 SOL', sort_order: 2 }, { id: '33', duration: '500 Comments', price: '3 SOL', sort_order: 3 }], category: 'general', sort_order: 11 },
 ];

 const ToolCard = ({ tool, index }: { tool: Tool; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
 
   const IconComponent = iconMap[tool.icon] || BarChart3;

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
           <IconComponent className="w-6 h-6 text-white" />
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
               {tool.pricing_tiers.map((tier: PricingTier) => (
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
 
   // Fetch pricing from database
   const { data: dbTools, isLoading, error } = useToolsPricing();
 
   // Use database tools or fallback
   const tools = (dbTools && dbTools.length > 0) ? dbTools : fallbackTools;

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
           {isLoading ? (
             // Loading skeleton
             Array.from({ length: 6 }).map((_, index) => (
               <div key={index} className="glass-card rounded-2xl p-6 animate-pulse">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-loq-dark-purple/50" />
                   <div className="flex-1">
                     <div className="h-5 bg-loq-dark-purple/50 rounded w-24 mb-2" />
                     <div className="h-4 bg-loq-dark-purple/30 rounded w-32" />
                   </div>
                 </div>
               </div>
             ))
           ) : (
             tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
             ))
           )}
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-loq-purple/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
