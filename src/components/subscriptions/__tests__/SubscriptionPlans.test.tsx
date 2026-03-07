/**
 * Testes para SubscriptionPlans.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { subscriptionService } from '@/lib/subscription-service';

jest.mock('@/lib/subscription-service');

describe('SubscriptionPlans', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os planos gratuito e pro', () => {
    render(<SubscriptionPlans />);

    expect(screen.getByText('Plano Gratuito')).toBeInTheDocument();
    expect(screen.getByText('Plano Pro')).toBeInTheDocument();
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
  });

  it('deve chamar createCheckoutSession ao clicar em Assinar Plano Pro', async () => {
    const mockUrl = 'https://checkout.stripe.com/test';
    (subscriptionService.createCheckoutSession as jest.Mock).mockResolvedValue({
      url: mockUrl,
    });

    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    render(<SubscriptionPlans />);

    const subscribeButton = screen.getByRole('button', { name: /assinar plano pro/i });
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

    const subscribeButton = screen.getByRole('button', { name: /assinar plano pro/i });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar sessão de checkout/i)).toBeInTheDocument();
    });
  });
});
