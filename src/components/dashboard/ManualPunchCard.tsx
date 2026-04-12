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
  const [punchCount, setPunchCount] = useState<number>(1);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [warning, setWarning] = useState<ManualPunchResponse['warning'] | null>(null);

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

  const handlePunch = async (e?: React.FormEvent, bypass = false) => {
    e?.preventDefault();
    if (!identifier || !campaignId) return;

    try {
      setIsLoading(true);
      setFeedback(null);
      const response = await stampService.manualPunch({
        identifier: identifier.trim(),
        campaignId: Number(campaignId),
        punchCount: punchCount,
        bypassWarnings: bypass
      });

      if (response.warning && !bypass) {
        setWarning(response.warning);
        setIsLoading(false);
        return;
      }

      setWarning(null);
      setFeedback({ type: 'success', message: response.message });
      if (initialIdentifier === '') {
        setIdentifier('');
      }
      setPunchCount(1);
      onSuccess?.();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setFeedback({ 
        type: 'error', 
        message: axiosError.response?.data?.message || 'Ocorreu um erro ao aplicar o carimbo.' 
      });
      setWarning(null);
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

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Qtd.</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={punchCount}
                onChange={(e) => setPunchCount(Number(e.target.value))}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {feedback && !warning && (
            <div className={`p-3 rounded-md text-xs font-medium ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {feedback.message}
            </div>
          )}

          {warning && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs text-amber-800 space-y-1">
                  <p className="font-bold">Aviso de conclusão de cartão</p>
                  <p>Você está aplicando {punchCount} carimbos, mas o cartão atual do cliente possui {warning.currentPoints}/{warning.pointsRequired} pontos.</p>
                  <p>Esta operação irá completar o cartão atual e iniciar <strong>{warning.cardsNeeded}</strong> novo(s) cartão(ões).</p>
                  <p className="mt-2 text-[10px] font-medium opacity-80">Cartões disponíveis na sua conta: <strong>{warning.cardsAvailable}</strong></p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                   type="button" 
                   variant="outline" 
                   size="sm" 
                   className="flex-1 text-xs border-amber-300 hover:bg-amber-100 text-amber-800"
                   onClick={() => setWarning(null)}
                >
                  Cancelar
                </Button>
                <Button 
                   type="button" 
                   size="sm" 
                   className="flex-1 text-xs bg-amber-600 hover:bg-amber-700 text-white border-none"
                   onClick={() => handlePunch(undefined, true)}
                   isLoading={isLoading}
                >
                  Prosseguir
                </Button>
              </div>
            </div>
          )}

          {!warning && (
            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading} 
              disabled={activeCampaigns.length === 0}
            >
              Aplicar Carimbo
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
