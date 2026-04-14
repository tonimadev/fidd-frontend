/**
 * Testes para admin-service.ts
 */

import { adminService } from '@/lib/admin-service';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('deve buscar estatísticas administrativas', async () => {
      const mockStats = {
        totalStores: 10,
        totalCustomers: 100,
        activeCampaigns: 5,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockStats });

      const result = await adminService.getStats();

      expect(result).toEqual(mockStats);
      expect(apiClient.get).toHaveBeenCalledWith('/api/admin/v1/stats');
    });
  });

  describe('getStores', () => {
    it('deve buscar listagem paginada de lojistas', async () => {
      const mockPagedResponse = {
        content: [
          {
            id: 1,
            tradeName: 'Store 1',
            email: 'store1@example.com',
            isActive: true,
          },
          {
            id: 2,
            tradeName: 'Store 2',
            email: 'store2@example.com',
            isActive: false,
          },
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPagedResponse });

      const result = await adminService.getStores(0, 10);

      expect(result).toEqual(mockPagedResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/api/admin/v1/stores?page=0&size=10');
    });

    it('deve usar valores padrão para paginação', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: { content: [] } });

      await adminService.getStores();

      expect(apiClient.get).toHaveBeenCalledWith('/api/admin/v1/stores?page=0&size=10');
    });
  });

  describe('updateStoreStatus', () => {
    it('deve atualizar o status de uma loja', async () => {
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: {} });

      await adminService.updateStoreStatus(1, false);

      expect(apiClient.patch).toHaveBeenCalledWith('/api/admin/v1/stores/1/status', {
        isActive: false,
      });
    });
  });
});
