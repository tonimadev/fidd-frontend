/**
 * Serviço de assinaturas
 */

import { apiClient } from './api-client';
import { CheckoutSessionResponse } from '@/types/subscription';

const SUBSCRIPTION_BASE_URL = '/api/web/v1/subscriptions';

export const subscriptionService = {
  /**
   * Cria uma sessão de checkout do Stripe para assinar o plano Pro
   */
  async createCheckoutSession(successUrl: string, cancelUrl: string): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post<CheckoutSessionResponse>(
      `${SUBSCRIPTION_BASE_URL}/checkout-session`,
      null, // No body
      {
        params: {
          successUrl,
          cancelUrl,
        },
      }
    );
    return response.data;
  },
};
