/**
 * Testes para SubscriptionPlans.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { subscriptionService } from '@/lib/subscription-service';
import { getStripePlans } from '@/lib/stripe-actions';
import { useAuth } from '@/context/auth-context';
import { redirectToCheckout } from '@/lib/navigation';

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

jest.mock('@/lib/subscription-service');
jest.mock('@/lib/stripe-actions');
jest.mock('@/context/auth-context');

// MOCK NOVO AQUI:
jest.mock('@/lib/navigation', () => ({
  redirectToCheckout: jest.fn(),
}));

describe('SubscriptionPlans', () => {
  const mockPlans = [
    {
      id: 'fidd_price_free',
      name: 'Plano Gratuito',
      description: 'Para quem está começando',
      amount: 0,
      currency: 'brl',
      interval: 'month',
      features: ['Até 50 cartões gerados /mês']
    },
    {
      id: 'fidd_price_lite',
      name: 'Plano Lite',
      description: 'Ideal para pequenos comércios',
      amount: 25,
      currency: 'brl',
      interval: 'month',
      features: ['Até 100 cartões gerados /mês']
    },
    {
      id: 'fidd_price_pro',
      name: 'Plano Pro',
      description: 'Potencialize seu negócio',
      amount: 50,
      currency: 'brl',
      interval: 'month',
      features: ['Campanhas ilimitadas']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getStripePlans as jest.Mock).mockResolvedValue(mockPlans);
    (useAuth as jest.Mock).mockReturnValue({
      user: { plan: 'FREE' },
      refreshUser: jest.fn()
    });
  });

  it('deve renderizar os planos gratuito, lite e pro após carregamento', async () => {
    render(<SubscriptionPlans />);

    expect(await screen.findByRole('heading', { name: /Plano Gratuito/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Plano Lite/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Plano Pro/i })).toBeInTheDocument();

    expect(screen.getAllByText(/0,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/25,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/50,00/).length).toBeGreaterThan(0);
  });

  it('deve identificar o plano atual corretamente', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { plan: 'LITE' },
      refreshUser: jest.fn()
    });

    render(<SubscriptionPlans />);

    await screen.findByRole('heading', { name: /Plano Lite/i });

    const currentPlanButtons = screen.getAllByRole('button', { name: /Plano Atual/i });
    expect(currentPlanButtons.length).toBeGreaterThan(0);

    const disabledButton = screen.queryByRole('button', { name: /Plano Atual/i, disabled: true });
    expect(disabledButton).toBeInTheDocument();
  });

  it('deve chamar createCheckoutSession ao clicar em Assinar Plano Pro', async () => {
    const mockUrl = 'https://checkout.stripe.com/test';
    (subscriptionService.createCheckoutSession as jest.Mock).mockResolvedValue({
      url: mockUrl,
    });

    render(<SubscriptionPlans />);

    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(subscriptionService.createCheckoutSession).toHaveBeenCalledWith(
        'PRO',
        expect.any(String),
        expect.any(String)
      );
      // Validamos se a nossa função wrapper foi chamada com a URL certa!
      expect(redirectToCheckout).toHaveBeenCalledWith(mockUrl);
    });
  });

  it('deve mostrar mensagem de erro quando a chamada falha', async () => {
    // Espiona e silencia o console.error apenas para este teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (subscriptionService.createCheckoutSession as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<SubscriptionPlans />);

    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar sessão de checkout/i)).toBeInTheDocument();
    });

    // Restaura o console.error para o comportamento normal
    consoleSpy.mockRestore();
  });
});