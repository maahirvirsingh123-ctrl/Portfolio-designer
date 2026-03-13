import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449156001935-d2863fb72690?auto=format&fit=crop&q=80&w=2070" 
          alt="Architectural Detail"
          className="w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent">Principal Designer</span>
              <div className="h-px w-20 bg-brand-accent/30" />
            </div>
            
            <h1 className="text-[12vw] md:text-[10vw] font-light leading-[0.85] tracking-tighter mb-12">
              VIKRAM <br />
              <span className="italic font-normal ml-[10vw]">MALHOTRA</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <p className="text-xl md:text-2xl font-serif italic text-white/60 leading-relaxed">
                Crafting structural narratives that bridge the gap between human experience and the built environment.
              </p>
              
              <div className="flex flex-col items-end gap-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 text-right">
                  BASED IN BANGALORE, INDIA <br />
                  WORKING GLOBALLY
                </div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-px h-24 bg-gradient-to-b from-brand-accent to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vertical Labels */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="vertical-text font-mono text-[10px] uppercase tracking-[0.8em] text-white/20">
          ARCHITECTURE // CONSTRUCTION // INTERIORS
        </div>
      </div>
    </section>
  );
};
