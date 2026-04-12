'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  { id: 1, src: '/screenshots/1.png', alt: 'Screenshot 1 - Início' },
  { id: 2, src: '/screenshots/2.png', alt: 'Screenshot 2 - Campanhas' },
  { id: 3, src: '/screenshots/3.png', alt: 'Screenshot 3 - Perfil' },
  { id: 4, src: '/screenshots/4.png', alt: 'Screenshot 4 - QR Code' },
];

export const AppScreenshotsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1));
  }, []);

  const goToSlide = (index: number) => {
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

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto px-4 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container Principal do Carrossel */}
      <div className="relative overflow-hidden rounded-[3rem] p-4 sm:p-8">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {screenshots.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0 flex justify-center items-center px-4">
              <div className="relative group max-w-[280px] sm:max-w-[320px]">
                {/* Efeito de brilho ao fundo */}
                <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-accent/30 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                
                {/* Moldura do Celular */}
                <div className="relative bg-background rounded-[2.5rem] p-3 sm:p-4 shadow-2xl border border-border ring-8 ring-slate-900/5 overflow-hidden">
                  <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                      priority={item.id === 1}
                    />
                  </div>
                </div>
                
                {/* Legenda/Tag */}
                <div className="mt-6 text-center">
                   <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full">
                      <span className="text-xs font-bold uppercase tracking-widest">{item.alt}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles: Setas */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-border text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 md:-translate-x-4 lg:-translate-x-8"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-border text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 md:translate-x-4 lg:translate-x-8"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores: Pontos (Dots) */}
      <div className="flex justify-center gap-3 mt-8">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-8 h-2.5 bg-primary' 
                : 'w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
