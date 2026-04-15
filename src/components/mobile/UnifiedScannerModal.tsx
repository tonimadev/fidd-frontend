'use client';

import React, { useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, QrCode, Ticket, Loader2, Camera, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mobileCardService } from '@/lib/mobile-card-service';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { QrScanner } from './QrScanner';

interface UnifiedScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialCardId?: number | null;
}

export const UnifiedScannerModal: React.FC<UnifiedScannerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialCardId = null
}) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'CAMERA' | 'MANUAL'>('CAMERA');
  const [successData, setSuccessData] = useState<{ 
    message: string; 
    type: 'INVITATION' | 'PUNCH';
    campaignName?: string;
    newScore?: number;
  } | null>(null);

  const finalize = useCallback(() => {
    setTimeout(() => {
      setToken('');
      setSuccessData(null);
      onClose();
      if (onSuccess) onSuccess();
    }, 3000);
  }, [onClose, onSuccess]);

  const processCode = useCallback(async (code: string, isFromQrCode: boolean) => {
    const cleanToken = code.trim();
    if (!cleanToken) return;

    setIsLoading(true);
    setError(null);

    try {
      // Se tivermos um cardId inicial, tentamos primeiro o punch
      if (initialCardId) {
        try {
          const res = await mobileCardService.collectPoints({
            cardId: initialCardId,
            qrToken: cleanToken,
            isQrCode: isFromQrCode
          });
          if (res.success) {
            setSuccessData({ message: res.message, type: 'PUNCH', newScore: res.newScore });
            finalize();
            return;
          }
        } catch {
          // Se falhou o punch, talvez seja um convite? Vamos tentar convite abaixo
          console.log('Não era um punch token válido para este card, tentando convite...');
        }
      }

      // Se não era punch ou não tínhamos cardId, tentamos convite
      try {
        const res = await mobileCardService.redeemInvitation(cleanToken, isFromQrCode);
        if (res.success) {
          setSuccessData({ 
            message: res.message, 
            type: 'INVITATION', 
            campaignName: res.campaignName 
          });
          finalize();
          return;
        }
      } catch (err) {
        // Se falhou convite também, damos o erro
        setError(getFriendlyErrorMessage(err, 'Código inválido ou expirado.'));
      }

    } catch {
      setError('Ocorreu um erro ao processar o código.');
    } finally {
      setIsLoading(false);
    }
  }, [initialCardId, finalize]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCode(token, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6 flex justify-between items-start pr-12">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase italic flex items-center gap-2">
                <QrCode size={24} className="text-primary" />
                Validar
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-tight">Use a câmera ou digite o código.</p>
            </div>
            
            {!successData && (
              <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shrink-0 ml-2">
                <button
                  onClick={() => setMode('CAMERA')}
                  className={`p-2 rounded-xl transition-all ${mode === 'CAMERA' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  title="Usar Câmera"
                >
                  <Camera size={20} />
                </button>
                <button
                  onClick={() => setMode('MANUAL')}
                  className={`p-2 rounded-xl transition-all ${mode === 'MANUAL' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  title="Digitar Código"
                >
                  <Keyboard size={20} />
                </button>
              </div>
            )}
          </div>

          {successData ? (
            <div className="py-8 flex flex-col items-center text-center gap-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Sucesso!</h3>
                <p className="text-slate-500 font-medium">{successData.message}</p>
                {successData.type === 'PUNCH' && (
                  <div className="mt-4 bg-primary/10 px-6 py-2 rounded-full inline-block">
                    <span className="text-primary font-black uppercase text-xs tracking-widest">Saldo: {successData.newScore}</span>
                  </div>
                )}
                {successData.type === 'INVITATION' && (
                  <div className="mt-4 bg-secondary/20 px-6 py-2 rounded-full inline-block border border-secondary/20">
                    <span className="text-secondary-foreground font-black uppercase text-xs tracking-widest">{successData.campaignName}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === 'CAMERA' ? (
                <div className="py-2">
                  <QrScanner 
                    onResult={(code) => processCode(code, true)} 
                    onError={(err) => console.error("Scanner Error:", err)}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <span className="text-xs font-black uppercase tracking-widest text-primary">Validando...</span>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Código do Lojista"
                      placeholder="EX: ABC-123"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      autoFocus
                      className="text-center font-mono text-lg uppercase tracking-widest py-8 border-2 border-slate-100 focus:border-primary/50"
                    />
                    <div className="absolute right-4 top-[3.2rem] text-slate-300">
                      {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Ticket size={24} />}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-7 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all"
                    isLoading={isLoading}
                    disabled={!token.trim()}
                  >
                    Validar Agora
                  </Button>
                </form>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in shake-in">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="pt-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
                  FIDD • Digitalizando sua fidelidade
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
