import { motion } from 'motion/react';
import { AWARDS, TESTIMONIALS } from '../constants';

export const Recognition = () => {
  return (
    <section className="bg-brand-dark border-t border-white/5">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Awards */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-12 block">Recognition</span>
            <div className="space-y-12">
              {AWARDS.map((award, index) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-8 group"
                >
                  <div className="font-serif text-2xl italic text-white/20 group-hover:text-brand-accent transition-colors">{award.year}</div>
                  <div>
                    <h3 className="text-2xl font-light mb-2">{award.title}</h3>
                    <p className="text-white/30 text-xs uppercase tracking-widest">{award.organization}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="lg:pt-24">
            <div className="space-y-24">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <p className="text-2xl md:text-3xl font-serif italic text-white/60 leading-relaxed mb-12">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-px bg-white/10" />
                    <div>
                      <div className="text-sm font-bold">{testimonial.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/30">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
