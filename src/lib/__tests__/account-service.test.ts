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

  describe('API Keys', () => {
    it('deve listar chaves de API', async () => {
      const mockKeys = [{ id: 1, name: 'Test Key' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockKeys });

      const result = await accountService.listApiKeys();

      expect(result).toEqual(mockKeys);
      expect(apiClient.get).toHaveBeenCalledWith('/api/web/v1/api-keys');
    });

    it('deve criar chave de API', async () => {
      const mockKey = { id: 1, name: 'New Key' };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockKey });

      const result = await accountService.createApiKey({ name: 'New Key' });

      expect(result).toEqual(mockKey);
      expect(apiClient.post).toHaveBeenCalledWith('/api/web/v1/api-keys', { name: 'New Key' });
    });

    it('deve revogar chave de API', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({});

      await accountService.revokeApiKey(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/web/v1/api-keys/1');
    });
  });
});

