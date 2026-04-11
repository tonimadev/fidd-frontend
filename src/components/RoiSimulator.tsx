'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, TrendingUp, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const RoiSimulator: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Estados dos Inputs
  const [stampCount, setStampCount] = useState<number>(10);
  const [currentVisits, setCurrentVisits] = useState<number>(2);
  const [averageTicket, setAverageTicket] = useState<number>(20.00);
  const [profitMargin, setProfitMargin] = useState<number>(50);
  const [rewardValue, setRewardValue] = useState<number>(20.00);

  // Lógica de Cálculo (Derivada do estado)
  const calculations = useMemo(() => {
    // Cenário Atual (Sem Fidelidade)
    const currentRevenue = currentVisits * averageTicket;
    const currentProfit = currentRevenue * (profitMargin / 100);

    // Cenário com Fidelidade (Completando o cartão)
    const loyaltyRevenue = stampCount * averageTicket;
    const rewardCost = rewardValue * (1 - (profitMargin / 100));
    const loyaltyGrossProfit = loyaltyRevenue * (profitMargin / 100);
    const finalProfit = loyaltyGrossProfit - rewardCost;
    
    // Métricas de Sucesso
    const incrementalProfit = finalProfit - currentProfit;
    const roi = (incrementalProfit / currentProfit) * 100;
    const equivalentDiscount = (rewardValue / (loyaltyRevenue + rewardValue)) * 100;

    return {
      currentRevenue,
      currentProfit,
      loyaltyRevenue,
      rewardCost,
      finalProfit,
      incrementalProfit,
      roi,
      equivalentDiscount,
      maxProfit: Math.max(currentProfit, finalProfit)
    };
  }, [stampCount, currentVisits, averageTicket, profitMargin, rewardValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'percent', 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1 
    }).format(value / 100);
  };

  const handleCreateCampaign = () => {
    if (!isAuthenticated) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const params = new URLSearchParams({
      tab: 'campaigns',
      action: 'create',
      stampCount: stampCount.toString(),
      averageTicket: averageTicket.toString(),
      profitMargin: profitMargin.toString(),
      rewardValue: rewardValue.toString()
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Coluna da Esquerda: Inputs */}
        <div className="p-8 lg:p-10 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Simulador de ROI</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Descubra o lucro real do seu programa de fidelidade</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Current Visits */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Visitas sem Fidelidade (Média)</label>
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{currentVisits} {currentVisits === 1 ? 'visita' : 'visitas'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentVisits}
                onChange={(e) => setCurrentVisits(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 visita</span>
                <span>5 visitas</span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-1">Quantas vezes o cliente volta hoje sem programa de fidelidade</p>
            </div>

            {/* Stamp Count */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Qtd. de Selos no Cartão</label>
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{stampCount} selos</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={stampCount}
                onChange={(e) => setStampCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>5 selos</span>
                <span>20 selos</span>
              </div>
            </div>

            {/* Average Ticket */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ticket Médio (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                <input
                  type="number"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="20,00"
                />
              </div>
              <p className="text-[11px] text-slate-400">Valor médio que o cliente gasta por visita</p>
            </div>

            {/* Profit Margin */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Margem de Lucro (%)</label>
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{profitMargin}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="1"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>10%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Reward Value */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor da Recompensa (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                <input
                  type="number"
                  value={rewardValue}
                  onChange={(e) => setRewardValue(Number(e.target.value))}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="20,00"
                />
              </div>
              <p className="text-[11px] text-slate-400">Preço de venda do prêmio que o cliente ganhará</p>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Resultados */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Análise de Retorno</h3>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                calculations.roi > 50 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : calculations.roi > 0 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {calculations.roi > 50 ? 'Altamente Lucrativo' : calculations.roi > 0 ? 'Lucrativo' : 'Ajuste sua Meta'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Faturamento Extra</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(calculations.loyaltyRevenue - calculations.currentRevenue)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Custo do Brinde</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(calculations.rewardCost)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lucro Atual (Sem Fidd)</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(calculations.currentProfit)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Aumento de Lucro</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{formatPercent(calculations.roi)}</p>
              </div>
            </div>

            {/* Lucro Final Destacado */}
            <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200 dark:shadow-none mb-10 transform hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium opacity-90 uppercase tracking-widest">Lucro com Fidelidade</p>
                <div className="p-1 bg-white/20 rounded-full">
                  <Info className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-4xl font-extrabold">{formatCurrency(calculations.finalProfit)}</p>
              <p className="text-xs mt-2 opacity-80 font-medium">Lucro real após o cliente completar o cartão</p>
            </div>

            {/* Gráfico Visual */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Lucro com Fidelidade (Fidd)</span>
                  <span className="text-emerald-600">{formatCurrency(calculations.finalProfit)}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(calculations.finalProfit / (calculations.maxProfit || 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Lucro Atual (Sem Fidelidade)</span>
                  <span>{formatCurrency(calculations.currentProfit)}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-500" 
                    style={{ width: `${(calculations.currentProfit / (calculations.maxProfit || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button 
              onClick={handleCreateCampaign}
              className="w-full h-14 rounded-2xl text-lg font-bold gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
            >
              Criar campanha com esses parâmetros
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
              Aumente seu faturamento com retenção inteligente
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
