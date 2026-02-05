import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Instagram, Twitter, Send } from 'lucide-react';
import PaymentModal from '../PaymentModal';

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'What I Get', href: '#what-i-get' },
  { label: 'Profits', href: '#profits' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Tools', href: '#tools' },
  { label: 'FAQs', href: '#faqs' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Send, href: 'https://t.me', label: 'Telegram' },
];

const testimonialQuotes = [
  { quote: 'Life changing opportunity', author: '@cryptoking' },
  { quote: 'Best decision I ever made', author: '@degenqueen' },
  { quote: '10/10 would recommend', author: '@solanawhale' },
];

export const FooterSection = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="py-16 px-4 border-t border-border/30">
      <div className="container max-w-7xl mx-auto">
        {/* Testimonial Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 overflow-hidden"
        >
          <div className="flex gap-8 justify-center flex-wrap">
            {testimonialQuotes.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-muted-foreground text-sm italic">"{item.quote}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{item.author}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">LOQ DEGEN</h3>
            <p className="text-muted-foreground text-sm mb-6">
              The premier memecoin launch service on Solana. Join thousands of successful degens.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-loq-purple/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-foreground" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-4">Ready to Launch?</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Join the waitlist for exclusive early access and special pricing.
            </p>
            <button 
              onClick={() => setIsJoinPaymentOpen(true)}
              className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Join Now
            </button>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border/30 text-center"
        >
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LOQ Degen. All rights reserved.
          </p>
        </motion.div>

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
    </footer>
  );
};
