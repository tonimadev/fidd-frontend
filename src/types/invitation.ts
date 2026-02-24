/**
 * Tipos relacionados a convites de fidelização
 */

export interface Invitation {
  token: string;
  pointsValue: number;
  expiresAt: string;
}

export interface GenerateInvitationsRequest {
  campaignId: number;
  quantity: number;
  pointsPerInvitation: number;
  expirationMinutes: number;
}

export interface GenerateInvitationsResponse {
  campaignId: number;
  totalGenerated: number;
  pointsPerInvitation: number;
  expirationMinutes: number;
  invitations: Invitation[];
}

