import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PaymentModal from '../PaymentModal';
import TrueFocus from '@/components/animations/TrueFocus';
import GradientText from '@/components/animations/GradientText';
import Antigravity from '@/components/animations/Antigravity';

export const HeroSection = () => {
  const [isJoinPaymentOpen, setIsJoinPaymentOpen] = useState(false);
  
  const joinNowService = {
    name: 'Exclusive Access',
    desc: 'Get exclusive access to the LOQ Degen community',
    icon: '🎯',
    pricing: [
      { id: '1project', name: '1 Project - Lifetime Support', tier: '1 Project - Lifetime Support', price: 400, emoji: '🚀' },
      { id: '2projects', name: '2 Projects - Lifetime Support', tier: '2 Projects - Lifetime Support', price: 600, emoji: '💎' },
      { id: '4projects', name: '4 Projects - Lifetime Support', tier: '4 Projects - Lifetime Support', price: 1000, emoji: '👑' }
    ],
    usdPricing: true,
    fullDesc: 'Unlock exclusive access to the LOQ Degen community. Get lifetime support for each project, everything from token building to deploy, full project management, and 24/7 team support.'
  };
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
    >
      {/* Antigravity background effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Antigravity
          count={200}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-0 items-center">
          {/* Left side - Welcome text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <motion.h1
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <TrueFocus
                sentence="Welcome Degen"
                separator=" "
                borderColor="#FF9FFC"
                animationDuration={0.5}
                pauseBetweenAnimations={1.5}
                blurAmount={3}
              >
                <span className="text-white font-bold">Welcome</span>
                <GradientText
                  colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                  animationSpeed={6}
                  yoyo={true}
                  className="font-bold pb-6"
                >
                  Degen
                </GradientText>
              </TrueFocus>
              </motion.h1>
          </motion.div>

          {/* Right side - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-5 lg:col-start-8 relative"
          >
            <div className="glass-card rounded-3xl p-8 card-glow">
              {/* Limited Spaces Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-loq-dark-purple/50 border border-loq-card-border rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-loq-pink pulse-dot" />
                <span className="text-sm font-medium text-loq-pink">LIMITED SPACES</span>
              </motion.div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                <span className="text-foreground">Launch</span>
                <br />
                <span className="text-foreground">Memecoins That</span>
                <br />
                <span className="gradient-text-pink">MOONS</span>
              </h2>

              <p className="text-muted-foreground mb-8 max-w-md">
                Join the exclusive community of degen launchers who've mastered the art of viral memecoins.
              </p>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsJoinPaymentOpen(true)}
                className="btn-gradient w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white mb-8 cursor-pointer"
              >
                JOIN NOW
              </motion.button>

              {/* Avatar Stack + Social */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar key={i} className="w-10 h-10 border-2 border-background">
                        <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                        <AvatarFallback className="bg-loq-purple text-xs">
                          {String.fromCharCode(64 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">500+</span> Members
                  </span>
                </div>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-loq-pink transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm">@loqdegen</span>
                </a>
              </div>
            </div>

            {/* Decorative gradient orb */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-loq-gradient-soft rounded-full blur-3xl opacity-30" />
          </motion.div>
        </div>

        {/* JOIN NOW Payment Modal */}
        <PaymentModal
          isOpen={isJoinPaymentOpen}
          onClose={() => setIsJoinPaymentOpen(false)}
          selectedService={joinNowService}
          userDetails={{
            ca: '',
            email: '',
            xUsername: '',
            tgUsername: ''
          }}
        />
      </div>
    </section>
  );
};
