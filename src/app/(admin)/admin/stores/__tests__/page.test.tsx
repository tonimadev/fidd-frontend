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
      expect(screen.getByText('Store One')).toBeInTheDocument();
      expect(screen.getByText('one@example.com')).toBeInTheDocument();
    });
  });

  it('deve permitir alterar o status de uma loja', async () => {
    (adminService.updateStoreStatus as jest.Mock).mockResolvedValue({});
    
    render(<AdminStoresPage />);

    await waitFor(() => {
      expect(screen.getByText('Store One')).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: /desativar/i });
    fireEvent.click(toggleButton);

    expect(adminService.updateStoreStatus).toHaveBeenCalledWith(1, false);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ativar/i })).toBeInTheDocument();
    });
  });
});
