/**
 * Componente para listar campanhas
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/lib/campaign-service';
import { CreateCampaignForm } from './CreateCampaignForm';
import { GenerateInvitationsForm } from './GenerateInvitationsForm';
import { QRCodeModal } from './QRCodeModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSearchParams, useRouter } from 'next/navigation';

interface CampaignsListProps {
  onOpenHelp?: (tutorialId?: string | null) => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({ onOpenHelp }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaignForInvitations, setSelectedCampaignForInvitations] = useState<Campaign | null>(null);
  const [selectedCampaignForQRCode, setSelectedCampaignForQRCode] = useState<Campaign | null>(null);
  const [togglingCampaignId, setTogglingCampaignId] = useState<number | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Carrega as campanhas ao montar o componente
  const isLoaded = React.useRef(false);
  useEffect(() => {
    if (!isLoaded.current) {
      loadCampaigns();
      isLoaded.current = true;
    }
  }, []);

  // Processar ações via URL
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowCreateForm(true);
      // Limpar URL após processar para evitar re-processamento
      const params = new URLSearchParams(searchParams.toString());
      params.delete('action');
      const newUrl = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await campaignService.listCampaigns();
      setCampaigns(data);

      // Verificar se há uma ação de convite que depende dos dados carregados
      const action = searchParams.get('action');
      if (action === 'invitations') {
        // Se houver apenas uma campanha ativa, abrir convites para ela automaticamente
        const activeCampaigns = data.filter(c => Boolean(c.isActive) && !isExpired(c.expirationDate));
        if (activeCampaigns.length === 1) {
          setSelectedCampaignForInvitations(activeCampaigns[0]);
          router.replace('/dashboard?tab=campaigns');
        } else if (data.length === 0) {
          // Se não houver campanhas, abrir criação
          setShowCreateForm(true);
          router.replace('/dashboard?tab=campaigns');
        }
        // Se houver múltiplas, apenas deixamos na lista para o lojista escolher
      }
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

  const handleToggleStatus = async (campaign: Campaign) => {
    try {
      setTogglingCampaignId(campaign.id);
      setErrorMessage('');
      const updatedCampaign = await campaignService.toggleCampaignStatus(campaign);
      
      // Atualizar o estado local imediatamente para feedback instantâneo
      setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    } catch (error) {
      console.error('Erro ao alternar status da campanha:', error);
      setErrorMessage('Não foi possível alterar o status da campanha. Tente novamente.');
    } finally {
      setTogglingCampaignId(null);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha? Ela será removida da lista e não poderá ser recuperada.')) {
      return;
    }

    try {
      await campaignService.deleteCampaign(id);
      // Remove da lista local
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      setErrorMessage('Erro ao excluir campanha. Tente novamente.');
      console.error('Erro ao excluir campanha:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isExpired = (expirationDate: string) => {
    if (!expirationDate) return false;
    
    // Extrair componentes da data para evitar problemas de fuso horário
    // Formato esperado: YYYY-MM-DD
    const parts = expirationDate.split('-');
    if (parts.length !== 3) return false;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês no JS é 0-11
    const day = parseInt(parts[2], 10);
    
    const expDate = new Date(year, month, day, 23, 59, 59, 999);
    return expDate < new Date();
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
            ← Voltar
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Nova Campanha</h2>
        </div>
        <Card className="max-w-2xl mx-auto shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Configuração da Campanha</CardTitle>
            <CardDescription>Defina as regras do seu cartão de fidelidade.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCampaignForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedCampaignForInvitations) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCampaignForInvitations(null)}>
            ← Voltar
          </Button>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Gerar Convites</h2>
        </div>
        <Card className="max-w-xl mx-auto shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>{selectedCampaignForInvitations.name}</CardTitle>
            <CardDescription>Crie convites para seus clientes entrarem nesta campanha.</CardDescription>
          </CardHeader>
          <CardContent>
            <GenerateInvitationsForm
              campaignId={selectedCampaignForInvitations.id}
              campaignName={selectedCampaignForInvitations.name}
              onSuccess={() => setSelectedCampaignForInvitations(null)}
              onCancel={() => setSelectedCampaignForInvitations(null)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campanhas</h2>
          <p className="text-muted-foreground">Gerencie seus cartões de fidelidade ativos.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Criar Campanha
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <CardTitle className="mb-2">Nenhuma campanha</CardTitle>
          <CardDescription className="mb-6 max-w-xs">
            Você ainda não criou nenhuma campanha de fidelidade. Comece agora!
          </CardDescription>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => setShowCreateForm(true)}>
              Criar Minha Primeira Campanha
            </Button>
            {onOpenHelp && (
              <Button variant="ghost" size="sm" onClick={() => onOpenHelp('campaign_management')}>
                Ver guia de como criar campanhas
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-xl border-muted/60">
              {/* Visual de Cartão Real */}
              <div className={`h-32 p-6 flex flex-col justify-between relative overflow-hidden ${
                Boolean(campaign.isActive) && !isExpired(campaign.expirationDate)
                  ? 'bg-gradient-to-br from-primary to-accent text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="z-10 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg truncate leading-none">{campaign.name}</h3>
                    <p className="text-xs opacity-80 mt-1">FIDD CARD</p>
                  </div>
                  {isExpired(campaign.expirationDate) ? (
                    <span className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Expirado
                    </span>
                  ) : Boolean(campaign.isActive) ? (
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Ativo
                    </span>
                  ) : (
                    <span className="bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Pausado
                    </span>
                  )}
                </div>
                <div className="z-10 mt-auto flex justify-between items-end">
                  <div className="text-2xl font-black">{campaign.pointsRequired} <span className="text-sm font-normal opacity-70 italic">selos</span></div>
                  <div className="text-[10px] uppercase opacity-70 tracking-widest font-mono">
                    VALID {formatDate(campaign.expirationDate)}
                  </div>
                </div>
              </div>

              <CardContent className="pt-6 flex-1">
                {campaign.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 italic">
                    "{campaign.description}"
                  </p>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo de Recompensa</span>
                    <span className="font-medium text-foreground capitalize">{campaign.benefitType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mecânica</span>
                    <span className="font-medium text-foreground">A cada compra</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pb-6 pt-0">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="relative group/btn">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCampaignForInvitations(campaign)}
                      disabled={!Boolean(campaign.isActive) || isExpired(campaign.expirationDate)}
                    >
                      Convites
                    </Button>
                    {(!Boolean(campaign.isActive) || isExpired(campaign.expirationDate)) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-50">
                        {isExpired(campaign.expirationDate) ? 'Campanha expirada' : 'Ative a campanha para gerar convites'}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative group/btn">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-primary text-primary hover:bg-primary/5"
                      onClick={() => setSelectedCampaignForQRCode(campaign)}
                      disabled={!Boolean(campaign.isActive) || isExpired(campaign.expirationDate)}
                    >
                      QR Code
                    </Button>
                    {(!Boolean(campaign.isActive) || isExpired(campaign.expirationDate)) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-50">
                        {isExpired(campaign.expirationDate) ? 'Campanha expirada' : 'Ative a campanha para gerar QR Code'}
                      </div>
                    )}
                  </div>
                </div>

                {!isExpired(campaign.expirationDate) && (
                  <Button 
                    variant={Boolean(campaign.isActive) ? 'outline' : 'primary'}
                    size="sm" 
                    className={`w-full ${Boolean(campaign.isActive) ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                    onClick={() => handleToggleStatus(campaign)}
                    isLoading={togglingCampaignId === campaign.id}
                    disabled={togglingCampaignId !== null}
                  >
                    {Boolean(campaign.isActive) ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pausar Campanha
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Iniciar Campanha
                      </>
                    )}
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                  onClick={() => handleDeleteCampaign(campaign.id)}
                >
                  Excluir Campanha
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedCampaignForQRCode && (
        <QRCodeModal
          campaignId={selectedCampaignForQRCode.id}
          campaignName={selectedCampaignForQRCode.name}
          onClose={() => setSelectedCampaignForQRCode(null)}
        />
      )}
    </div>
  );
};

