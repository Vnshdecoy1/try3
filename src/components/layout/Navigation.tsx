import { useState, useEffect } from 'react';
import CardNav from './CardNav';
import PaymentModal from '../PaymentModal';

const navItems = [
  { label: 'HOME', href: '#home' },
  { label: 'WHAT I GET', href: '#what-i-get' },
  { label: 'PROFITS', href: '#profits' },
  { label: 'JOURNEYS', href: '#journeys' },
  { label: 'TOOLS', href: '#tools' },
  { label: 'FAQS', href: '#faqs' },
];

export const Navigation = () => {
  const [isJoinPaymentOpen, setIsJoinPaymentOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.replace('#', ''));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            break;
          }
        }
      }
    };

    // Debounced scroll handler
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cardNavItems = [
    {
      label: 'WHAT I GET',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        { label: 'Lifetime Support', href: '#what-i-get', ariaLabel: 'View lifetime support details' },
        { label: 'Token Building', href: '#what-i-get', ariaLabel: 'View token building features' }
      ]
    },
    {
      label: 'RESOURCES',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        { label: 'Tools', href: '#tools', ariaLabel: 'View tools' },
        { label: 'Journeys', href: '#journeys', ariaLabel: 'View journeys' }
      ]
    },
    {
      label: 'INFO',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        { label: 'Profits', href: '#profits', ariaLabel: 'View profits section' },
        { label: 'FAQs', href: '#faqs', ariaLabel: 'View FAQs' }
      ]
    }
  ];

  const joinNowService = {
    name: 'Exclusive Access',
    desc: 'Get exclusive access to the LOQ Degen community',
    icon: '🎯',
    pricing: [
      { id: '1project', name: '1 Project - Lifetime Support', tier: '1 Project - Lifetime Support', price: 400, emoji: '🚀' },
      { id: '2projects', name: '2 Projects - Lifetime Support', tier: '2 Projects - Lifetime Support', price: 600, emoji: '💎' },
      { id: '4projects', name: '4 Projects - Lifetime Support', tier: '4 Projects - Lifetime Support', price: 1000, emoji: '👑' }
    ]
  };

  return (
    <>
      <CardNav
        items={cardNavItems}
        baseColor="hsl(var(--loq-card-bg) / 0.8)"
        menuColor="#FF9FFC"
        buttonBgColor="#5227FF"
        buttonTextColor="#fff"
        ease="power3.out"
        theme="dark"
        className="backdrop-blur-md"
      />

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
    </>
  );
};
