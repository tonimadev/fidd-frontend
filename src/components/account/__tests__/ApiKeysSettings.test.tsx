import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiKeysSettings } from '../ApiKeysSettings';
import { accountService } from '@/lib/account-service';

// Mock do accountService
jest.mock('@/lib/account-service', () => ({
  accountService: {
    listApiKeys: jest.fn(),
    createApiKey: jest.fn(),
    revokeApiKey: jest.fn(),
  },
}));

// Mock do confirm global
window.confirm = jest.fn(() => true);

describe('ApiKeysSettings', () => {
  const mockKeys = [
    {
      id: 1,
      name: 'Key 1',
      key: 'fidd_key_1',
      createdAt: '2026-03-01T10:00:00Z',
      lastUsedAt: null,
    },
    {
      id: 2,
      name: 'Key 2',
      key: 'fidd_key_2',
      createdAt: '2026-03-02T10:00:00Z',
      lastUsedAt: '2026-03-05T10:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (accountService.listApiKeys as jest.Mock).mockResolvedValue(mockKeys);
  });

  it('deve carregar e exibir as chaves de API', async () => {
    render(<ApiKeysSettings />);

    await waitFor(() => {
      expect(screen.getByText('Key 1')).toBeInTheDocument();
      expect(screen.getByText('Key 2')).toBeInTheDocument();
    });
  });

  it('deve chamar revokeApiKey ao clicar em Revogar', async () => {
    (accountService.revokeApiKey as jest.Mock).mockResolvedValue(undefined);

    render(<ApiKeysSettings />);

    await waitFor(() => screen.getByText('Key 1'));

    const revokeButtons = screen.getAllByText('Revogar');
    fireEvent.click(revokeButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(accountService.revokeApiKey).toHaveBeenCalledWith(1);
    
    // Deve remover da lista no frontend
    await waitFor(() => {
      expect(screen.queryByText('Key 1')).not.toBeInTheDocument();
      expect(screen.getByText('Key 2')).toBeInTheDocument();
    });
  });

  it('deve tratar erro ao revogar chave', async () => {
    (accountService.revokeApiKey as jest.Mock).mockRejectedValue(new Error('Erro de API'));

    render(<ApiKeysSettings />);

    await waitFor(() => screen.getByText('Key 1'));

    const revokeButtons = screen.getAllByText('Revogar');
    fireEvent.click(revokeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Erro ao revogar chave.')).toBeInTheDocument();
      // Chave deve continuar na lista
      expect(screen.getByText('Key 1')).toBeInTheDocument();
    });
  });
});
