import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SiteSettings, subscribeToSettings } from '../services/settingsService';

export const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  if (!settings) return null;

  return (
    <section id="contact" className="bg-brand-dark">
      <div className="section-container">
        <div className="mb-32">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-6 block">Contact</span>
          <h2 className="text-[8vw] md:text-[6vw] font-light leading-none tracking-tighter">
            START A <br />
            <span className="italic ml-[4vw]">CONVERSATION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
          <div className="space-y-12">
            <p className="text-2xl md:text-3xl font-serif italic text-white/60 leading-relaxed max-w-md">
              Available for high-impact collaborations and strategic design consulting.
            </p>
            
            <div className="space-y-4">
              <a href={`mailto:${settings.contactEmail || 'v.malhotra@maavisprojects.com'}`} className="block text-4xl md:text-5xl font-light hover:text-brand-accent transition-colors break-all">
                {settings.contactEmail || 'v.malhotra@maavisprojects.com'}
              </a>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/20">
                {settings.contactAddress || 'BANGALORE // MUMBAI // DUBAI'}
              </div>
              {settings.contactPhone && (
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/20">
                  {settings.contactPhone}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex gap-8">
              {['LinkedIn', 'Instagram', 'Twitter'].map(social => (
                <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/10 font-bold">
              © 2026 VIKRAM MALHOTRA. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
