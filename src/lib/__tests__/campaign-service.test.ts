/**
 * Testes para campaign-service.ts
 */

import { campaignService } from '@/lib/campaign-service';
import { apiClient } from '@/lib/api-client';
import { Campaign } from '@/types/campaign';

jest.mock('@/lib/api-client');

describe('campaignService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCampaigns', () => {
    it('deve listar todas as campanhas', async () => {
      const mockCampaigns = [
        {
          id: 1,
          name: 'Campaign 1',
          pointsRequired: 10,
          isActive: true,
          expirationDate: '2026-12-31',
          storeId: 1,
        },
        {
          id: 2,
          name: 'Campaign 2',
          pointsRequired: 15,
          isActive: false,
          expirationDate: '2026-06-30',
          storeId: 1,
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockCampaigns,
      });

      const result = await campaignService.listCampaigns();

      expect(result).toEqual(mockCampaigns);
      expect(apiClient.get).toHaveBeenCalledWith('/api/web/v1/campaigns');
    });

    it('deve retornar array vazio quando não há campanhas', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        data: [],
      });

      const result = await campaignService.listCampaigns();

      expect(result).toEqual([]);
    });
  });

  describe('createCampaign', () => {
    it('deve criar uma nova campanha', async () => {
      const mockCampaign = {
        id: 1,
        name: 'New Campaign',
        pointsRequired: 10,
        isActive: true,
        expirationDate: '2026-12-31',
        storeId: 1,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({
        data: mockCampaign,
      });

      const result = await campaignService.createCampaign({
        name: 'New Campaign',
        pointsRequired: 10,
        expirationDate: '2026-12-31',
      });

      expect(result).toEqual(mockCampaign);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/web/v1/campaigns',
        {
          name: 'New Campaign',
          pointsRequired: 10,
          expirationDate: '2026-12-31',
        }
      );
    });

    it('deve lançar erro para dados inválidos', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Validation error'));

      await expect(
        campaignService.createCampaign({
          name: 'a', // Muito curto
          pointsRequired: 0, // Inválido
          expirationDate: '2020-01-01', // No passado
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteCampaign', () => {
    it('deve deletar uma campanha', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({
        status: 204,
      });

      await campaignService.deleteCampaign(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/web/v1/campaigns/1');
    });

    it('deve lançar erro ao deletar campanha inexistente', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Not found'));

      await expect(campaignService.deleteCampaign(999)).rejects.toThrow('Not found');
    });
  });

  describe('updateCampaign', () => {
    it('deve atualizar uma campanha', async () => {
      const mockCampaign = {
        id: 1,
        name: 'Updated Campaign',
        pointsRequired: 20,
        isActive: true,
        expirationDate: '2026-12-31',
        storeId: 1,
      };

      (apiClient.put as jest.Mock).mockResolvedValue({
        data: mockCampaign,
      });

      const result = await campaignService.updateCampaign(1, {
        name: 'Updated Campaign',
        pointsRequired: 20,
        expirationDate: '2026-12-31',
        isActive: true,
      });

      expect(result).toEqual(mockCampaign);
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/web/v1/campaigns/1',
        expect.objectContaining({
          name: 'Updated Campaign',
        })
      );
    });
  });

  describe('toggleCampaignStatus', () => {
    it('deve alternar o status de uma campanha ativa para pausada usando PUT', async () => {
      const campaign: Campaign = {
        id: 1,
        name: 'Test Campaign',
        pointsRequired: 10,
        isActive: true,
        expirationDate: '2026-12-31',
        storeId: 1,
        description: 'Test description',
        benefitType: 'Recompensa'
      };

      const mockUpdatedCampaign = { ...campaign, isActive: false };

      (apiClient.put as jest.Mock).mockResolvedValue({
        data: mockUpdatedCampaign,
      });

      const result = await campaignService.toggleCampaignStatus(campaign);

      expect(result.isActive).toBe(false);
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/web/v1/campaigns/1',
        expect.objectContaining({
          isActive: false
        })
      );
    });

    it('deve alternar o status de uma campanha pausada para ativa usando PUT', async () => {
      const campaign: Campaign = {
        id: 1,
        name: 'Test Campaign',
        pointsRequired: 10,
        isActive: false,
        expirationDate: '2026-12-31',
        storeId: 1
      };

      const mockUpdatedCampaign = { ...campaign, isActive: true };

      (apiClient.put as jest.Mock).mockResolvedValue({
        data: mockUpdatedCampaign,
      });

      const result = await campaignService.toggleCampaignStatus(campaign);

      expect(result.isActive).toBe(true);
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/web/v1/campaigns/1',
        expect.objectContaining({
          isActive: true
        })
      );
    });
  });
});

