'use client';

import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '@/lib/admin-service';
import { 
  Store, 
  Users, 
  Megaphone, 
  RefreshCw 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total de Lojistas',
      value: stats?.totalStores ?? 0,
      icon: Store,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Total de Clientes',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Campanhas Ativas',
      value: stats?.activeCampaigns ?? 0,
      icon: Megaphone,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
        <button 
          onClick={fetchStats}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bem-vindo ao Painel Admin</h2>
        <p className="text-gray-600">
          Aqui você pode gerenciar os lojistas do Fidd e visualizar o crescimento da plataforma. 
          Novas funcionalidades administrativas serão adicionadas aqui gradualmente.
        </p>
      </div>
    </div>
  );
}
