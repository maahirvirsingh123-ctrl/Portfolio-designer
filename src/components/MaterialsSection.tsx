import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SiteSettings, subscribeToSettings } from '../services/settingsService';

export const MaterialsSection = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  if (!settings || !settings.materialsItems || settings.materialsItems.length === 0) return null;

  return (
    <section className="bg-brand-dark overflow-hidden">
      <div className="section-container">
        <div className="mb-24 max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-6 block">
            Craftsmanship
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-none mb-8">
            {settings.materialsTitle || 'MATERIALS & TEXTURES'}
          </h2>
          <p className="text-white/40 text-xl font-serif italic leading-relaxed">
            {settings.materialsDescription || 'We believe in the tactile language of architecture. Every surface is a choice, every joint a conversation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {settings.materialsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-square overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-light mb-2 tracking-tight">{item.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed font-serif italic">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
