/**
 * Tipos para assinaturas
 */

export interface CheckoutSessionResponse {
  url: string;
}

export interface SubscriptionStatus {
  active: boolean;
  plan: 'FREE' | 'PRO';
  nextBillingDate?: string;
}
