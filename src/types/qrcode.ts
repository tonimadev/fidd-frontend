/**
 * Tipos relacionados a QR Codes de pontuação
 */

export interface QRCodeResponse {
  token: string;
  campaignId: string;
  campaignName: string;
  expiresIn: string; // Ex: "60 seconds"
  message: string;
}
