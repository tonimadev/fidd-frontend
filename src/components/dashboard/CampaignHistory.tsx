'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api-client';
import { ProUpgradeGate } from './ProUpgradeGate';
import { History, Users, Award, TrendingUp, Edit3, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';

interface CampaignHistory {
  id: number;
  name: string;
  totalPunches: number;
  totalRedemptions: number;
  averageTicket: number | null;
  rewardCost: number | null;
  estimatedROI: number | null;
}

export const CampaignHistory: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ averageTicket: 0, rewardCost: 0 });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<CampaignHistory[]>('/api/web/v1/campaigns/history');
      setCampaigns(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('PRO_ONLY');
      } else {
        setError('Erro ao carregar histórico de campanhas');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleEdit = (campaign: CampaignHistory) => {
    setEditId(campaign.id);
    setEditData({ 
      averageTicket: campaign.averageTicket || 0, 
      rewardCost: campaign.rewardCost || 0 
    });
  };

  const handleSaveFinance = async (id: number) => {
    try {
      await apiClient.put(`/api/web/v1/campaigns/${id}/finance`, editData);
      setEditId(null);
      fetchHistory();
    } catch {
      alert("Erro ao salvar dados financeiros");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando histórico...</div>;

  if (error === 'PRO_ONLY' || user?.plan !== 'Pro') {
    return (
      <ProUpgradeGate 
        title="Análise de ROI e Histórico PRO"
        description={`Pare de gastar dinheiro no escuro: saiba exatamente quanto cada campanha rendeu para o seu bolso.
        
        • Histórico detalhado de campanhas encerradas
        • Cálculo automático de ROI (Retorno sobre Investimento)
        • Métricas de ticket médio e custo de recompensa`}
        icon={<History className="w-12 h-12" />}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Histórico de Campanhas</h2>
        <p className="text-muted-foreground">Analise o desempenho financeiro de suas campanhas encerradas.</p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <History className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <CardTitle className="text-xl text-muted-foreground">Nenhuma campanha encerrada encontrada</CardTitle>
          <CardDescription>Campanhas que você desativar ou que expirarem aparecerão aqui.</CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden border-primary/10 shadow-lg">
              <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{campaign.name}</h3>
                <div className="flex items-center gap-2">
                   <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Encerrada</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Basic Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg"><Users className="w-4 h-4 text-blue-500" /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Selos Emitidos</p>
                        <p className="text-lg font-black">{campaign.totalPunches}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2 rounded-lg"><Award className="w-4 h-4 text-amber-500" /></div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Resgates Totais</p>
                        <p className="text-lg font-black">{campaign.totalRedemptions}</p>
                      </div>
                    </div>
                  </div>

                  {/* Finance Inputs */}
                  <div className="md:col-span-2 space-y-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dados Financeiros</h4>
                      {editingId !== campaign.id ? (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(campaign)} className="h-7 px-2 text-primary">
                          <Edit3 className="w-3 h-3 mr-1" /> Editar
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleSaveFinance(campaign.id)} className="h-7 px-2">
                          <Save className="w-3 h-3 mr-1" /> Salvar
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Ticket Médio</label>
                        {editingId === campaign.id ? (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                            <Input 
                              type="number" 
                              className="pl-7 h-9 text-sm" 
                              value={editData.averageTicket}
                              onChange={(e) => setEditData({...editData, averageTicket: parseFloat(e.target.value)})}
                            />
                          </div>
                        ) : (
                          <p className="text-sm font-bold">{campaign.averageTicket?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Custo do Prêmio</label>
                        {editingId === campaign.id ? (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                            <Input 
                              type="number" 
                              className="pl-7 h-9 text-sm" 
                              value={editData.rewardCost}
                              onChange={(e) => setEditData({...editData, rewardCost: parseFloat(e.target.value)})}
                            />
                          </div>
                        ) : (
                          <p className="text-sm font-bold">{campaign.rewardCost?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ROI Result */}
                  <div className="bg-emerald-500/10 p-6 rounded-2xl border-2 border-emerald-500/20 flex flex-col justify-center items-center text-center">
                    <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Lucro Estimado</p>
                    <p className={`text-2xl font-black ${campaign.estimatedROI && campaign.estimatedROI >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {campaign.estimatedROI?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
