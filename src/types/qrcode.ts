/**
 * Tipos relacionados a QR Codes de pontuação
 */

export interface QRCodeResponse {
  token: string;
  campaignId: number;
  campaignName: string;
  expiresIn: string; // Ex: "60 seconds"
  message: string;
}
