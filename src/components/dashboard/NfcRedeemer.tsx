'use client';

import { useState } from 'react';
import { NfcService } from '@/lib/nfc-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Smartphone, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { redemptionService } from '@/lib/redemption-service';
import { useToast } from '@/hooks/use-toast';
import { RedemptionResponse } from '@/types/redemption';

export function NfcRedeemer() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [redemptionData, setRedemptionData] = useState<RedemptionResponse | null>(null);
  const { toast } = useToast();

  const handleStartScan = async () => {
    setStatus('scanning');
    setErrorMessage('');
    
    try {
      const token = await NfcService.scan();
      setStatus('processing');
      
      const result = await redemptionService.validateRedemption({ code: token });
      
      if (result.success) {
        setRedemptionData(result);
        setStatus('success');
        toast({
          title: "Resgate concluído!",
          description: `Prêmio entregue para ${result.customerName}`,
        });
      } else {
        throw new Error(result.message || 'Erro ao processar resgate');
      }
    } catch (error: unknown) {
      console.error('Erro no NFC Redeemer:', error);
      setStatus('error');
      
      const message = error instanceof Error ? error.message : String(error);

      if (message === 'NFC_NOT_SUPPORTED') {
        setErrorMessage('NFC não suportado neste dispositivo ou navegador.');
      } else if (message === 'NFC_PERMISSION_DENIED') {
        setErrorMessage('Permissão para usar NFC foi negada.');
      } else if (message === 'NFC_INVALID_PAYLOAD') {
        setErrorMessage('O NFC lido não contém um token de resgate FIDD válido.');
      } else if (message === 'NFC_READ_ERROR') {
        setErrorMessage('Erro ao ler a tag NFC. Tente aproximar novamente.');
      } else {
        setErrorMessage(message || 'Ocorreu um erro durante o resgate via NFC.');
      }
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMessage('');
    setRedemptionData(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Smartphone className="h-5 w-5" />
          Resgate via NFC
        </CardTitle>
        <CardDescription>
          Aproxime o celular do cliente para validar o prêmio instantaneamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'idle' && (
          <Button onClick={handleStartScan} className="w-full py-6 text-lg font-semibold">
            Ler NFC para Resgate
          </Button>
        )}

        {status === 'scanning' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg animate-pulse bg-blue-50 border-blue-200">
            <Smartphone className="h-12 w-12 text-blue-500 mb-4" />
            <p className="text-center font-medium text-blue-700">Aproxime o dispositivo do cliente...</p>
            <Button variant="ghost" onClick={reset} className="mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
              Cancelar
            </Button>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50 border-gray-200">
            <RefreshCw className="h-12 w-12 text-primary mb-4 animate-spin" />
            <p className="text-center font-medium text-gray-600">Validando token de resgate...</p>
          </div>
        )}

        {status === 'success' && redemptionData && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 font-bold">Resgate Realizado!</AlertTitle>
              <AlertDescription className="text-green-700 mt-2 space-y-1">
                <p><strong>Cliente:</strong> {redemptionData.customerName}</p>
                <p><strong>Campanha:</strong> {redemptionData.campaignName}</p>
                <p className="text-xs mt-2 text-green-600">
                  Resgatado em: {redemptionData.redeemedAt ? new Date(redemptionData.redeemedAt).toLocaleString() : 'Agora'}
                </p>
              </AlertDescription>
            </Alert>
            <Button onClick={reset} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-100">
              Realizar Novo Resgate
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-bold">Erro no Resgate</AlertTitle>
              <AlertDescription className="mt-1">
                {errorMessage}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleStartScan} className="flex-1">
                Tentar Novamente
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                Voltar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
