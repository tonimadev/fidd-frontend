/**
 * Testes para subscription-service.ts
 */

import { subscriptionService } from '@/lib/subscription-service';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('subscriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('deve criar uma sessão de checkout com sucesso', async () => {
      const mockResponse = {
        url: 'https://checkout.stripe.com/c/pay/cs_test_123',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
      });

      const successUrl = 'http://localhost:3000/success';
      const cancelUrl = 'http://localhost:3000/cancel';

      const result = await subscriptionService.createCheckoutSession(successUrl, cancelUrl);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/web/v1/subscriptions/checkout-session',
        null,
        {
          params: {
            successUrl,
            cancelUrl,
          },
        }
      );
    });

    it('deve lançar erro quando a API falha', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(
        subscriptionService.createCheckoutSession('url1', 'url2')
      ).rejects.toThrow('API Error');
    });
  });
});
