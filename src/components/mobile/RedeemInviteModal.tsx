'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mobileCardService } from '@/lib/mobile-card-service';
import { getFriendlyErrorMessage } from '@/lib/error-handler';

interface RedeemInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RedeemInviteModal: React.FC<RedeemInviteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await mobileCardService.redeemInvitation(token.trim());
      setSuccessMessage(response.message || 'Convite resgatado com sucesso!');
      
      // Limpa após 2 segundos e fecha
      setTimeout(() => {
        setToken('');
        setSuccessMessage(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Código inválido ou expirado.'));
    } finally {
      setIsLoading(false);
    }
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

          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase italic">Resgatar Convite</h2>
            <p className="text-slate-500 text-sm font-medium">Insira o código recebido para ganhar seus pontos.</p>
          </div>

          {successMessage ? (
            <div className="py-8 flex flex-col items-center text-center gap-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Tudo certo!</h3>
                <p className="text-slate-500">{successMessage}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Código do Convite"
                placeholder="Ex: ABC-123-XYZ"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoFocus
                className="text-center font-mono text-lg uppercase tracking-widest py-6"
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-in shake-in">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/30"
                isLoading={isLoading}
                disabled={!token.trim()}
              >
                Resgatar Pontos
              </Button>
              
              <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest mt-4">
                FIDD • Fidelidade que recompensa
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
