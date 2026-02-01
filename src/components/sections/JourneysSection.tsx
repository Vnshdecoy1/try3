import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'CryptoKing',
    handle: '@cryptoking_sol',
    quote: 'Went from zero knowledge to launching my first token in 3 days. The support is insane.',
    avatar: 'https://i.pravatar.cc/100?img=1',
    profit: '+850%',
  },
  {
    name: 'DegenQueen',
    handle: '@degenqueen',
    quote: 'Best investment I ever made. My first launch did 12x and the community is incredible.',
    avatar: 'https://i.pravatar.cc/100?img=2',
    profit: '+1,200%',
  },
  {
    name: 'SolanaWhale',
    handle: '@solanawhale',
    quote: 'The hype strategy alone is worth 10x the price. These guys know what they are doing.',
    avatar: 'https://i.pravatar.cc/100?img=3',
    profit: '+2,100%',
  },
  {
    name: 'MoonBoy',
    handle: '@moonboy_degen',
    quote: 'Launched 3 successful tokens now. Each one bigger than the last. Forever grateful.',
    avatar: 'https://i.pravatar.cc/100?img=4',
    profit: '+650%',
  },
];

const projects = [
  {
    name: 'Bullish Degen',
    description: 'Community-driven meme token with unique burn mechanics',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
    status: 'Live',
  },
  {
    name: 'ZKForge',
    description: 'Privacy-focused utility token on Solana',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=200&fit=crop',
    status: 'Launching',
  },
  {
    name: 'Own Nothing',
    description: 'Anti-establishment memecoin with strong narrative',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=300&h=200&fit=crop',
    status: 'Coming Soon',
  },
];

export const JourneysSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="journeys" className="py-24 px-4 relative" ref={sectionRef}>
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">Success </span>
            <span className="gradient-text">Journeys</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from real degens who've transformed their crypto journey.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <Quote className="w-12 h-12 text-loq-purple/30 mb-6" />
            
            <div className="relative h-[200px] overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{
                    opacity: currentTestimonial === index ? 1 : 0,
                    x: currentTestimonial === index ? 0 : -100,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 ${currentTestimonial === index ? 'z-10' : 'z-0'}`}
                >
                  <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                    </div>
                    <span className="ml-auto text-2xl font-bold gradient-text">
                      {testimonial.profit}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full glass-card hover:bg-loq-purple/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentTestimonial === index
                        ? 'w-8 bg-loq-purple'
                        : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full glass-card hover:bg-loq-purple/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground uppercase tracking-wider text-sm mb-8">
            Trusted By Influencers
          </p>
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground max-w-3xl mx-auto">
            "The only team I trust with my launches. Professional, reliable, and they deliver results."
          </blockquote>
        </motion.div>

        {/* Project Showcase */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group gpu-accelerated"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Live' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : project.status === 'Launching'
                      ? 'bg-loq-purple/20 text-loq-purple border border-loq-purple/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{project.name}</h3>
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
