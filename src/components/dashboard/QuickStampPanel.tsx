/**
 * Painel de Selo Rápido — Unified Stamp Panel
 *
 * Reúne todos os métodos de carimbo em um único card do dashboard:
 * PIN (Tap-to-Connect), QR Code, Manual, e NFC.
 *
 * 🧠 Psychological Principle: Hick's Law Inversion
 * Instead of adding cognitive load with multiple navigation targets,
 * we reduce decision time by presenting all options in one place
 * with clear visual differentiation.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { campaignService } from '@/lib/campaign-service';
import { qrcodeService } from '@/lib/qrcode-service';
import { stampService, ManualPunchResponse } from '@/lib/stamp-service';
import { NfcService } from '@/lib/nfc-service';
import { nfcApiService } from '@/lib/nfc-api-service';
import { Campaign } from '@/types/campaign';
import { QRCodeResponse } from '@/types/qrcode';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/auth';
import { SessionPairingStore } from './SessionPairingStore';
import { QRCodeSVG } from 'qrcode.react';
import {
  Zap, QrCode, Users, Smartphone,
  RefreshCw, CheckCircle2, AlertTriangle, Loader2,
  Timer, Wifi, Info
} from 'lucide-react';

type StampMethod = 'pin' | 'qr' | 'manual' | 'nfc';

interface QuickStampPanelProps {
  onStampSuccess?: () => void;
}

export function QuickStampPanel({ onStampSuccess }: QuickStampPanelProps) {
  const [activeMethod, setActiveMethod] = useState<StampMethod>('pin');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [nfcSupported, setNfcSupported] = useState(true);

  // QR Code state
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [qrCountdown, setQrCountdown] = useState(60);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Manual state
  const [manualIdentifier, setManualIdentifier] = useState('');
  const [manualPunchCount, setManualPunchCount] = useState(1);
  const [isManualPunching, setIsManualPunching] = useState(false);
  const [manualFeedback, setManualFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [manualWarning, setManualWarning] = useState<ManualPunchResponse['warning'] | null>(null);

  // NFC state
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'error'>('idle');
  const [nfcError, setNfcError] = useState<string | null>(null);

  useEffect(() => {
    setNfcSupported(NfcService.isSupported());
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const data = await campaignService.listCampaigns();
      const active = data.filter(c => c.isActive);
      setCampaigns(active);
      if (active.length > 0) {
        setSelectedCampaignId(active[0].id.toString());
      }
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // === QR Code Logic ===
  const generateQrCode = useCallback(async () => {
    if (!selectedCampaignId) return;
    try {
      setIsGeneratingQr(true);
      const data = await qrcodeService.generateQRCode(parseInt(selectedCampaignId));
      setQrData(data);
      setQrCountdown(60);
    } catch (err) {
      console.error('QR generation error:', err);
    } finally {
      setIsGeneratingQr(false);
    }
  }, [selectedCampaignId]);

  // Auto-generate QR when switching to QR tab
  useEffect(() => {
    if (activeMethod === 'qr' && !qrData && selectedCampaignId) {
      generateQrCode();
    }
  }, [activeMethod, qrData, selectedCampaignId, generateQrCode]);

  // QR countdown timer
  useEffect(() => {
    if (activeMethod !== 'qr' || !qrData) return;

    const timer = setInterval(() => {
      setQrCountdown(prev => {
        if (prev <= 1) {
          setQrData(null);
          generateQrCode();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMethod, qrData, generateQrCode]);

  // === Manual Punch Logic ===
  const handleManualPunch = async (bypass = false) => {
    if (!manualIdentifier || !selectedCampaignId) return;

    try {
      setIsManualPunching(true);
      setManualFeedback(null);
      const response = await stampService.manualPunch({
        identifier: manualIdentifier.trim(),
        campaignId: Number(selectedCampaignId),
        punchCount: manualPunchCount,
        bypassWarnings: bypass,
      });

      if (response.warning && !bypass) {
        setManualWarning(response.warning);
        setIsManualPunching(false);
        return;
      }

      setManualWarning(null);
      setManualFeedback({ type: 'success', message: response.message });
      setManualIdentifier('');
      setManualPunchCount(1);
      onStampSuccess?.();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setManualFeedback({
        type: 'error',
        message: axiosError.response?.data?.message || 'Ocorreu um erro ao aplicar o carimbo.',
      });
      setManualWarning(null);
    } finally {
      setIsManualPunching(false);
    }
  };

  // === NFC Logic ===
  const handleNfc = async () => {
    if (!selectedCampaignId) return;

    try {
      setNfcStatus('loading');
      setNfcError(null);

      const voucher = await nfcApiService.issueVoucher({
        campaignId: parseInt(selectedCampaignId),
        amount: 1,
      });

      setNfcStatus('waiting');
      await NfcService.write({
        token: voucher.token,
        amount: voucher.amount,
      });

      setNfcStatus('success');
      onStampSuccess?.();
      setTimeout(() => setNfcStatus('idle'), 5000);
    } catch (error: unknown) {
      setNfcStatus('error');
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage === 'NFC_NOT_SUPPORTED') {
        setNfcError('NFC não suportado neste dispositivo.');
      } else if (errorMessage === 'NFC_PERMISSION_DENIED') {
        setNfcError('Permissão NFC negada.');
      } else {
        setNfcError('Falha ao emitir via NFC.');
      }
    }
  };

  const methods: { id: StampMethod; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'pin', label: 'PIN', icon: <Zap className="w-4 h-4" />, description: 'Mais rápido' },
    { id: 'qr', label: 'QR Code', icon: <QrCode className="w-4 h-4" />, description: 'Clássico' },
    { id: 'manual', label: 'Manual', icon: <Users className="w-4 h-4" />, description: 'Por e-mail' },
    { id: 'nfc', label: 'NFC', icon: <Smartphone className="w-4 h-4" />, description: 'Por toque' },
  ];

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Selo Rápido</CardTitle>
            <CardDescription className="text-xs">Aplique selos usando o método mais conveniente</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Campaign selector (shared across all methods) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider ml-1">Campanha Ativa</label>
          {isLoadingCampaigns ? (
            <div className="h-10 bg-muted/30 animate-pulse rounded-lg border border-border" />
          ) : campaigns.length === 0 ? (
            <p className="text-xs text-red-500 italic ml-1">Nenhuma campanha ativa.</p>
          ) : (
            <select
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedCampaignId}
              onChange={(e) => {
                setSelectedCampaignId(e.target.value);
                setQrData(null); // Reset QR when campaign changes
              }}
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Method tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted/50 rounded-xl">
          {methods.map(method => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-center transition-all ${
                activeMethod === method.id
                  ? 'bg-background shadow-sm border border-border text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              } ${method.id === 'nfc' && !nfcSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={method.id === 'nfc' && !nfcSupported}
            >
              {method.icon}
              <span className="text-[10px] font-bold leading-none">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Method content */}
        <div className="min-h-[200px]">
          {/* === PIN (Tap-to-Connect) === */}
          {activeMethod === 'pin' && (
            <SessionPairingStore onStampSent={onStampSuccess} />
          )}

          {/* === QR Code === */}
          {activeMethod === 'qr' && (
            <div className="space-y-4">
              {qrData ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
                    <QRCodeSVG
                      value={qrData.token}
                      size={180}
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Timer className={`w-4 h-4 ${qrCountdown <= 10 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                    <span className={qrCountdown <= 10 ? 'text-red-500' : 'text-muted-foreground'}>
                      Expira em {qrCountdown}s
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={generateQrCode}
                    isLoading={isGeneratingQr}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Renovar QR Code
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs text-muted-foreground font-medium">Gerando QR Code...</p>
                </div>
              )}
            </div>
          )}

          {/* === Manual === */}
          {activeMethod === 'manual' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider ml-1">E-mail ou Celular</label>
                <Input
                  placeholder="cliente@email.com ou (11) 99999-9999"
                  value={manualIdentifier}
                  onChange={(e) => setManualIdentifier(e.target.value)}
                  disabled={isManualPunching}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider ml-1">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={manualPunchCount}
                  onChange={(e) => setManualPunchCount(Number(e.target.value))}
                  disabled={isManualPunching}
                />
              </div>

              {manualFeedback && !manualWarning && (
                <div className={`p-3 rounded-lg text-xs font-medium ${
                  manualFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {manualFeedback.message}
                </div>
              )}

              {manualWarning && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-xs text-amber-800 space-y-1">
                      <p className="font-bold">Aviso de conclusão de cartão</p>
                      <p>Esta operação completará o cartão e iniciará <strong>{manualWarning.cardsNeeded}</strong> novo(s).</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-amber-300 hover:bg-amber-100 text-amber-800"
                      onClick={() => setManualWarning(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1 text-xs bg-amber-600 hover:bg-amber-700 text-white border-none"
                      onClick={() => handleManualPunch(true)}
                      isLoading={isManualPunching}
                    >
                      Prosseguir
                    </Button>
                  </div>
                </div>
              )}

              {!manualWarning && (
                <Button
                  className="w-full"
                  onClick={() => handleManualPunch()}
                  isLoading={isManualPunching}
                  disabled={!manualIdentifier || campaigns.length === 0}
                >
                  Aplicar Carimbo
                </Button>
              )}
            </div>
          )}

          {/* === NFC === */}
          {activeMethod === 'nfc' && (
            <div className="space-y-4">
              {!nfcSupported ? (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                  <p className="text-sm font-bold text-muted-foreground">NFC não suportado neste navegador</p>
                  <p className="text-xs text-muted-foreground">Use o Chrome no Android com NFC ativado.</p>
                </div>
              ) : nfcStatus === 'idle' ? (
                <Button
                  className="w-full py-5 text-sm gap-2"
                  onClick={handleNfc}
                  disabled={campaigns.length === 0}
                >
                  <Wifi className="w-4 h-4" />
                  Iniciar Emissão NFC
                </Button>
              ) : nfcStatus === 'loading' ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs text-muted-foreground font-medium">Gerando token...</p>
                </div>
              ) : nfcStatus === 'waiting' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center text-center gap-3 animate-pulse">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">Aproxime o Dispositivo</h3>
                    <p className="text-xs text-blue-700 mt-1">O cliente deve aproximar o celular.</p>
                  </div>
                  <Button variant="ghost" onClick={() => setNfcStatus('idle')} className="text-blue-600 text-xs underline">
                    Cancelar
                  </Button>
                </div>
              ) : nfcStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center text-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-emerald-900 text-sm">Sucesso!</h3>
                    <p className="text-xs text-emerald-700 mt-1">Pontos enviados via NFC.</p>
                  </div>
                </div>
              ) : nfcStatus === 'error' ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center gap-3">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                  <p className="text-sm text-red-700 font-bold">{nfcError}</p>
                  <Button onClick={() => setNfcStatus('idle')} variant="outline" size="sm" className="border-red-300 text-red-800">
                    Tentar Novamente
                  </Button>
                </div>
              ) : null}

              {nfcStatus === 'idle' && (
                <div className="bg-muted/50 rounded-lg p-3 flex gap-2 items-start">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-[10px] text-muted-foreground">
                    O token NFC expira em 60 segundos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
