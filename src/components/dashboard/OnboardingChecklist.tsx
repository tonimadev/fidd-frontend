'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/lib/dashboard-service';
import { accountService } from '@/lib/account-service';
import { campaignService } from '@/lib/campaign-service';
import { analyticsService } from '@/lib/analytics';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Megaphone,
  Ticket,
  Stamp,
  Trophy
} from 'lucide-react';

/**
 * 🧠 Psychological Principle: Zeigarnik Effect + Commitment & Consistency (Cialdini)
 *
 * The Zeigarnik Effect states that people remember and feel compelled to complete
 * unfinished tasks. By showing a progress bar with clear remaining steps, merchants
 * feel an intrinsic pull to complete setup.
 *
 * Commitment & Consistency: Each small completed step creates psychological momentum.
 * People who complete step 1 are 3x more likely to complete step 5.
 */

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

import { DashboardTab } from '@/types/dashboard';

interface OnboardingChecklistProps {
  onNavigate: (tab: DashboardTab) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stepStates, setStepStates] = useState({
    profile: false,
    address: false,
    campaign: false,
    invitation: false,
    stamp: false,
  });

  const checkSteps = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profile, campaigns, metrics] = await Promise.allSettled([
        accountService.getProfile(),
        campaignService.listCampaigns(),
        dashboardService.getHomeMetrics(),
      ]);

      const profileData = profile.status === 'fulfilled' ? profile.value : null;
      const campaignData = campaigns.status === 'fulfilled' ? campaigns.value : [];
      const metricsData = metrics.status === 'fulfilled' ? metrics.value : null;

      setStepStates({
        profile: !!(user?.tradeName && user?.email),
        address: !!profileData?.address,
        campaign: campaignData.length > 0,
        invitation: (metricsData?.totalCustomers ?? 0) > 0,
        stamp: (metricsData?.pointsDistributed ?? 0) > 0,
      });
    } catch (err) {
      console.error('Erro ao verificar onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkSteps();
  }, [checkSteps]);

  // Check localStorage for dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem('fidd_onboarding_dismissed');
    if (dismissed === 'true') setIsDismissed(true);
  }, []);

  const steps: OnboardingStep[] = useMemo(() => [
    {
      id: 'profile',
      title: 'Complete seu Perfil',
      description: 'Adicione nome e dados da sua loja',
      icon: <Sparkles className="w-4 h-4" />,
      completed: stepStates.profile,
      action: () => onNavigate('settings'),
      actionLabel: 'Editar Perfil',
    },
    {
      id: 'address',
      title: 'Configure seu Endereço',
      description: 'Permita que clientes encontrem sua loja',
      icon: <MapPin className="w-4 h-4" />,
      completed: stepStates.address,
      action: () => onNavigate('settings'),
      actionLabel: 'Adicionar Endereço',
    },
    {
      id: 'campaign',
      title: 'Crie sua Primeira Campanha',
      description: 'Defina as regras do seu cartão de fidelidade',
      icon: <Megaphone className="w-4 h-4" />,
      completed: stepStates.campaign,
      action: () => onNavigate('campaigns'),
      actionLabel: 'Criar Campanha',
    },
    {
      id: 'invitation',
      title: 'Gere seu Primeiro Convite',
      description: 'Compartilhe com seus clientes',
      icon: <Ticket className="w-4 h-4" />,
      completed: stepStates.invitation,
      action: () => onNavigate('campaigns'),
      actionLabel: 'Gerar Convites',
    },
    {
      id: 'stamp',
      title: 'Primeiro Selo Distribuído',
      description: 'Carimbe o cartão de um cliente',
      icon: <Stamp className="w-4 h-4" />,
      completed: stepStates.stamp,
      action: () => onNavigate('nfc'),
      actionLabel: 'Emitir Selo',
    },
  ], [stepStates, onNavigate]);

  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const isComplete = completedCount === totalSteps;

  // Auto-dismiss when all complete
  useEffect(() => {
    if (isComplete && !isDismissed) {
      analyticsService.track('onboarding_completed');
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000); // Show congrats for 5s then dismiss
      return () => clearTimeout(timer);
    }
  }, [isComplete, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('fidd_onboarding_dismissed', 'true');
  };

  if (isDismissed || isLoading) return null;

  // If fully complete, show celebration state
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="animate-slide-up"
      >
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-800/50 overflow-hidden">
          <CardContent className="py-6 flex items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-full text-white animate-badge-pop">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-lg">Tudo Pronto! 🎉</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Sua loja está 100% configurada. Agora é só fidelizar!
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-emerald-600 hover:bg-emerald-100"
            >
              Fechar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-slide-up"
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Configure sua Loja</CardTitle>
                <CardDescription className="text-xs">
                  {completedCount}/{totalSteps} passos concluídos — faltam apenas {totalSteps - completedCount}!
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-primary">{progressPercent}%</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 pb-4">
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        step.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'bg-card/50 hover:bg-card/80 border border-border/50'
                      }`}
                    >
                      {step.completed ? (
                        <div className="text-emerald-500 animate-badge-pop">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <Circle className="w-5 h-5" />
                        </div>
                      )}
                      <div className={`flex items-center gap-2 ${step.completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                      </div>
                      {!step.completed && step.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            analyticsService.track('onboarding_step_clicked', { step: step.id });
                            step.action?.();
                          }}
                          className="text-xs text-primary hover:bg-primary/10 shrink-0"
                        >
                          {step.actionLabel}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleDismiss}
                  className="mt-3 text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-medium"
                >
                  Pular configuração
                </button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
