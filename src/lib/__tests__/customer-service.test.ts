/**
 * Testes para customer-service.ts
 */

import { customerService } from '@/lib/customer-service';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCustomers', () => {
    it('deve retornar lista de clientes', async () => {
      const mockCustomers = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          totalCards: 5,
          activeCards: 1,
          lastActivity: '2026-03-01',
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          totalCards: 3,
          activeCards: 0,
          lastActivity: '2026-01-15',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockCustomers,
      });

      const result = await customerService.listCustomers();

      expect(result).toEqual(mockCustomers);
      expect(apiClient.get).toHaveBeenCalledWith('/api/web/v1/customers');
    });

    it('deve lançar erro ao falhar na requisição', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(customerService.listCustomers()).rejects.toThrow('API Error');
    });
  });
});
