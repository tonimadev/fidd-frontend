/**
 * Testes para account-service.ts
 */

import { accountService } from '@/lib/account-service';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('accountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeleteStatus', () => {
    it('deve retornar status de conta ativa', async () => {
      const mockStatus = {
        status: 'ACTIVE',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockStatus,
      });

      const result = await accountService.getDeleteStatus();

      expect(result).toEqual(mockStatus);
      expect(apiClient.get).toHaveBeenCalledWith('/api/web/v1/account/delete');
    });

    it('deve retornar status de deleção pendente', async () => {
      const mockStatus = {
        status: 'PENDING_DELETION',
        scheduledDeletionDate: '2026-03-26T14:35:00Z',
        daysRemaining: 30,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockStatus,
      });

      const result = await accountService.getDeleteStatus();

      expect(result).toEqual(mockStatus);
      expect(result.status).toBe('PENDING_DELETION');
    });
  });

  describe('requestAccountDeletion', () => {
    it('deve marcar conta para deleção', async () => {
      const mockStatus = {
        status: 'PENDING_DELETION',
        scheduledDeletionDate: '2026-03-26T14:35:00Z',
      };

      (apiClient.put as jest.Mock).mockResolvedValue({
        data: mockStatus,
      });

      const result = await accountService.requestAccountDeletion('Password123!@');

      expect(result.status).toBe('PENDING_DELETION');
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/web/v1/account/delete',
        { password: 'Password123!@' }
      );
    });

    it('deve lançar erro para senha incorreta', async () => {
      (apiClient.put as jest.Mock).mockRejectedValue(new Error('Invalid password'));

      await expect(accountService.requestAccountDeletion('WrongPassword')).rejects.toThrow(
        'Invalid password'
      );
    });
  });

  describe('cancelAccountDeletion', () => {
    it('deve cancelar deleção e reativar conta', async () => {
      const mockStatus = {
        status: 'ACTIVE',
        message: 'Deleção cancelada. Conta ativa novamente.',
      };

      (apiClient.delete as jest.Mock).mockResolvedValue({
        data: mockStatus,
      });

      const result = await accountService.cancelAccountDeletion();

      expect(result.status).toBe('ACTIVE');
      expect(apiClient.delete).toHaveBeenCalledWith('/api/web/v1/account/delete');
    });
  });
});

