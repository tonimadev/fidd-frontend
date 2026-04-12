/**
 * Card de Carimbo Manual por identificador (E-mail ou Celular)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { campaignService } from '@/lib/campaign-service';
import { stampService } from '@/lib/stamp-service';
import { Campaign } from '@/types/campaign';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/auth';

interface ManualPunchCardProps {
  initialIdentifier?: string;
  onSuccess?: () => void;
}

export const ManualPunchCard: React.FC<ManualPunchCardProps> = ({ 
  initialIdentifier = '', 
  onSuccess 
}) => {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [campaignId, setCampaignId] = useState<number | ''>('');
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadActiveCampaigns();
  }, []);

  useEffect(() => {
    setIdentifier(initialIdentifier);
  }, [initialIdentifier]);

  const loadActiveCampaigns = async () => {
    try {
      setIsCampaignsLoading(true);
      const campaigns = await campaignService.listCampaigns();
      const active = campaigns.filter(c => c.isActive);
      setActiveCampaigns(active);
      if (active.length === 1) {
        setCampaignId(active[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
    } finally {
      setIsCampaignsLoading(false);
    }
  };

  const handlePunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !campaignId) return;

    try {
      setIsLoading(true);
      setFeedback(null);
      const response = await stampService.manualPunch({
        identifier: identifier.trim(),
        campaignId: Number(campaignId)
      });
      setFeedback({ type: 'success', message: response.message });
      if (initialIdentifier === '') {
        setIdentifier('');
      }
      onSuccess?.();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setFeedback({ 
        type: 'error', 
        message: axiosError.response?.data?.message || 'Ocorreu um erro ao aplicar o carimbo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg">Carimbo Manual</CardTitle>
        <CardDescription className="text-xs">
          Informe o E-mail ou Celular do cliente para carimbar o cartão.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handlePunch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Identificador</label>
            <Input
              placeholder="E-mail ou Celular"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Campanha</label>
            {isCampaignsLoading ? (
               <div className="h-10 bg-muted/30 animate-pulse rounded-md border border-border"></div>
            ) : activeCampaigns.length === 0 ? (
               <p className="text-xs text-red-500 italic ml-1">Nenhuma campanha ativa encontrada.</p>
            ) : (
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={campaignId}
                onChange={(e) => setCampaignId(Number(e.target.value))}
                required
                disabled={isLoading || activeCampaigns.length === 0}
              >
                <option value="" disabled>Selecione uma campanha</option>
                {activeCampaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {feedback && (
            <div className={`p-3 rounded-md text-xs font-medium ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {feedback.message}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading} 
            disabled={activeCampaigns.length === 0}
          >
            Aplicar Carimbo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
