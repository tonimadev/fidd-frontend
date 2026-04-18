'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star } from 'lucide-react';

export const AnimatedStampCard = () => {
  const [stamps, setStamps] = useState<number[]>([]);
  const totalStamps = 10;
  const rewardPoints = [5, 10]; // Selos que dão recompensa

  useEffect(() => {
    const interval = setInterval(() => {
      setStamps((prev) => {
        if (prev.length >= totalStamps) return [];
        return [...prev, prev.length];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 overflow-hidden">
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-slate-800">Café do Ponto</h3>
        <p className="text-sm font-bold text-primary uppercase tracking-widest">Cartão Fidelidade</p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: totalStamps }).map((_, index) => {
          const pointNumber = index + 1;
          const isFilled = stamps.includes(index);
          const isRewardPoint = rewardPoints.includes(pointNumber);
          
          return (
            <motion.div
              key={index}
              animate={{
                scale: isFilled ? 1 : 0.8,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={`aspect-square rounded-full flex items-center justify-center relative border-2 transition-colors duration-300 ${
                isFilled
                  ? 'bg-primary border-primary shadow-lg shadow-primary/20'
                  : isRewardPoint 
                    ? 'bg-primary/5 border-primary border-dashed'
                    : 'bg-slate-50 border-slate-200'
              }`}
            >
              <AnimatePresence>
                {isFilled ? (
                  <motion.div
                    initial={{ scale: 2, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <Check size={20} strokeWidth={4} />
                  </motion.div>
                ) : isRewardPoint ? (
                  <div className="text-primary opacity-40">
                    <Star size={16} fill="currentColor" />
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-slate-300">{pointNumber}</span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seu Progresso</span>
          <span className="text-sm font-black text-primary">
            {stamps.length} / {totalStamps}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stamps.length / totalStamps) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {stamps.length === totalStamps && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3"
          >
            <div className="bg-green-500 text-white p-1 rounded-full">
              <Check size={12} strokeWidth={4} />
            </div>
            <p className="text-[10px] font-black text-green-700 uppercase tracking-tight">Prêmio Liberado!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
