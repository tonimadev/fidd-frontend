'use client';

import React, { useState, useEffect } from 'react';
import { NfcService } from '@/lib/nfc-service';
import { nfcApiService } from '@/lib/nfc-api-service';
import { campaignService } from '@/lib/campaign-service';
import { Campaign } from '@/types/campaign';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Smartphone, Wifi, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';

export function NfcIssuer() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [amount, setAmount] = useState<number>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    setIsSupported(NfcService.isSupported());
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await campaignService.listCampaigns();
      const active = data.filter(c => c.isActive);
      setCampaigns(active);
      if (active.length > 0) {
        setSelectedCampaignId(active[0].id.toString());
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    }
  };

  const handleStartNfc = async () => {
    if (!selectedCampaignId) {
      setErrorMessage('Selecione uma campanha primeiro.');
      return;
    }

    try {
      setStatus('loading');
      setErrorMessage(null);

      // 1. Solicita voucher ao backend
      const voucher = await nfcApiService.issueVoucher({
        campaignId: parseInt(selectedCampaignId),
        amount: amount
      });

      // 2. Inicia escrita NFC
      setStatus('waiting');
      await NfcService.write({
        token: voucher.token,
        amount: voucher.amount
      });

      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: unknown) {
      console.error('Erro na emissão NFC:', error);
      setStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : '';
      
      if (errorMessage === 'NFC_NOT_SUPPORTED') {
        setErrorMessage('NFC não suportado neste dispositivo ou navegador.');
      } else if (errorMessage === 'NFC_PERMISSION_DENIED') {
        setErrorMessage('Permissão para usar NFC foi negada.');
      } else {
        setErrorMessage('Falha ao emitir pontos via NFC. Tente novamente.');
      }
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">NFC Não Suportado</h3>
              <p className="text-sm text-amber-700 mt-1">
                Seu navegador ou dispositivo não suporta a tecnologia Web NFC. 
                Certifique-se de estar usando o Chrome no Android e que o NFC esteja ativado nas configurações do sistema.
              </p>
              <div className="mt-4 flex gap-3">
                 <Button variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100" onClick={() => window.location.reload()}>
                   Tentar Novamente
                 </Button>
                 <Button variant="ghost" className="text-amber-800 hover:bg-amber-100">
                   Ver Guia Manual
                 </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Emissão via NFC</CardTitle>
            <CardDescription>Aproxime o celular do cliente para enviar pontos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Campanha</label>
          <select 
            className="w-full p-2 border rounded-md bg-background"
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            disabled={status === 'waiting' || status === 'loading'}
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade de Pontos/Selos</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            className="w-full p-2 border rounded-md bg-background"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            disabled={status === 'waiting' || status === 'loading'}
          />
        </div>

        {status === 'idle' && (
          <Button 
            className="w-full py-6 text-lg gap-2" 
            onClick={handleStartNfc}
            disabled={campaigns.length === 0}
          >
            <Smartphone className="w-5 h-5" />
            Iniciar Emissão NFC
          </Button>
        )}

        {status === 'loading' && (
          <Button className="w-full py-6 text-lg gap-2" disabled>
            <Loader2 className="w-5 h-5 animate-spin" />
            Gerando Token Seguro...
          </Button>
        )}

        {status === 'waiting' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center text-center gap-4 animate-pulse">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Smartphone className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-xl">Aproxime o Dispositivo</h3>
              <p className="text-blue-700">O cliente deve aproximar o celular do seu para receber os pontos.</p>
            </div>
            <Button variant="ghost" onClick={() => setStatus('idle')} className="text-blue-600 underline">
              Cancelar
            </Button>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center text-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 text-xl">Sucesso!</h3>
              <p className="text-emerald-700">Os pontos foram enviados com sucesso via NFC.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center gap-4">
            <div className="bg-red-100 p-4 rounded-full text-red-600">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-xl">Erro na Operação</h3>
              <p className="text-red-700">{errorMessage}</p>
            </div>
            <Button onClick={() => setStatus('idle')} variant="outline" className="border-red-300 text-red-800">
              Tentar Novamente
            </Button>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3 flex gap-2 items-start">
          <Info className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-500">
            A emissão via NFC é efêmera. O token expira em 60 segundos para garantir a segurança da transação.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
