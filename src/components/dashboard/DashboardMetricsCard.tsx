/**
 * Componente de métricas do dashboard — Enhanced with CRO principles
 * 
 * 🧠 Psychological Principle: Loss Aversion (Kahneman & Tversky)
 * People feel losses ~2x more intensely than equivalent gains. By framing
 * declining metrics as "lost customers" instead of neutral numbers, we
 * create urgency that drives merchant action.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DashboardMetrics } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { analyticsService } from '@/lib/analytics';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Animated counter hook for engaging number reveals
function useAnimatedCounter(target: number, duration = 1000): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animFrame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) animFrame.current = requestAnimationFrame(animate);
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [target, duration]);

  return count;
}

// Business Health Score calculation
function calculateHealthScore(metrics: DashboardMetrics): { score: number; label: string; color: string } {
  let score = 0;
  // Active campaigns (20 pts)
  if (metrics.activeCampaigns > 0) score += 20;
  // Customer base (20 pts)
  if (metrics.totalCustomers >= 10) score += 20;
  else if (metrics.totalCustomers >= 5) score += 10;
  else if (metrics.totalCustomers > 0) score += 5;
  // Engagement rate (20 pts)
  if (metrics.engagementRate >= 50) score += 20;
  else if (metrics.engagementRate >= 25) score += 15;
  else if (metrics.engagementRate > 0) score += 5;
  // Conversion rate (20 pts)
  if (metrics.conversionRate >= 30) score += 20;
  else if (metrics.conversionRate >= 15) score += 15;
  else if (metrics.conversionRate > 0) score += 5;
  // Points distributed (20 pts)
  if (metrics.pointsDistributed >= 100) score += 20;
  else if (metrics.pointsDistributed >= 50) score += 15;
  else if (metrics.pointsDistributed > 0) score += 5;

  if (score >= 80) return { score, label: 'Excelente', color: 'text-emerald-600' };
  if (score >= 60) return { score, label: 'Bom', color: 'text-blue-600' };
  if (score >= 40) return { score, label: 'Regular', color: 'text-amber-600' };
  return { score, label: 'Precisa de Atenção', color: 'text-red-600' };
}

// Trend indicator component
const TrendBadge: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '%' }) => {
  if (value === 0) return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Estável
    </span>
  );
  const isPositive = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
      isPositive 
        ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
        : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40'
    }`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  );
};

export const DashboardMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isLoaded = useRef(false);
  useEffect(() => {
    if (!isLoaded.current) {
      loadMetrics();
      isLoaded.current = true;
    }
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await dashboardService.getHomeMetrics();
      setMetrics(data);
    } catch (error) {
      setErrorMessage('Erro ao carregar métricas. Tente novamente.');
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animated values
  const animatedCustomers = useAnimatedCounter(metrics?.totalCustomers ?? 0, 1200);
  const animatedPoints = useAnimatedCounter(metrics?.pointsDistributed ?? 0, 1500);

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-4 h-20 bg-muted/20"></CardContent>
        </Card>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
          <button
            onClick={loadMetrics}
            className="mt-2 text-xs text-red-600 hover:underline font-bold"
          >
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const health = calculateHealthScore(metrics);

  const metricCards = [
    {
      title: 'Campanhas Ativas',
      value: metrics.activeCampaigns || 0,
      displayValue: String(metrics.activeCampaigns || 0),
      description: metrics.activeCampaigns === 0 
        ? '⚠️ Você não tem campanhas ativas — clientes podem estar indo para a concorrência'
        : 'Campanhas em andamento',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      needsAttention: metrics.activeCampaigns === 0,
    },
    {
      title: 'Total de Clientes',
      value: metrics.totalCustomers || 0,
      displayValue: String(animatedCustomers),
      description: 'Clientes fidelizados',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Pontos Distribuídos',
      value: metrics.pointsDistributed || 0,
      displayValue: animatedPoints.toLocaleString(),
      description: 'Acúmulo total',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-500">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Taxa de Engajamento',
      value: metrics.engagementRate || 0,
      displayValue: `${(metrics.engagementRate || 0).toFixed(1)}%`,
      description: metrics.engagementRate < 20 
        ? '⚠️ Engajamento baixo — seus clientes precisam de mais incentivos'
        : 'Últimos 30 dias',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-500">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      needsAttention: metrics.engagementRate < 20,
    },
    {
      title: 'Taxa de Conversão',
      value: metrics.conversionRate || 0,
      displayValue: `${(metrics.conversionRate || 0).toFixed(1)}%`,
      description: 'Iniciados vs. Resgatados',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-600">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
    {
      title: 'Cartões Expirados',
      value: metrics.expirationVolume || 0,
      displayValue: String(metrics.expirationVolume || 0),
      description: metrics.expirationVolume > 0
        ? `⚠️ ${metrics.expirationVolume} clientes perderam o cartão — considere estender prazos`
        : 'Nenhum cartão expirado',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      needsAttention: (metrics.expirationVolume || 0) > 0,
    },
  ];

  const usagePercentage = metrics.monthlyLimit > 0 
    ? Math.min(100, Math.round(((metrics.monthlyLimit - metrics.availableCards) / metrics.monthlyLimit) * 100))
    : 0;

  return (
    <div className="space-y-4 mb-8">
      {/* Business Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-muted/60 overflow-hidden bg-gradient-to-r from-card via-card to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                  <motion.circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    className={health.color}
                    strokeDasharray={`${(health.score / 100) * 88} 88`}
                    initial={{ strokeDasharray: '0 88' }}
                    animate={{ strokeDasharray: `${(health.score / 100) * 88} 88` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-black ${health.color}`}>{health.score}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Saúde do Negócio</h3>
                  <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    health.score >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                    health.score >= 60 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                    health.score >= 40 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                    'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                  }`}>
                    {health.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {health.score >= 80 
                    ? 'Seu programa de fidelidade está performando muito bem!'
                    : health.score >= 60 
                      ? 'Bom progresso! Algumas áreas podem melhorar.'
                      : 'Atenção: seu programa precisa de ajustes para gerar resultados.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <Card 
              className={`transition-all hover:shadow-md border-muted/60 cursor-pointer group ${
                card.needsAttention ? 'animate-pulse-attention ring-1 ring-amber-200 dark:ring-amber-800/50' : ''
              }`}
              onClick={() => analyticsService.track('dashboard_metric_clicked', { metric_name: card.title })}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TrendBadge value={0} />
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight animate-count-up">{card.displayValue}</div>
                <p className={`text-xs mt-1 ${card.needsAttention ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground'}`}>
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {metrics.monthlyLimit > 0 && (
        <Card className="border-muted/60 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  Status do Plano
                </div>
                <div className="text-lg font-bold">
                  {metrics.availableCards || 0} <span className="text-sm font-normal text-muted-foreground">cartões disponíveis de {metrics.monthlyLimit || 0} no total</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-md w-full space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>{usagePercentage}% utilizado este mês</span>
                  <span className={usagePercentage > 90 ? 'text-red-600 font-bold' : ''}>
                    {(metrics.monthlyLimit || 0) - (metrics.availableCards || 0)} / {metrics.monthlyLimit || 0}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full transition-all duration-500 ${
                      usagePercentage > 90 
                        ? 'bg-red-500' 
                        : usagePercentage > 75 
                          ? 'bg-amber-500' 
                          : 'bg-primary'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                {usagePercentage > 80 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Seu limite está quase no fim. Faça upgrade para não perder clientes.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
