import { redemptionService } from '../redemption-service';
import { apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('redemptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateRedemption', () => {
    it('should call api validate endpoint with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Resgate realizado com sucesso!',
          customerName: 'João Silva',
          campaignName: 'Compre 10 Cafés, ganhe 1',
          redeemedAt: '2026-03-09T14:30:00'
        }
      };
      
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const requestData = { code: 'XJ7K2P' };
      const result = await redemptionService.validateRedemption(requestData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/web/v1/redemptions/validate', requestData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when api call fails', async () => {
      const mockError = new Error('Bad Request');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(redemptionService.validateRedemption({ code: 'INVALID' }))
        .rejects.toThrow('Bad Request');
    });
  });
});
