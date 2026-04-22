/**
 * Upgrade Modal — Enhanced with Value Comparison
 *
 * 🧠 Psychological Principle: Loss Visualization + Anchoring
 * Showing what the user is missing RIGHT NOW with their actual data
 * makes the upgrade feel urgent and personally relevant.
 */

'use client';

import React from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Shield } from 'lucide-react';
import { analyticsService } from '@/lib/analytics';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const featureComparison = [
  { feature: 'Campanhas ativas', free: '1', pro: 'Ilimitadas' },
  { feature: 'Cartões por mês', free: '20', pro: '500' },
  { feature: 'Insights & Métricas', free: false, pro: true },
  { feature: 'Automação Win-back', free: false, pro: true },
  { feature: 'Motor de Indicações', free: false, pro: true },
  { feature: 'Suporte Prioritário', free: false, pro: true },
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, title, description }) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Golden header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl" />
            <div className="relative z-10">
              <Crown className="w-10 h-10 mx-auto mb-3 animate-float" />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="text-sm text-amber-100 mt-1 whitespace-pre-line">{description}</p>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="p-6 space-y-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="pb-2 text-left">Recurso</th>
                  <th className="pb-2 text-center">Grátis</th>
                  <th className="pb-2 text-center text-amber-600">PRO</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-foreground font-medium">{row.feature}</td>
                    <td className="py-2.5 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.free}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />
                      ) : (
                        <span className="font-bold text-amber-600">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold h-12 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30"
                onClick={() => {
                  analyticsService.track('upgrade_modal_cta_clicked', { title });
                  onClose();
                  router.push('/dashboard?tab=subscriptions');
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Fazer Upgrade Agora
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={onClose}
              >
                Talvez mais tarde
              </Button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Garantia de 30 dias • Cancele quando quiser
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
