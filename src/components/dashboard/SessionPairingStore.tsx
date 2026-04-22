/**
 * Componente de Pareamento por Sessão (Lojista Dashboard)
 *
 * Exibe um PIN de 4 dígitos que o cliente digita para se conectar.
 * Uma vez conectado, o lojista envia selos com um único botão.
 *
 * 🧠 Psychological Principle: Reciprocity (Cialdini)
 * Making it effortless for the store to give value creates a positive
 * feedback loop that reinforces the loyalty program usage.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sessionPairingStoreService, SessionResponse, SessionStatusResponse } from '@/lib/session-pairing-service';
import { campaignService } from '@/lib/campaign-service';
import { Campaign } from '@/types/campaign';
import { Button } from '@/components/ui/Button';
import { Zap, RefreshCw, CheckCircle2, User, Loader2, AlertTriangle, WifiOff } from 'lucide-react';

interface SessionPairingStoreProps {
  onStampSent?: () => void;
}

export function SessionPairingStore({ onStampSent }: SessionPairingStoreProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatusResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const [stampFeedback, setStampFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await campaignService.listCampaigns();
        const active = data.filter(c => c.isActive);
        setCampaigns(active);
        if (active.length > 0) {
          setSelectedCampaignId(active[0].id.toString());
        }
      } catch (err) {
        console.error('Erro ao carregar campanhas:', err);
      }
    };
    loadCampaigns();
  }, []);

  // Cleanup polling
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPolling = useCallback((sessionId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const status = await sessionPairingStoreService.getSessionStatus(sessionId);
        setSessionStatus(status);

        if (status.isExpired || status.status === 'EXPIRED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setSession(null);
          setSessionStatus(null);
          setError('Sessão expirou. Gere um novo PIN.');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
  }, []);

  const handleCreateSession = async () => {
    if (!selectedCampaignId) return;

    try {
      setIsCreating(true);
      setError(null);
      setStampFeedback(null);

      if (pollingRef.current) clearInterval(pollingRef.current);

      const newSession = await sessionPairingStoreService.createSession({
        campaignId: parseInt(selectedCampaignId),
      });

      setSession(newSession);
      setSessionStatus(null);
      startPolling(newSession.sessionId);
    } catch (err) {
      console.error('Create session error:', err);
      setError('Erro ao criar sessão. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendStamp = async () => {
    if (!session) return;

    try {
      setIsStamping(true);
      setStampFeedback(null);

      const result = await sessionPairingStoreService.sendStamp(session.sessionId);

      setStampFeedback({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        onStampSent?.();
        // Clear feedback after 3 seconds
        setTimeout(() => setStampFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Send stamp error:', err);
      setStampFeedback({
        success: false,
        message: 'Erro ao enviar selo.',
      });
    } finally {
      setIsStamping(false);
    }
  };

  const isClientConnected = sessionStatus?.status === 'PAIRED' || sessionStatus?.status === 'STAMPED';

  return (
    <div className="space-y-4">
      {/* Campaign selector (only when no active session) */}
      {!session && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Campanha</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              disabled={isCreating}
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Button
            className="w-full py-5 text-sm gap-2 font-bold"
            onClick={handleCreateSession}
            isLoading={isCreating}
            disabled={campaigns.length === 0}
          >
            <Zap className="w-4 h-4" />
            Gerar PIN de Conexão
          </Button>
        </div>
      )}

      {/* Active session: PIN display */}
      {session && (
        <div className="space-y-4">
          {/* PIN Display */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 text-center border border-primary/20 relative overflow-hidden">
            {/* Connection status indicator */}
            <div className="absolute top-3 right-3">
              {isClientConnected ? (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Conectado
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  Aguardando
                </span>
              )}
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-3">
              PIN de Conexão
            </p>

            {/* Large PIN display */}
            <div className="flex justify-center gap-2 mb-4">
              {session.pin.split('').map((digit, i) => (
                <div
                  key={i}
                  className="w-14 h-16 flex items-center justify-center rounded-xl bg-white border-2 border-primary/20 shadow-sm"
                >
                  <span className="text-3xl font-black text-primary">{digit}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Campanha: <span className="font-bold text-foreground">{session.campaignName}</span>
            </p>

            {/* Connected client info */}
            {isClientConnected && sessionStatus?.customerName && (
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-200 animate-in fade-in zoom-in-95 duration-300">
                <User className="w-4 h-4" />
                <span className="text-sm font-bold">{sessionStatus.customerName}</span>
              </div>
            )}
          </div>

          {/* Stamp button (only when client is connected) */}
          {isClientConnected ? (
            <Button
              className="w-full py-6 text-lg gap-3 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              onClick={handleSendStamp}
              isLoading={isStamping}
            >
              <CheckCircle2 className="w-5 h-5" />
              Aplicar Selo
            </Button>
          ) : (
            <div className="text-center py-3 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">
                Aguardando cliente digitar o PIN...
              </p>
            </div>
          )}

          {/* Stamp feedback */}
          {stampFeedback && (
            <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 ${
              stampFeedback.success
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {stampFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {stampFeedback.message}
            </div>
          )}

          {/* Session controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 text-xs"
              onClick={handleCreateSession}
              isLoading={isCreating}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Novo PIN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={() => {
                if (pollingRef.current) clearInterval(pollingRef.current);
                setSession(null);
                setSessionStatus(null);
              }}
            >
              <WifiOff className="w-3.5 h-3.5" />
              Encerrar
            </Button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
