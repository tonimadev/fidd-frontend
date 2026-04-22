/**
 * PRO Upgrade Gate — Enhanced with Anchoring & Scarcity
 *
 * 🧠 Psychological Principle: Anchoring Effect + Scarcity
 * The first piece of information (value anchor) serves as a reference point.
 * By showing "R$ 2.400/mês em clientes recuperados" BEFORE the price,
 * the R$ 50/mês feels like a bargain. Scarcity ("12 lojistas fizeram upgrade hoje")
 * creates urgency through social comparison.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { analyticsService } from '@/lib/analytics';

interface ProUpgradeGateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  featurePreview?: React.ReactNode;
}

const proValueProps = [
  { icon: <TrendingUp className="w-4 h-4" />, text: 'Insights detalhados de LTV, Churn e Retenção' },
  { icon: <Zap className="w-4 h-4" />, text: 'Automação de e-mails para recuperar clientes inativos' },
  { icon: <Users className="w-4 h-4" />, text: 'Motor de indicações para crescimento viral' },
  { icon: <Shield className="w-4 h-4" />, text: 'Suporte prioritário e campanhas ilimitadas' },
];

export const ProUpgradeGate: React.FC<ProUpgradeGateProps> = ({ title, description, icon, featurePreview }) => {
  const router = useRouter();
  const [upgradeCount, setUpgradeCount] = useState(0);

  // Simulated social proof (in production, fetch from API)
  useEffect(() => {
    setUpgradeCount(Math.floor(Math.random() * 8) + 5);
    analyticsService.track('pro_gate_viewed', { feature: title });
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-dashed border-2 border-primary/20 overflow-hidden relative">
        {/* Blurred preview behind the gate */}
        {featurePreview && (
          <div className="pro-blur-preview absolute inset-0 z-0">
            {featurePreview}
          </div>
        )}

        <div className="relative z-10 p-12 flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-b from-card/95 via-card/90 to-card/95 backdrop-blur-sm">
          {/* Crown icon with golden shimmer */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/30 dark:to-amber-900/20 p-5 rounded-full animate-glow-gold">
              {icon || <Crown className="w-10 h-10 text-amber-500" />}
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-badge-pop">
              Pro
            </div>
          </div>

          <div className="max-w-lg space-y-2">
            <CardTitle className="text-2xl mb-2 text-foreground">{title}</CardTitle>
            <CardDescription className="text-lg whitespace-pre-line">
              {description}
            </CardDescription>
          </div>

          {/* Value Anchor — shown BEFORE price (Anchoring Effect) */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-800/30 max-w-md w-full">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Valor médio gerado para lojistas PRO
            </p>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
              +R$ 2.400<span className="text-lg font-medium">/mês</span>
            </p>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              em clientes recuperados e novas indicações
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full text-left">
            {proValueProps.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="text-primary shrink-0">{prop.icon}</div>
                <span>{prop.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={() => {
              analyticsService.track('pro_gate_cta_clicked', { feature: title });
              router.push('/dashboard?tab=subscriptions');
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold h-12 px-8 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30"
          >
            <Crown className="w-4 h-4 mr-2" />
            Desbloquear Recursos PRO
          </Button>

          {/* Social proof counter (Scarcity + Social Proof) */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[8px] font-bold text-primary">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="font-medium">
              <span className="text-primary font-bold">{upgradeCount} lojistas</span> fizeram upgrade hoje
            </span>
          </div>

          {/* Guarantee badge (Zero Risk Bias) */}
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Garantia de 30 dias • Cancele quando quiser
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
