/**
 * Serviço de geração de QR Codes
 */

import { apiClient } from './api-client';
import { QRCodeResponse } from '@/types/qrcode';

const QRCODES_BASE_URL = '/api/web/v1/qrcodes';

export const qrcodeService = {
  /**
   * Gera um novo QR Code token para pontuação presencial
   */
  async generateQRCode(campaignId: number, points: number = 1): Promise<QRCodeResponse> {
    const response = await apiClient.get<QRCodeResponse>(
      `${QRCODES_BASE_URL}/generate/${campaignId}?points=${points}`
    );
    return response.data;
  },
};
