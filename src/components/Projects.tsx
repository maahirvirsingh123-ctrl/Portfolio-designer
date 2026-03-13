import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToProjects } from '../services/projectService';
import { Project } from '../types';
import { ProjectGallery } from './ProjectGallery';

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToProjects(setProjects);
    return () => unsubscribe();
  }, []);

  return (
    <section id="works" className="bg-brand-dark">
      <div className="section-container">
        <div className="mb-32">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-6 block">Selected Works</span>
          <h2 className="text-[8vw] md:text-[6vw] font-light leading-none tracking-tighter">
            SIGNATURE <br />
            <span className="italic ml-[4vw]">PORTFOLIO</span>
          </h2>
        </div>

        <div className="space-y-60">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-12"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
                <div className="w-full lg:w-3/5 aspect-[4/5] md:aspect-[16/10] overflow-hidden relative group">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div className="w-full lg:w-2/5 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{project.year}</span>
                    <div className="h-px w-12 bg-white/10" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{project.category}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-light tracking-tighter">{project.title}</h3>
                  
                  <p className="text-white/50 text-lg leading-relaxed font-serif italic">
                    {project.description}
                  </p>

                  <div className="pt-8 grid grid-cols-2 gap-8">
                    {project.stats?.map(stat => (
                      <div key={stat.label}>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{stat.label}</div>
                        <div className="text-xl font-serif">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <ProjectGallery images={project.gallery} title={project.title} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
