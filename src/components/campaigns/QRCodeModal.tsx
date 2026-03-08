/**
 * Componente para geração e exibição de QR Code de pontuação
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { qrcodeService } from '@/lib/qrcode-service';
import { QRCodeResponse } from '@/types/qrcode';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface QRCodeModalProps {
  campaignId: number;
  campaignName: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  campaignId,
  campaignName,
  onClose,
}) => {
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [progress, setProgress] = useState(100);

  const fetchQRCode = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await qrcodeService.generateQRCode(campaignId);
      setQrData(data);
      setTimeLeft(60);
      setProgress(100);
    } catch (err) {
      setError('Erro ao gerar QR Code. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  // Busca inicial
  useEffect(() => {
    fetchQRCode();
  }, [fetchQRCode]);

  // Timer e Refresh automático
  useEffect(() => {
    if (!qrData || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 5) {
          fetchQRCode();
          return 60;
        }
        return prev - 1;
      });
      
      setProgress((prev) => {
        const newProgress = prev - (100 / 60);
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 1000);

    // Refresh antecipado aos 5 segundos restantes para garantir continuidade
    if (timeLeft === 5) {
      // fetchQRCode(); // Opcional, o timer acima já lida com o 0
    }

    return () => clearInterval(timer);
  }, [qrData, isLoading, timeLeft, fetchQRCode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl border-none animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center pl-8">
              <CardTitle className="text-2xl font-bold">Pontuação Presencial</CardTitle>
              <CardDescription>{campaignName}</CardDescription>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-6">
          {isLoading && !qrData ? (
            <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-xl animate-pulse">
              <div className="text-muted-foreground">Gerando...</div>
            </div>
          ) : error ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center bg-red-50 text-red-600 rounded-xl p-4 text-center">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchQRCode}>
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70" />
              <div className="relative bg-white p-6 rounded-2xl shadow-inner border border-gray-100">
                {qrData && (
                  <QRCodeSVG 
                    value={qrData.token} 
                    size={200}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/favicon.ico", // Opcional: logo no centro
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <div className="mt-8 w-full space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Atualiza em {timeLeft}s</span>
              <button 
                onClick={fetchQRCode}
                className="text-primary hover:underline flex items-center gap-1"
                disabled={isLoading}
              >
                <svg className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar agora
              </button>
            </div>
            
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 10 ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[11px] text-center text-muted-foreground px-4 leading-relaxed">
              Peça para o cliente escanear este código com o app FIDD para receber os pontos instantaneamente.
            </p>
          </div>
        </CardContent>

        <div className="p-6 pt-0">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </Card>
    </div>
  );
};
