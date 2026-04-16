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
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError('Não foi possível carregar os indicadores do painel agora.');
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
          <p className="mt-1 text-sm text-gray-500">Acompanhe os principais indicadores do ambiente administrativo.</p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchStats}
              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 font-medium text-red-700 hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Bem-vindo ao Painel Admin</h2>
        <p className="text-gray-600">
          Aqui você pode gerenciar os lojistas do Fidd e visualizar o crescimento da plataforma. 
          Novas funcionalidades administrativas serão adicionadas aqui gradualmente.
        </p>
      </div>
    </div>
  );
}
