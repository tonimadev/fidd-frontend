'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  { id: 1, src: '/screenshots/1.png', alt: 'Início do App' },
  { id: 2, src: '/screenshots/2.png', alt: 'Gerenciar Campanhas' },
  { id: 3, src: '/screenshots/3.png', alt: 'Perfil do Usuário' },
  { id: 4, src: '/screenshots/4.png', alt: 'Leitura de QR Code' },
];

export const AppScreenshotsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1));
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [nextSlide, isPaused]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      zIndex: 2,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.5,
    }),
    left: {
      zIndex: 1,
      x: -320,
      opacity: 0.4,
      scale: 0.8,
    },
    right: {
      zIndex: 1,
      x: 320,
      opacity: 0.4,
      scale: 0.8,
    }
  };

  const getPosition = (index: number) => {
    const total = screenshots.length;
    const diff = (index - currentIndex + total) % total;
    
    if (diff === 0) return "center";
    if (diff === 1 || (diff === - (total - 1))) return "right";
    if (diff === total - 1 || diff === -1) return "left";
    return "hidden";
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto px-4 py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container Principal do Carrossel */}
      <div className="relative h-[650px] overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {screenshots.map((screenshot, index) => {
            const position = getPosition(index);
            if (position === "hidden") return null;

            return (
              <motion.div
                key={screenshot.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate={position}
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;

                  if (swipe < -10000) {
                    nextSlide();
                  } else if (swipe > 10000) {
                    prevSlide();
                  }
                }}
                className="absolute w-full flex justify-center items-center cursor-grab active:cursor-grabbing"
              >
                <div className={`relative group w-[260px] sm:w-[300px] transition-all duration-500 ${position !== 'center' ? 'pointer-events-none' : ''}`}>
                  {/* Efeito de brilho MD3 (apenas no centro) */}
                  {position === 'center' && (
                    <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  )}
                  
                  {/* Moldura do Celular Estilo MD3 */}
                  <div className={`relative bg-surface rounded-[2.5rem] p-3 shadow-m3-3 overflow-hidden transition-shadow duration-500 ${position !== 'center' ? 'shadow-m3-1' : ''}`}>
                    <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.8rem] bg-surface-variant/20">
                      <Image
                        src={screenshot.src}
                        alt={screenshot.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 400px"
                        priority={position === 'center'}
                      />
                      
                      {/* Overlay sutil para realismo */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Legenda MD3 (apenas no centro) */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                      opacity: position === 'center' ? 1 : 0,
                      y: position === 'center' ? 0 : 10 
                    }}
                    className="mt-8 text-center"
                  >
                     <div className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-m3-full shadow-m3-1">
                        <span className="text-sm font-semibold tracking-wide">{screenshot.alt}</span>
                     </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controles: Setas Estilizadas MD3 */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-surface text-primary rounded-m3-full shadow-m3-1 hover:shadow-m3-2 hover:bg-surface-variant/30 transition-all transform active:scale-90"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-surface text-primary rounded-m3-full shadow-m3-1 hover:shadow-m3-2 hover:bg-surface-variant/30 transition-all transform active:scale-90"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores: MD3 Dots */}
      <div className="flex justify-center gap-4 mt-4">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative h-3 flex items-center"
            aria-label={`Ir para slide ${index + 1}`}
          >
            <motion.div
              animate={{
                width: currentIndex === index ? 32 : 12,
                backgroundColor: currentIndex === index ? "var(--primary)" : "var(--outline-variant)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-3 rounded-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
