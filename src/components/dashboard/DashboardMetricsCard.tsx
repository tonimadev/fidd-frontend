/**
 * Componente de métricas do dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardMetrics } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-service';

export const DashboardMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadMetrics();
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
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-12 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <button
            onClick={loadMetrics}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Bem-vindo ao FIDD!</h2>
        <p className="text-gray-600 mt-2">
          Gerenciamento completo de campanhas de fidelização para sua loja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Campanhas Ativas */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{metrics.activeCampaigns}</div>
          <p className="text-gray-700 text-sm font-medium mt-2">Campanhas Ativas</p>
          <p className="text-gray-600 text-xs mt-1">Campanhas em andamento</p>
        </div>

        {/* Total de Clientes */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-600">{metrics.totalCustomers}</div>
          <p className="text-gray-700 text-sm font-medium mt-2">Total de Clientes</p>
          <p className="text-gray-600 text-xs mt-1">Clientes em programa</p>
        </div>

        {/* Pontos Distribuídos */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{metrics.pointsDistributed}</div>
          <p className="text-gray-700 text-sm font-medium mt-2">Pontos Distribuídos</p>
          <p className="text-gray-600 text-xs mt-1">Total acumulado</p>
        </div>

        {/* Taxa de Engajamento */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="text-3xl font-bold text-orange-600">{metrics.engagementRate.toFixed(2)}%</div>
          <p className="text-gray-700 text-sm font-medium mt-2">Taxa de Engajamento</p>
          <p className="text-gray-600 text-xs mt-1">Últimos 30 dias</p>
        </div>
      </div>
    </div>
  );
};

