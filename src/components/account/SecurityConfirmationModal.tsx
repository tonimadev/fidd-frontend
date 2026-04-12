'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SecurityConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  error?: string;
  requirePasswordCreation?: boolean;
}

export const SecurityConfirmationModal: React.FC<SecurityConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  error,
  requirePasswordCreation = false,
}) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {requirePasswordCreation ? 'Configurar Senha de Segurança' : 'Confirmação de Segurança'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {requirePasswordCreation
              ? 'Detectamos que você entrou via Google. Para realizar alterações sensíveis, configure uma senha para sua conta Fidd.'
              : 'Para sua segurança, confirme sua senha atual para salvar as alterações.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                {requirePasswordCreation ? 'Nova Senha' : 'Sua Senha Atual'}
              </label>
              <Input
                type="password"
                placeholder={requirePasswordCreation ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold">
                {error === 'REQUIRE_PASSWORD_CREATION'
                  ? 'Você precisa criar uma senha local antes de continuar.'
                  : 'Senha incorreta. Tente novamente.'}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isLoading}
              >
                {requirePasswordCreation ? 'Criar e Salvar' : 'Confirmar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};