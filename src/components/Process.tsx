import { motion } from 'motion/react';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Site analysis and objective definition.'
  },
  {
    number: '02',
    title: 'Concept',
    description: 'Modular and sustainable design ideation.'
  },
  {
    number: '03',
    title: 'Execution',
    description: 'Structural precision and project management.'
  },
  {
    number: '04',
    title: 'Handover',
    description: 'Final fit-out and infrastructure integration.'
  }
];

export const Process = () => {
  return (
    <section className="bg-brand-dark border-t border-white/5">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-6"
            >
              <div className="font-mono text-[10px] text-brand-accent tracking-widest">{step.number}</div>
              <h3 className="text-2xl font-light tracking-tight">{step.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed font-serif italic">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
