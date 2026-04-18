'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { StoreInsights } from '@/types/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
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

export const InsightsDashboard: React.FC = () => {
  const [data, setData] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30'); // days
  const router = useRouter();

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

  if (error === 'PRO_ONLY') {
    return (
      <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary/10 p-4 rounded-full text-primary">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="max-w-md">
          <CardTitle className="text-2xl mb-2 text-foreground">Funcionalidade Exclusiva PRO</CardTitle>
          <CardDescription className="text-lg">
            Aumente o faturamento do seu negócio com dados detalhados e insights estratégicos do seu programa de fidelidade.
          </CardDescription>
        </div>
        <Button onClick={() => router.push('/dashboard?tab=subscriptions')}>
          Ver Planos PRO
        </Button>
      </Card>
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Insights Estratégicos</h2>
          <p className="text-muted-foreground">
            Descubra padrões de comportamento e potencialize seus resultados.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
          <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none p-1.5 pr-8 cursor-pointer"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => fetchInsights()} className="h-8 w-8 p-0">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor do Cliente (LTV)</CardDescription>
            <CardTitle className="text-3xl text-foreground">
              {data.ltv?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Estimativa de receita por cliente (6 meses)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Taxa de Retenção</CardDescription>
            <CardTitle className="text-3xl text-foreground">{data.retentionRate?.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" /> Clientes que retornaram no período
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Taxa de Churn</CardDescription>
            <CardTitle className="text-3xl text-foreground text-amber-600">{data.churnRate?.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3 text-amber-500" /> Probabilidade de perda de clientes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Previsão de Receita</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">
              {data.revenueForecast?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" /> Potencial de caixa dos cartões ativos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Taxa de Conclusão</CardDescription>
            <CardTitle className="text-3xl text-foreground">{data.completionRate.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Conversão para resgate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Média de Retorno</CardDescription>
            <CardTitle className="text-3xl text-foreground">{data.averageReturnTimeDays.toFixed(1)} dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" /> Entre o primeiro e último selo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fidelity Funnel */}
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-foreground">Funil de Fidelidade</CardTitle>
          <CardDescription>Jornada do cliente desde o primeiro selo até a recompensa.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[
                { name: '1º Selo', value: 100, displayValue: '100%', fill: '#3b82f6' },
                { name: 'Metade (50%)', value: 75, displayValue: '75%', fill: '#6366f1' },
                { name: 'Resgate', value: data.completionRate, displayValue: `${data.completionRate.toFixed(1)}%`, fill: '#8b5cf6' },
                { name: 'Retorno', value: data.retentionRate || 0, displayValue: `${(data.retentionRate || 0).toFixed(1)}%`, fill: '#ec4899' },
              ]}
              margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversão']} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                {/* Custom label for percentage */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
             <div>Aquisição</div>
             <div>Engajamento</div>
             <div>Conversão</div>
             <div>Retenção</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Day Volume Bar Chart */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-foreground">Movimentação por Dia</CardTitle>
            <CardDescription className="text-muted-foreground">Volume total de selos emitidos em cada dia da semana.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--card)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Bar dataKey="volume" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Rate Chart */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-foreground">Funil de Conclusão</CardTitle>
            <CardDescription className="text-muted-foreground">Percentual de cartões que chegam ao resgate final.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
             <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'var(--muted)'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-3xl font-bold text-foreground">{data.completionRate.toFixed(1)}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Taxa Final</div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-foreground">Top Clientes da Fidelização</CardTitle>
          <CardDescription className="text-muted-foreground">Os clientes mais engajados no último mês.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground font-bold">
                  <th className="pb-3 pl-2">Cliente</th>
                  <th className="pb-3 text-center">Selos Acumulados</th>
                  <th className="pb-3 text-center">Resgates Realizados</th>
                  <th className="pb-3 text-right pr-2">Engajamento</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 pl-2 flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black border border-primary/20 group-hover:scale-110 transition-transform">
                         {customer.customerName.charAt(0).toUpperCase()}
                       </div>
                       <span className="font-semibold text-foreground">{customer.customerName}</span>
                    </td>
                    <td className="py-4 text-center text-foreground font-medium">{customer.totalPunches}</td>
                    <td className="py-4 text-center text-foreground font-medium">{customer.totalRedemptions}</td>
                    <td className="py-4 text-right pr-2">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-tighter">
                         ALTO
                      </div>
                    </td>
                  </tr>
                ))}
                {data.topCustomers.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-12 text-center text-muted-foreground italic">Nenhum dado de cliente encontrado para este período.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
