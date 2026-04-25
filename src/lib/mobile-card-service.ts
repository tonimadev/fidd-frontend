/**
 * Serviço de cartões para clientes (mobile)
 */

import { apiClient } from './api-client';
import { CursorResponse } from '@/types/pagination';
import { 
  MobileCardResponse, 
  PunchCollectRequest, 
  PunchCollectResponse, 
  MobileRedemptionResponse,
  MobileInvitationRedeemResponse,
  PunchHistoryResponse
} from '@/types/mobile-cards';

const BASE_URL = '/api/mobile/v1';

export const mobileCardService = {
  /**
   * Obtém lista de cartões do cliente
   */
  async getCards(status?: string): Promise<MobileCardResponse[]> {
    const response = await apiClient.get<MobileCardResponse[]>(`${BASE_URL}/cards`, {
      params: { status }
    });
    return response.data;
  },

  /**
   * Obtém detalhes de um cartão
   */
  async getCardById(cardId: number): Promise<MobileCardResponse> {
    const response = await apiClient.get<MobileCardResponse>(`${BASE_URL}/cards/${cardId}`);
    return response.data;
  },

  /**
   * Coleta pontos/selos
   */
  async collectPoints(data: PunchCollectRequest): Promise<PunchCollectResponse> {
    const response = await apiClient.post<PunchCollectResponse>(`${BASE_URL}/punches/collect`, data);
    return response.data;
  },

  /**
   * Resgata recompensa
   */
  async redeemReward(cardId: number, rewardId?: number): Promise<MobileRedemptionResponse> {
    const response = await apiClient.post<MobileRedemptionResponse>(`${BASE_URL}/cards/${cardId}/redeem`, null, {
      params: { rewardId }
    });
    return response.data;
  },

  /**
   * Resgata convite/cartão novo
   */
  async redeemInvitation(inviteToken: string, isQrCode: boolean = true): Promise<MobileInvitationRedeemResponse> {
    const response = await apiClient.post<MobileInvitationRedeemResponse>(`${BASE_URL}/invitations/redeem`, {
      inviteToken,
      isQrCode
    });
    return response.data;
  },

  /**
   * Obtém histórico de carimbos
   */
  async getHistory(cursor?: string | null, limit: number = 10): Promise<CursorResponse<PunchHistoryResponse>> {
    const response = await apiClient.get<CursorResponse<PunchHistoryResponse>>(`${BASE_URL}/punches/history`, {
      params: { cursor, limit }
    });
    return response.data;
  }
};
