import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SiteSettings, subscribeToSettings } from '../services/settingsService';

export const Navbar = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif text-2xl tracking-tighter text-white"
        >
          {settings?.heroTitle1 && settings?.heroTitle2 
            ? `${settings.heroTitle1} ${settings.heroTitle2}`
            : 'Vikram Malhotra'}
        </motion.div>

        <div className="hidden md:flex items-center gap-12">
          {['Works', 'About', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>
        
        <div className="md:hidden font-mono text-[10px] uppercase tracking-widest text-white">Menu</div>
      </div>
    </nav>
  );
};
