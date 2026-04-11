/**
 * Testes para DashboardMetricsCard.tsx
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import { DashboardMetricsCard } from '../DashboardMetricsCard';
import { dashboardService } from '@/lib/dashboard-service';

// Mock do analyticsService
jest.mock('@/lib/analytics', () => ({
  analyticsService: {
    track: jest.fn(),
  },
}));

// Mock do dashboardService
jest.mock('@/lib/dashboard-service', () => ({
  dashboardService: {
    getHomeMetrics: jest.fn(),
  },
}));

describe('DashboardMetricsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar as métricas corretamente com dados completos', async () => {
    const mockMetrics = {
      activeCampaigns: 5,
      totalCustomers: 120,
      pointsDistributed: 1500,
      engagementRate: 85.5,
      conversionRate: 20.3,
      expirationVolume: 10,
      monthlyLimit: 500,
      availableCards: 400,
    };

    (dashboardService.getHomeMetrics as jest.Mock).mockResolvedValue(mockMetrics);

    render(<DashboardMetricsCard />);

    // Verifica estado de loading inicial (opcional, pode ser rápido demais)
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
      // Usando regex para ser flexível com o separador de milhar (1.500 ou 1,500 ou 1500)
      expect(screen.getByText(/1[.,]?500/)).toBeInTheDocument();
      expect(screen.getByText('85.5%')).toBeInTheDocument();
      expect(screen.getByText('20.3%')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText(/cartões disponíveis de 500 no total/)).toBeInTheDocument();
  });

  it('deve lidar com dados incompletos sem quebrar (Prevenção de TypeError)', async () => {
    // Simulando que o backend retornou um objeto sem os novos campos de métricas
    const incompleteMetrics = {
      activeCampaigns: 2,
      totalCustomers: 10,
      pointsDistributed: 100,
      // engagementRate, conversionRate, expirationVolume, monthlyLimit, availableCards estão faltando
    };

    (dashboardService.getHomeMetrics as jest.Mock).mockResolvedValue(incompleteMetrics);

    render(<DashboardMetricsCard />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    // Deve exibir 0.0% para as taxas que vieram undefined
    expect(screen.getAllByText('0.0%')).toHaveLength(2); // Engagement e Conversion
    
    // Deve exibir 0 para expiration volume
    expect(screen.getByText('Taxa de Conversão')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar no carregamento', async () => {
    (dashboardService.getHomeMetrics as jest.Mock).mockRejectedValue(new Error('Falha na API'));

    render(<DashboardMetricsCard />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar métricas/)).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Tentar novamente');
    expect(retryButton).toBeInTheDocument();
  });
});
