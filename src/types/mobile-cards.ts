/**
 * Tipos de cartões para o cliente (mobile)
 */

export interface MobileCardResponse {
  id: number;
  campaignName: string;
  storeName: string;
  currentPoints: number;
  pointsRequired: number;
  progress: number;
  status: string;
  canRedeem: boolean;
  campaignDescription?: string;
  expirationDate?: string;
  redeemedAt?: string;
}

export interface PunchCollectRequest {
  cardId: number;
  qrToken: string;
  isQrCode: boolean;
}

export interface PunchCollectResponse {
  success: boolean;
  newScore: number;
  pointsRemaining: number;
  message: string;
}

export interface MobileRedemptionResponse {
  success: boolean;
  redemptionCode: string;
  message: string;
}

export interface MobileInvitationRedeemResponse {
  success: boolean;
  cardId: number;
  campaignName: string;
  storeName: string;
  currentPoints: number;
  pointsRequired: number;
  message: string;
}
