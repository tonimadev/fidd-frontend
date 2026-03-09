/**
 * Tipos para resgate de prêmios
 */

export interface RedemptionRequest {
  code: string;
}

export interface RedemptionResponse {
  success: boolean;
  message: string;
  customerName?: string;
  campaignName?: string;
  redeemedAt?: string;
}

export interface RedemptionErrorResponse {
  success: boolean;
  message: string;
}
