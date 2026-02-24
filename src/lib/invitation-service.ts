/**
 * Serviço de convites de fidelização
 */

import { apiClient } from './api-client';
import { GenerateInvitationsRequest, GenerateInvitationsResponse } from '@/types/invitation';

const INVITATIONS_BASE_URL = '/api/web/v1/invitations';

export const invitationService = {
  /**
   * Gera múltiplos convites de fidelização
   */
  async generateInvitations(data: GenerateInvitationsRequest): Promise<GenerateInvitationsResponse> {
    const response = await apiClient.post<GenerateInvitationsResponse>(
      `${INVITATIONS_BASE_URL}/generate`,
      data
    );
    return response.data;
  },
};

