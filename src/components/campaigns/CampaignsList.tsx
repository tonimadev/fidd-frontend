/**
 * Componente para listar campanhas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/lib/campaign-service';
import { CreateCampaignForm } from './CreateCampaignForm';
import { GenerateInvitationsForm } from './GenerateInvitationsForm';

export const CampaignsList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaignForInvitations, setSelectedCampaignForInvitations] = useState<Campaign | null>(null);

  // Carrega as campanhas ao montar o componente
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await campaignService.listCampaigns();
      setCampaigns(data);
    } catch (error) {
      setErrorMessage('Erro ao carregar campanhas. Tente novamente.');
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadCampaigns();
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar essa campanha?')) {
      return;
    }

    try {
      await campaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      setErrorMessage('Erro ao deletar campanha. Tente novamente.');
      console.error('Erro ao deletar campanha:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isExpired = (expirationDate: string) => {
    const date = new Date(expirationDate);
    return date < new Date();
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Criar Nova Campanha</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <CreateCampaignForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </div>
    );
  }

  if (selectedCampaignForInvitations) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Gerar Convites</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <GenerateInvitationsForm
            campaignId={selectedCampaignForInvitations.id}
            campaignName={selectedCampaignForInvitations.name}
            onSuccess={() => setSelectedCampaignForInvitations(null)}
            onCancel={() => setSelectedCampaignForInvitations(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campanhas</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Criar Campanha
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Carregando campanhas...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="mb-4 text-gray-600">Nenhuma campanha criada ainda</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Criar Primeira Campanha
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  {isExpired(campaign.expirationDate) ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                      Expirada
                    </span>
                  ) : campaign.isActive ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Ativa
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      Inativa
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">Pontos Requeridos</p>
                    <p className="text-blue-600">{campaign.pointsRequired} pontos</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Expira em</p>
                    <p className={isExpired(campaign.expirationDate) ? 'text-red-600' : 'text-gray-600'}>
                      {formatDate(campaign.expirationDate)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCampaignForInvitations(campaign)}
                  className="rounded-lg bg-green-50 px-4 py-2 font-semibold text-green-600 transition-colors hover:bg-green-100"
                >
                  Gerar Convites
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

