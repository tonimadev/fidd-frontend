/**
 * Testes para SubscriptionPlans.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { subscriptionService } from '@/lib/subscription-service';
import { getStripePlans } from '@/lib/stripe-actions';
import { useAuth } from '@/context/auth-context';

jest.mock('@/lib/subscription-service');
jest.mock('@/lib/stripe-actions');
jest.mock('@/context/auth-context');

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

    // Títulos dos planos (Heading)
    expect(await screen.findByRole('heading', { name: /Plano Gratuito/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Plano Lite/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Plano Pro/i })).toBeInTheDocument();

    // Verificar se os preços aparecem usando getAll para evitar erros de ambiguidade
    // O JSDOM às vezes detecta múltiplos elementos para textos formatados
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

    // Aguarda o render do Lite
    await screen.findByRole('heading', { name: /Plano Lite/i });

    // O botão do plano Lite deve estar marcado como atual
    const currentPlanButtons = screen.getAllByRole('button', { name: /Plano Atual/i });
    expect(currentPlanButtons.length).toBeGreaterThan(0);

    // Verifica se algum botão "Plano Atual" está desabilitado
    const disabledButton = screen.queryByRole('button', { name: /Plano Atual/i, disabled: true });
    expect(disabledButton).toBeInTheDocument();
  });

  it('deve chamar createCheckoutSession ao clicar em Assinar Plano Pro', async () => {
    const mockUrl = 'https://checkout.stripe.com/test';
    (subscriptionService.createCheckoutSession as jest.Mock).mockResolvedValue({
      url: mockUrl,
    });

    // Mock window.location.href
    const originalLocation = window.location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    render(<SubscriptionPlans />);

    // Aguardar o carregamento dos planos e clicar no botão do Pro
    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(subscriptionService.createCheckoutSession).toHaveBeenCalledWith(
        'PRO',
        expect.any(String),
        expect.any(String)
      );
      expect(window.location.href).toBe(mockUrl);
    });

    window.location = originalLocation;
  });

  it('deve mostrar mensagem de erro quando a chamada falha', async () => {
    (subscriptionService.createCheckoutSession as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<SubscriptionPlans />);

    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar sessão de checkout/i)).toBeInTheDocument();
    });
  });
});
