import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coins, TrendingUp, Globe, BookOpen, Rocket, Users } from 'lucide-react';

const features = [
  {
    icon: Coins,
    title: 'Custom Token',
    description: 'Your own unique memecoin with custom tokenomics, branding, and smart contract deployment on Solana.',
  },
  {
    icon: TrendingUp,
    title: 'Hype Strategy',
    description: 'Proven viral marketing playbook to generate FOMO and drive organic community growth.',
  },
  {
    icon: Globe,
    title: 'Custom Website',
    description: 'Professional landing page with wallet integration, tokenomics display, and social links.',
  },
  {
    icon: BookOpen,
    title: 'Resources',
    description: 'Complete toolkit including graphics, copy templates, and community management guides.',
  },
  {
    icon: Rocket,
    title: 'Launch Plan',
    description: 'Step-by-step roadmap from token creation to DEX listing and beyond.',
  },
  {
    icon: Users,
    title: 'Team Support',
    description: '24/7 dedicated support from experienced launchers who\'ve done it before.',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 card-glow group gpu-accelerated"
    >
      <div className="w-14 h-14 rounded-xl bg-loq-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <feature.icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

export const WhatIGetSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="what-i-get" className="py-24 px-4 relative">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">What </span>
            <span className="gradient-text">I Get</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to launch a successful memecoin, from token creation to viral marketing.
          </p>
        </motion.div>

        {/* Feature Grid - Bento Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-loq-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-loq-pink/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};
