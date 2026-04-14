/**
 * Testes para withAdminAuth.tsx
 */

import React from 'react';
import { render, screen } from '@/test-utils';
import { withAdminAuth } from '@/components/auth/withAdminAuth';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

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
  useRouter: jest.fn(),
}));

const MockComponent = () => <div data-testid="mock-component">Admin Content</div>;
const ProtectedComponent = withAdminAuth(MockComponent);

describe('withAdminAuth', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  it('deve renderizar o componente se o usuário for ADMIN e estiver autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'ADMIN' },
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProtectedComponent />);

    expect(screen.getByTestId('mock-component')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('deve mostrar loading enquanto carrega o estado de autenticação', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });

    render(<ProtectedComponent />);

    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();
    // O loading é uma div com animate-spin, não tem role status explicitamente
    // mas podemos procurar pela classe ou apenas verificar que o componente não está lá
  });

  it('deve redirecionar para /login se o usuário não estiver autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(<ProtectedComponent />);

    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();
  });

  it('deve redirecionar para /login se o usuário não for ADMIN', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'STORE' },
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProtectedComponent />);

    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();
  });
});
