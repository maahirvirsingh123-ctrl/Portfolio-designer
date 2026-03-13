import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SiteSettings, subscribeToSettings } from '../services/settingsService';

export const Philosophy = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  if (!settings) return null;

  return (
    <section id="about" className="relative overflow-hidden bg-brand-dark">
      <div className="section-container">
        <div className="split-layout gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-12 block">
              {settings.philosophySubtitle || 'Philosophy'}
            </span>
            <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] mb-16">
              {(settings.philosophyTitle || 'FORM FOLLOWS FEELING').split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? 'italic font-normal' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            <div className="max-w-md">
              <p className="text-white/40 text-xl leading-relaxed font-serif italic mb-12">
                {settings.philosophyDescription || 'Architecture is not just about space; it is about the emotional resonance of the structures we inhabit.'}
              </p>
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-brand-accent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Vikram Malhotra</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="relative mt-24 lg:mt-0"
          >
            <div className="aspect-[3/4] overflow-hidden grayscale contrast-125">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1974" 
                alt="Vikram Malhotra"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 hidden md:block">
              <div className="vertical-text font-mono text-[10px] uppercase tracking-[1em] text-white/10">
                PRINCIPAL DESIGNER // MAAVIS PROJECTS
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
