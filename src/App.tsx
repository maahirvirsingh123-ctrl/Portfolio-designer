import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Philosophy } from './components/Philosophy';
import { Process } from './components/Process';
import { Recognition } from './components/Recognition';
import { Contact } from './components/Contact';
import { motion, useScroll, useSpring } from 'framer-motion';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AuthProvider>
      <div className="bg-brand-dark text-white selection:bg-brand-accent selection:text-brand-dark">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <div className="relative">
            {/* Progress Bar */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-1 bg-brand-accent z-[60] origin-left"
              style={{ scaleX }}
            />

            <Navbar />
            
            <main>
              <Hero />
              <Philosophy />
              <Projects />
              <Process />
              <Recognition />
              <Contact />
            </main>

            <footer className="py-12 text-center border-t border-white/5 bg-brand-dark">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="font-serif italic text-2xl tracking-tighter">VIKRAM MALHOTRA</div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">
                © 2026 MAAVIS PROJECTS // ALL RIGHTS RESERVED
              </p>
            </footer>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}
