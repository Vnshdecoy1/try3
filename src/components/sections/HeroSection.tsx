import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Welcome text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <div className="bracket-border inline-block p-8">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-foreground">Welcome</span>
                <br />
                <span className="gradient-text">Degen</span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Right side - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
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
                className="btn-gradient w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white mb-8"
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
      </div>
    </section>
  );
};
