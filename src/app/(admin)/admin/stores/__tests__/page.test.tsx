/**
 * Testes para AdminStoresPage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import AdminStoresPage from '../page';
import { adminService } from '@/lib/admin-service';

jest.mock('@/lib/admin-service');
jest.mock('@/lib/analytics', () => ({
  analyticsService: {
    track: jest.fn(),
  },
}));
jest.mock('@/lib/firebase', () => ({
  app: {},
  analytics: {},
  performance: {},
}));

describe('AdminStoresPage', () => {
  const mockStores = {
    content: [
      {
        id: 1,
        tradeName: 'Store One',
        email: 'one@example.com',
        taxId: '123456789',
        isActive: true,
        subscriptionStatus: 'ACTIVE',
        registrationCompleted: true,
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (adminService.getStores as jest.Mock).mockResolvedValue(mockStores);
  });

  it('deve renderizar a listagem de lojistas', async () => {
    render(<AdminStoresPage />);

    expect(screen.getByText(/gerenciamento de lojistas/i)).toBeInTheDocument();
    
    await waitFor(() => {
      // Store One aparece no card mobile e na linha da tabela desktop simultaneamente (ocultos por CSS)
      expect(screen.getAllByText('Store One').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('one@example.com').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deve permitir alterar o status de uma loja', async () => {
    (adminService.updateStoreStatus as jest.Mock).mockResolvedValue({});
    
    render(<AdminStoresPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Store One').length).toBeGreaterThanOrEqual(1);
    });

    const toggleButtons = screen.getAllByRole('button', { name: /desativar lojista/i });
    fireEvent.click(toggleButtons[0]);

    expect(adminService.updateStoreStatus).toHaveBeenCalledWith(1, false);
    
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /ativar lojista/i }).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deve exibir erro e permitir tentar novamente ao falhar no carregamento', async () => {
    (adminService.getStores as jest.Mock)
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValueOnce(mockStores);

    render(<AdminStoresPage />);

    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar os lojistas/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Store One').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deve filtrar os lojistas da página atual pela busca', async () => {
    render(<AdminStoresPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Store One').length).toBeGreaterThanOrEqual(1);
    });

    fireEvent.change(screen.getByPlaceholderText(/buscar por nome, email ou documento/i), {
      target: { value: 'xpto' },
    });

    expect(screen.getAllByText(/nenhum lojista desta página corresponde à busca atual/i).length).toBeGreaterThanOrEqual(1);
  });
});
