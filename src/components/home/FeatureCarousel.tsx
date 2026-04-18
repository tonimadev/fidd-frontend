'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Feature {
  id: number;
  title: string;
  description: string;
  render: () => React.ReactNode;
}

interface FeatureCarouselProps {
  features: Feature[];
}

export const FeatureCarousel: React.FC<FeatureCarouselProps> = ({ features }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
  }, [features.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
  }, [features.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 8000);
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
    const total = features.length;
    const diff = (index - currentIndex + total) % total;
    
    if (diff === 0) return "center";
    if (diff === 1 || (diff === - (total - 1))) return "right";
    if (diff === total - 1 || diff === -1) return "left";
    return "hidden";
  };

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4 py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[650px] overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {features.map((feature, index) => {
            const position = getPosition(index);
            if (position === "hidden") return null;

            return (
              <motion.div
                key={feature.id}
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
                className="absolute w-full flex flex-col justify-center items-center"
              >
                <div className={`relative group w-[300px] transition-all duration-500 ${position !== 'center' ? 'pointer-events-none' : ''}`}>
                  {/* Efeito de brilho MD3 */}
                  {position === 'center' && (
                    <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  )}
                  
                  {/* Moldura do Celular Estilo MD3 */}
                  <div className={`relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl overflow-hidden transition-shadow duration-500 ${position !== 'center' ? 'grayscale opacity-50' : ''}`}>
                    <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.2rem] bg-slate-50 flex flex-col">
                      {/* Status Bar Mock */}
                      <div className="h-8 bg-transparent flex justify-between items-center px-6 pt-2">
                        <span className="text-[10px] font-bold text-slate-800">12:41</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-slate-800/20" />
                          <div className="w-3 h-3 rounded-full bg-slate-800/20" />
                        </div>
                      </div>

                      <div className="flex-1 w-full p-2 overflow-hidden flex items-center justify-center">
                        {feature.render()}
                      </div>

                      {/* Home Indicator */}
                      <div className="h-6 flex justify-center items-center">
                        <div className="w-16 h-1 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Título e Descrição (apenas para o central) */}
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: position === 'center' ? 1 : 0,
                    y: position === 'center' ? 0 : 20 
                  }}
                  className="mt-12 text-center max-w-sm"
                >
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 font-medium">{feature.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controles */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white text-primary rounded-full shadow-xl hover:bg-slate-50 transition-all transform active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white text-primary rounded-full shadow-xl hover:bg-slate-50 transition-all transform active:scale-90"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="flex justify-center gap-3 mt-8">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group"
          >
            <motion.div
              animate={{
                width: currentIndex === index ? 24 : 8,
                backgroundColor: currentIndex === index ? "var(--primary)" : "#cbd5e1",
              }}
              className="h-2 rounded-full transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
