/**
 * Testes para auth-service.ts
 */

import { authService } from '@/lib/auth-service';
import { apiClient } from '@/lib/api-client';
import { storage } from '@/lib/storage';

jest.mock('@/lib/api-client');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve fazer login com email e senha válidos', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          type: 'Bearer',
          storeId: 1,
          tradeName: 'Test Store',
          email: 'test@example.com',
          role: 'STORE',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/web/v1/auth/login',
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    it('deve lançar erro para credenciais inválidas', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        authService.login({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('deve registrar uma nova loja', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          type: 'Bearer',
          storeId: 1,
          tradeName: 'New Store',
          email: 'new@example.com',
          role: 'STORE',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register({
        tradeName: 'New Store',
        taxId: '12345678000195',
        taxIdType: 'CNPJ',
        email: 'new@example.com',
        password: 'Password123!@',
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/web/v1/auth/register',
        expect.objectContaining({
          tradeName: 'New Store',
          taxId: '12345678000195',
          email: 'new@example.com',
          password: 'Password123!@',
        })
      );
    });
  });

  describe('logout', () => {
    it('deve chamar logout no servidor e limpar dados do storage', async () => {
      storage.setItem('authToken', 'test-token');
      storage.setItem('user', 'test-user');
      
      (apiClient.post as jest.Mock).mockResolvedValue({});

      await authService.logout();
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/web/v1/auth/logout');
      expect(storage.getItem('authToken')).toBeNull();
      expect(storage.getItem('user')).toBeNull();
    });

    it('deve limpar storage mesmo que chamada ao servidor falhe', async () => {
      storage.setItem('authToken', 'test-token');
      
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Server error'));

      await authService.logout();
      
      expect(storage.getItem('authToken')).toBeNull();
    });
  });
});

