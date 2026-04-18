'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { StoreInsights } from '@/types/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  ArrowDownRight, 
  Clock, 
  Zap,
  Filter,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { isUserPro } from '@/lib/auth-utils';
import { ProUpgradeGate } from './ProUpgradeGate';

export const InsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30'); // days
  
  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await apiClient.get<StoreInsights>('/api/web/v1/dashboard/insights', {
        params: { startDate, endDate }
      });
      setData(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('PRO_ONLY');
      } else {
        setError((err as Error).message || 'Erro ao carregar insights');
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-muted-foreground">Carregando insights...</div>;
  }
  
  const isPro = isUserPro(user);

  if (error === 'PRO_ONLY' || !isPro) {
    return (
      <ProUpgradeGate 
        title="Insights Estratégicos PRO"
        description="Aumente o faturamento do seu negócio com dados detalhados e insights estratégicos do seu programa de fidelidade."
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Erro ao carregar dados: {error}</span>
      </div>
    );
  }

  if (!data) return null;

  // Process data for Day of Week Bar Chart
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayVolume = days.map((day, index) => {
    const count = data.heatmap
      .filter(h => h.dayOfWeek === index)
      .reduce((sum, h) => sum + h.count, 0);
    return { name: day, volume: count };
  });

  // Pie chart for completion rate
  const completionData = [
    { name: 'Concluídos', value: data.completionRate },
    { name: 'Em Aberto', value: Math.max(0, 100 - data.completionRate) }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Insights Estratégicos</h2>
          <p className="text-muted-foreground font-medium">
            Descubra padrões de comportamento e potencialize seus resultados com inteligência de dados.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 shadow-sm">
          <Filter className="w-4 h-4 ml-2 text-slate-400" />
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none p-1.5 pr-8 cursor-pointer text-slate-600"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => fetchInsights()} className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl">
            <RefreshCw className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valor do Cliente (LTV)</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900">
                {data.ltv?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> 
                </div>
                <span>Estimativa de receita por cliente (6 meses)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Taxa de Retenção</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900">{data.retentionRate?.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-blue-50 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span>Clientes que retornaram no período</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Taxa de Churn</CardDescription>
              <CardTitle className="text-4xl font-black text-amber-600">{data.churnRate?.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-amber-50 rounded-lg">
                  <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span>Probabilidade de perda de clientes</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Previsão de Receita</CardDescription>
              <CardTitle className="text-4xl font-black text-emerald-600">
                {data.revenueForecast?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-emerald-50 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>Potencial de caixa dos cartões ativos</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Taxa de Conclusão</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900">{data.completionRate.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <span>Conversão para resgate de benefícios</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Média de Retorno</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900">{data.averageReturnTimeDays.toFixed(1)} dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <div className="p-1 bg-blue-50 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span>Tempo médio entre selos emitidos</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fidelity Funnel */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Funil de Fidelidade</CardTitle>
            <CardDescription className="text-sm font-bold text-slate-400">Jornada do cliente desde o primeiro selo até a recompensa.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: '1º Selo', value: 100, fill: 'url(#blueGradient)' },
                  { name: 'Metade (50%)', value: 75, fill: 'url(#indigoGradient)' },
                  { name: 'Resgate', value: data.completionRate, fill: 'url(#purpleGradient)' },
                  { name: 'Retorno', value: data.retentionRate || 0, fill: 'url(#pinkGradient)' },
                ]}
                margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="indigoGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontWeight: 800, fontSize: 11, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 8 }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversão']} 
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 8, 8, 0]} 
                  barSize={32}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
               <div className="flex flex-col items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 Aquisição
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 Engajamento
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-purple-500" />
                 Conversão
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-pink-500" />
                 Retenção
               </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Day Volume Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Movimentação por Dia</CardTitle>
              <CardDescription className="text-sm font-bold text-slate-400">Volume total de selos emitidos em cada dia da semana.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayVolume}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 8 }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="url(#primaryGradient)" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Rate Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Funil de Conclusão</CardTitle>
              <CardDescription className="text-sm font-bold text-slate-400">Percentual de cartões que chegam ao resgate final.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
               <div className="relative w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={105}
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {completionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? 'var(--primary)' : '#f1f5f9'} 
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-4xl font-black text-slate-900">{data.completionRate.toFixed(1)}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Taxa Final</div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Customers Table */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white rounded-[2rem] shadow-xl border-slate-100 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Clientes da Fidelização</CardTitle>
            <CardDescription className="text-sm font-bold text-slate-400">Os clientes mais engajados no último mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                    <th className="pb-4 pl-4">Cliente</th>
                    <th className="pb-4 text-center">Selos Acumulados</th>
                    <th className="pb-4 text-center">Resgates Realizados</th>
                    <th className="pb-4 text-right pr-4">Engajamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCustomers.map((customer, index) => (
                    <tr key={index} className="border-b border-slate-50/50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 pl-4 flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                           {customer.customerName.charAt(0).toUpperCase()}
                         </div>
                         <span className="font-bold text-slate-700">{customer.customerName}</span>
                      </td>
                      <td className="py-4 text-center text-slate-600 font-black">{customer.totalPunches}</td>
                      <td className="py-4 text-center text-slate-600 font-black">{customer.totalRedemptions}</td>
                      <td className="py-4 text-right pr-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-widest">
                           ALTO
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.topCustomers.length === 0 && (
                     <tr>
                       <td colSpan={4} className="py-12 text-center text-slate-400 italic font-medium">Nenhum dado de cliente encontrado para este período.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
