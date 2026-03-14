/**
 * Serviço de assinaturas
 */

import { apiClient } from './api-client';
import { CheckoutSessionResponse } from '@/types/subscription';

const SUBSCRIPTION_BASE_URL = '/api/web/v1/subscriptions';

export const subscriptionService = {
  /**
   * Cria uma sessão de checkout do Stripe para assinar um plano
   */
  async createCheckoutSession(
    planName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post<CheckoutSessionResponse>(
      `${SUBSCRIPTION_BASE_URL}/checkout-session`,
      null, // No body
      {
        params: {
          planName,
          successUrl,
          cancelUrl,
        },
      }
    );
    return response.data;
  },
};
