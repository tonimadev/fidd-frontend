/**
 * Tipos relacionados a convites de fidelização
 */

export interface Invitation {
  id: number;
  inviteToken: string;
  campaignName: string;
  points: number;
  expiresAt: string;
  inviteUrl: string;
  message: string;
}

export interface GenerateInvitationsRequest {
  campaignId: number;
  quantity: number;
  pointsPerInvitation: number;
  expirationMinutes: number;
}

export interface GenerateInvitationsResponse {
  campaignId: number;
  campaignName: string;
  totalGenerated: number;
  invitations: Invitation[];
  message: string;
}

