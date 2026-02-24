/**
 * Testes para dashboard-service.ts
 */

import { dashboardService } from '@/lib/dashboard-service';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('dashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHomeMetrics', () => {
    it('deve retornar métricas do dashboard', async () => {
      const mockMetrics = {
        activeCampaigns: 3,
        totalCustomers: 25,
        pointsDistributed: 450,
        engagementRate: 78.5,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockMetrics,
      });

      const result = await dashboardService.getHomeMetrics();

      expect(result).toEqual(mockMetrics);
      expect(result.activeCampaigns).toBe(3);
      expect(result.totalCustomers).toBe(25);
      expect(result.pointsDistributed).toBe(450);
      expect(result.engagementRate).toBe(78.5);
      expect(apiClient.get).toHaveBeenCalledWith('/api/web/v1/dashboard/home');
    });

    it('deve retornar zero para todas as métricas quando não há dados', async () => {
      const mockMetrics = {
        activeCampaigns: 0,
        totalCustomers: 0,
        pointsDistributed: 0,
        engagementRate: 0,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockMetrics,
      });

      const result = await dashboardService.getHomeMetrics();

      expect(result.activeCampaigns).toBe(0);
      expect(result.totalCustomers).toBe(0);
    });

    it('deve lançar erro ao falhar na requisição', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(dashboardService.getHomeMetrics()).rejects.toThrow('API Error');
    });
  });
});

