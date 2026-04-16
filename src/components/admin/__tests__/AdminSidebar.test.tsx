/**
 * Testes para AdminSidebar.tsx
 */

import React from 'react';
import { render, screen, fireEvent } from '@/test-utils';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/auth-context';
import { usePathname } from 'next/navigation';

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

jest.mock('@/context/auth-context');
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('AdminSidebar', () => {
  const mockLogout = jest.fn();
  const mockOnClose = jest.fn();
  const mockUser = { email: 'admin@fidd.com.br', role: 'ADMIN' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      user: mockUser,
    });
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
  });

  it('deve renderizar os itens do menu corretamente', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Lojistas')).toBeInTheDocument();
    expect(screen.getByText('Fidd Admin')).toBeInTheDocument();
  });

  it('deve destacar o item de menu ativo', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    render(<AdminSidebar />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('bg-blue-50');
    expect(dashboardLink).toHaveClass('text-blue-600');
  });

  it('deve exibir o email do usuário logado', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('admin@fidd.com.br')).toBeInTheDocument();
  });

  it('deve chamar a função de logout ao clicar no botão sair', () => {
    render(<AdminSidebar />);

    const logoutButton = screen.getByRole('button', { name: /sair/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('deve marcar campanhas como ativa mesmo na rota legada com typo', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/campaings');

    render(<AdminSidebar />);

    const campaignsLink = screen.getByRole('link', { name: /campanhas/i });
    expect(campaignsLink).toHaveClass('bg-blue-50');
    expect(campaignsLink).toHaveClass('text-blue-600');
  });

  it('deve fechar o drawer ao clicar em um item do menu quando onClose for fornecido', () => {
    render(<AdminSidebar isOpen onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('link', { name: /lojistas/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
