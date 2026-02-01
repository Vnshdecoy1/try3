import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does it take to launch a token?',
    answer: 'With our streamlined process, you can have your token live on Solana within 24-48 hours. This includes token creation, website setup, and initial marketing materials. The actual launch timing depends on market conditions and your chosen strategy.',
  },
  {
    question: 'What kind of returns can I expect?',
    answer: 'Returns vary significantly based on market conditions, token narrative, and execution of the marketing strategy. Our members have seen returns ranging from 2x to over 30x. However, crypto is inherently risky and past performance does not guarantee future results.',
  },
  {
    question: 'Do I need technical knowledge?',
    answer: 'No technical knowledge is required. We handle all the technical aspects including smart contract deployment, website development, and wallet integration. You focus on the creative and marketing aspects while we handle the tech.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept SOL (Solana) as our primary payment method. All transactions are conducted on-chain for transparency and security. For larger packages, we can arrange custom payment terms.',
  },
  {
    question: 'Is there ongoing support after launch?',
    answer: 'Absolutely! Our team provides 24/7 support during the critical first week after launch. We also offer extended support packages and community management services for long-term success.',
  },
  {
    question: 'Can I launch multiple tokens?',
    answer: 'Yes! Many of our most successful members run multiple projects. We offer discounts for returning launchers and can help you build a portfolio of tokens across different narratives and market conditions.',
  },
];

export const FAQSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="faqs" className="py-24 px-4 relative" ref={sectionRef}>
      <div className="container max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">FAQs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before joining the degen army.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card rounded-2xl border-0 overflow-hidden px-6"
                >
                  <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
