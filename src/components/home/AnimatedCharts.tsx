'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';

const dailyData = [
  { day: 'Seg', selos: 45 },
  { day: 'Ter', selos: 52 },
  { day: 'Qua', selos: 38 },
  { day: 'Qui', selos: 65 },
  { day: 'Sex', selos: 89 },
  { day: 'Sáb', selos: 110 },
  { day: 'Dom', selos: 95 },
];

const growthData = [
  { month: 'Jan', clientes: 120 },
  { month: 'Fev', clientes: 210 },
  { month: 'Mar', clientes: 450 },
  { month: 'Abr', clientes: 680 },
  { month: 'Mai', clientes: 920 },
  { month: 'Jun', clientes: 1450 },
];

const retentionData = [
  { name: 'Retidos', value: 65, color: 'var(--primary)' },
  { name: 'Novos', value: 35, color: '#e2e8f0' },
];

export const AnimatedCharts = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 overflow-hidden">
      {/* Gráfico de Barras Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-[1.5] bg-white rounded-3xl p-4 shadow-xl border border-slate-100 min-h-[160px]"
      >
        <h4 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest text-center">Engajamento Semanal</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#f8fafc', radius: 4 }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            />
            <Bar 
              dataKey="selos" 
              fill="url(#barGradient)" 
              radius={[4, 4, 0, 0]}
              animationBegin={500}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-[140px]">
        {/* Gráfico de Pizza (Retenção) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 bg-white rounded-3xl p-3 shadow-xl border border-slate-100 flex flex-col items-center justify-center"
        >
          <h4 className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest">Retenção</h4>
          <div className="relative w-full h-full max-h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black text-primary">65%</span>
            </div>
          </div>
        </motion.div>

        {/* Gráfico de Linha (Crescimento) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 bg-white rounded-3xl p-3 shadow-xl border border-slate-100 flex flex-col"
        >
          <h4 className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest text-center">Crescimento</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <Line 
                type="monotone" 
                dataKey="clientes" 
                stroke="var(--primary)" 
                strokeWidth={3} 
                dot={false}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center">
            <span className="text-[10px] font-black text-green-500">+12% mês</span>
          </div>
        </motion.div>
      </div>

      {/* Card de Resumo Rápido */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-primary rounded-2xl p-3 shadow-lg flex justify-between items-center text-white"
      >
        <div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/80 opacity-80">Total de Selos</p>
          <p className="text-xl font-black">12.450</p>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
          className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold"
        >
          AO VIVO
        </motion.div>
      </motion.div>
    </div>
  );
};
