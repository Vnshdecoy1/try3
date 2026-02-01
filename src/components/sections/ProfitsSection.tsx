import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const projects = [
  { name: '$BEARMAS', profit: '+1,200%', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop' },
  { name: '$PEPE2', profit: '+800%', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop' },
  { name: '$DOGE99', profit: '+2,500%', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=300&fit=crop' },
  { name: '$MOON', profit: '+650%', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop' },
  { name: '$ROCKET', profit: '+1,800%', image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=400&h=300&fit=crop' },
  { name: '$SHIB2', profit: '+3,200%', image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop' },
];

export const ProfitsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="profits" className="py-24 px-4 relative overflow-hidden" ref={sectionRef}>
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">Our </span>
            <span className="gradient-text">Profits</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real results from real launches. These are actual returns from our community members.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group gpu-accelerated"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <motion.div
                  animate={{
                    y: hoveredIndex === index ? 0 : 10,
                    opacity: hoveredIndex === index ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                    {project.name}
                  </h3>
                  <span className="text-2xl md:text-3xl font-bold gradient-text">
                    {project.profit}
                  </span>
                </motion.div>
              </div>

              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 border-2 border-loq-purple/0 rounded-2xl"
                animate={{
                  borderColor: hoveredIndex === index ? 'hsl(var(--loq-purple) / 0.5)' : 'hsl(var(--loq-purple) / 0)',
                  boxShadow: hoveredIndex === index ? '0 0 30px hsl(var(--loq-purple) / 0.3)' : '0 0 0 transparent',
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Featured Case Study */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 glass-card rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-loq-pink text-sm font-semibold uppercase tracking-wider">
                Case Study
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                <span className="gradient-text">$BEARMAS</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                From zero to $2.4M market cap in 48 hours. This Christmas-themed memecoin 
                captured the holiday spirit and delivered massive returns for early holders.
              </p>
              <div className="flex gap-6">
                <div>
                  <span className="text-3xl font-bold gradient-text">+1,200%</span>
                  <p className="text-sm text-muted-foreground">ROI</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-foreground">48h</span>
                  <p className="text-sm text-muted-foreground">To ATH</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-foreground">15K+</span>
                  <p className="text-sm text-muted-foreground">Holders</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop"
                alt="$BEARMAS Case Study"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-loq-gradient opacity-20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
