/**
 * Componente de formulário para resgate de prêmios
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { redemptionSchema, RedemptionFormData } from '@/lib/validations';
import { redemptionService } from '@/lib/redemption-service';
import { RedemptionResponse } from '@/types/redemption';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Ticket, AlertCircle } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { useAuth } from '@/context/auth-context';

export const RedemptionForm: React.FC = () => {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<RedemptionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RedemptionFormData>({
    resolver: zodResolver(redemptionSchema),
    defaultValues: {
      code: '',
    }
  });

  const { onChange, ...codeRegister } = register('code');

  const onSubmit = async (data: RedemptionFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessData(null);

      const response = await redemptionService.validateRedemption({
        code: data.code.toUpperCase(),
      });

      setSuccessData(response);
      if (user?.plan === 'Pro') {
        triggerConfetti();
      }
      reset();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao validar código. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setValue('code', value);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="p-8 border-border shadow-xl bg-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-center space-y-3">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Ticket className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Resgate de Prêmio</h2>
            <p className="text-muted-foreground text-sm font-medium">
              Digite o código de 6 caracteres apresentado pelo cliente.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 font-bold">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <Input
                placeholder="XJ7K2P"
                className="text-center text-4xl font-mono font-black tracking-[0.4em] h-20 uppercase border-2 focus:border-primary/50 transition-all rounded-2xl bg-muted/30"
                autoFocus
                maxLength={6}
                error={errors.code?.message}
                {...codeRegister}
                onChange={(e) => {
                  handleInputChange(e);
                  onChange(e);
                }}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 text-lg font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              isLoading={isSubmitting}
            >
              Validar e Resgatar
            </Button>
          </div>
        </form>
      </Card>

      {successData && (
        <Card className="p-8 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 animate-in fade-in slide-in-from-bottom-6 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {successData.message || 'Resgate Realizado!'}
              </h3>
              <p className="text-emerald-700/80 dark:text-emerald-400/80 font-bold text-sm">
                Entrega do prêmio físico liberada com sucesso!
              </p>
            </div>

            <div className="w-full py-6 px-4 bg-background/50 rounded-2xl border border-emerald-500/20 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Cliente</span>
                <span className="text-foreground font-black text-lg">{successData.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Prêmio</span>
                <span className="text-primary font-black text-lg">{successData.campaignName}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-500/10">
                <span className="text-muted-foreground font-medium text-[10px] uppercase">Data/Hora</span>
                <span className="text-foreground font-medium text-[11px] opacity-70">
                  {new Date(successData.redeemedAt || '').toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold uppercase tracking-widest"
              onClick={() => setSuccessData(null)}
            >
              Novo Resgate
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
