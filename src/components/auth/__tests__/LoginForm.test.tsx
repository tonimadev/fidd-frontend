/**
 * Testes para LoginForm.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { LoginForm } from '@/components/auth/LoginForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({}),
  }),
}));

jest.mock('@/lib/account-service');

describe('LoginForm', () => {
  it('deve renderizar formulário de login', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve renderizar campos de email e senha', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('deve ter link para página de registro', () => {
    render(<LoginForm />);

    const registerLink = screen.getByRole('link', { name: /criar conta/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});

