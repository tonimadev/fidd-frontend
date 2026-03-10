/**
 * Componente de métricas do dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardMetrics } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const DashboardMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isLoaded = React.useRef(false);
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

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  const metricCards = [
    {
      title: 'Campanhas Ativas',
      value: metrics.activeCampaigns,
      description: 'Campanhas em andamento',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: 'Total de Clientes',
      value: metrics.totalCustomers,
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
      value: metrics.pointsDistributed.toLocaleString(),
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
      value: `${metrics.engagementRate.toFixed(1)}%`,
      description: 'Últimos 30 dias',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-500">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  const usagePercentage = metrics.monthlyLimit > 0 
    ? Math.min(100, Math.round(((metrics.monthlyLimit - metrics.availableCards) / metrics.monthlyLimit) * 100))
    : 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <Card key={i} className="transition-all hover:shadow-md border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
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
                  {metrics.availableCards} <span className="text-sm font-normal text-muted-foreground">cartões disponíveis de {metrics.monthlyLimit} no total</span>
                </div>
              </div>
              
              <div className="flex-1 max-w-md w-full space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>{usagePercentage}% utilizado este mês</span>
                  <span className={usagePercentage > 90 ? 'text-red-600 font-bold' : ''}>
                    {metrics.monthlyLimit - metrics.availableCards} / {metrics.monthlyLimit}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      usagePercentage > 90 
                        ? 'bg-red-500' 
                        : usagePercentage > 75 
                          ? 'bg-amber-500' 
                          : 'bg-primary'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

