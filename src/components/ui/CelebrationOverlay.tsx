'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { analyticsService } from '@/lib/analytics';

/**
 * 🧠 Psychological Principle: Variable Ratio Reinforcement (Skinner) + Peak-End Rule
 *
 * Variable Ratio Reinforcement creates the strongest behavioral habits.
 * The Peak-End Rule says people judge experiences by their emotional peak
 * and how they end. A celebration at key moments creates memorable peaks
 * that reinforce continued usage.
 */

export type CelebrationType = 
  | 'redemption'       // Customer redeemed a prize
  | 'first_campaign'   // First campaign created
  | 'milestone'        // 100th customer, etc.
  | 'stamp'            // Stamp applied
  | 'upgrade'          // Upgraded to Pro
  | 'onboarding';      // Completed onboarding

interface CelebrationOverlayProps {
  type: CelebrationType;
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  autoCloseMs?: number;
}

const celebrationConfig: Record<CelebrationType, { 
  emoji: string; 
  defaultTitle: string;
  defaultSubtitle: string;
  confettiColors: string[];
}> = {
  redemption: {
    emoji: '🎁',
    defaultTitle: 'Prêmio Resgatado!',
    defaultSubtitle: 'Seu cliente acaba de resgatar uma recompensa',
    confettiColors: ['#FFD700', '#FF6B00', '#FF8F4D', '#FFEC8B'],
  },
  first_campaign: {
    emoji: '🚀',
    defaultTitle: 'Campanha Criada!',
    defaultSubtitle: 'Sua primeira campanha está no ar',
    confettiColors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'],
  },
  milestone: {
    emoji: '🏆',
    defaultTitle: 'Marco Atingido!',
    defaultSubtitle: 'Você alcançou um novo patamar',
    confettiColors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4'],
  },
  stamp: {
    emoji: '⭐',
    defaultTitle: 'Selo Aplicado!',
    defaultSubtitle: 'Mais um passo na jornada do cliente',
    confettiColors: ['#FF6B00', '#FF8F4D', '#FFB347', '#FFCC33'],
  },
  upgrade: {
    emoji: '👑',
    defaultTitle: 'Bem-vindo ao PRO!',
    defaultSubtitle: 'Agora você tem acesso a todos os recursos premium',
    confettiColors: ['#FFD700', '#C0C0C0', '#B8860B', '#DAA520'],
  },
  onboarding: {
    emoji: '🎉',
    defaultTitle: 'Setup Completo!',
    defaultSubtitle: 'Sua loja está pronta para fidelizar',
    confettiColors: ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6'],
  },
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  type,
  isVisible,
  onClose,
  title,
  subtitle,
  autoCloseMs = 3500,
}) => {
  const config = celebrationConfig[type];

  const fireConfetti = useCallback(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const defaults = {
      colors: config.confettiColors,
      disableForReducedMotion: true,
    };

    // Burst from center
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      startVelocity: 45,
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
      });
      confetti({
        ...defaults,
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
      });
    }, 250);
  }, [config.confettiColors]);

  useEffect(() => {
    if (isVisible) {
      fireConfetti();
      analyticsService.track('celebration_shown', { type });

      const timer = setTimeout(onClose, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, fireConfetti, onClose, autoCloseMs, type]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 max-w-sm mx-4 text-center pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 10 }}
              className="text-6xl mb-4"
            >
              {config.emoji}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black text-foreground mb-2"
            >
              {title || config.defaultTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              {subtitle || config.defaultSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
