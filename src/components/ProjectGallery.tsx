import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryProps {
  images: string[];
  title: string;
}

export const ProjectGallery: React.FC<GalleryProps> = ({ images, title }) => {
  const [index, setIndex] = useState<number | null>(null);

  const next = () => {
    if (index === null) return;
    setIndex((index + 1) % images.length);
  };

  const prev = () => {
    if (index === null) return;
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <div className="mt-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="aspect-square overflow-hidden cursor-pointer relative group"
            onClick={() => setIndex(i)}
          >
            <img 
              src={img} 
              alt={`${title} gallery ${i}`} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="text-white w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setIndex(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button 
              onClick={prev}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
            >
              <ChevronLeft size={48} />
            </button>

            <button 
              onClick={next}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
            >
              <ChevronRight size={48} />
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full aspect-[16/10]"
            >
              <img 
                src={images[index]} 
                alt={`${title} full`} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-12 left-0 font-mono text-[10px] uppercase tracking-widest text-white/30">
                IMAGE {index + 1} OF {images.length} // {title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
