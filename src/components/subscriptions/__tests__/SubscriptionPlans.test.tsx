/**
 * Testes para SubscriptionPlans.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { subscriptionService } from '@/lib/subscription-service';
import { getStripePlans } from '@/lib/stripe-actions';

jest.mock('@/lib/subscription-service');
jest.mock('@/lib/stripe-actions');

describe('SubscriptionPlans', () => {
  const mockPlans = [
    {
      id: 'fidd_price_lite',
      name: 'Plano Gratuito',
      description: 'Ideal para pequenos comércios testarem',
      amount: 0,
      currency: 'brl',
      interval: 'month',
      features: ['Até 50 cartões gerados /mês']
    },
    {
      id: 'fidd_price_pro',
      name: 'Plano Pro',
      description: 'Potencialize a fidelidade de seus clientes',
      amount: 50,
      currency: 'brl',
      interval: 'month',
      features: ['Campanhas ilimitadas']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getStripePlans as jest.Mock).mockResolvedValue(mockPlans);
  });

  it('deve renderizar os planos gratuito e pro após carregamento', async () => {
    render(<SubscriptionPlans />);

    // Deve mostrar carregando inicialmente
    expect(screen.getByText(/carregando planos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Plano Gratuito')).toBeInTheDocument();
      expect(screen.getByText('Plano Pro')).toBeInTheDocument();
    });

    // Usar regex mais específicos para os valores monetários
    // O valor 0,00 pode estar contido em 50,00 dependendo do regex, vamos usar busca por texto que contenha o valor exato
    const priceFree = screen.getAllByText(/,00/).find(el => el.textContent?.includes('0,00') && !el.textContent?.includes('50,00'));
    const pricePro = screen.getAllByText(/,00/).find(el => el.textContent?.includes('50,00'));
    
    expect(priceFree).toBeInTheDocument();
    expect(pricePro).toBeInTheDocument();
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

    // Aguardar o carregamento dos planos
    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(subscriptionService.createCheckoutSession).toHaveBeenCalled();
      expect(window.location.href).toBe(mockUrl);
    });

    window.location = originalLocation;
  });

  it('deve mostrar mensagem de erro quando a chamada falha', async () => {
    (subscriptionService.createCheckoutSession as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<SubscriptionPlans />);

    // Aguardar o carregamento dos planos
    const subscribeButton = await screen.findByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar sessão de checkout/i)).toBeInTheDocument();
    });
  });
});
