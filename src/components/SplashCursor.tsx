import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function SplashCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newParticles: Particle[] = [];
      const particleCount = 8;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
        });
      }
      
      setParticles((prev) => [...prev, ...newParticles]);
      
      // Remove particles after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle, index) => {
          const angle = (index % 8) * (Math.PI * 2 / 8);
          const distance = 60;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500"
              style={{
                left: particle.x,
                top: particle.y,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: 0,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
