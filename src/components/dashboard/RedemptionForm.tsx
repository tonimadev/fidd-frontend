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
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const RedemptionForm: React.FC = () => {
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
      reset();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || 'Erro ao validar código. Tente novamente.';
      setErrorMessage(message);
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
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Resgate de Prêmio</h2>
            <p className="text-muted-foreground text-sm">
              Digite o código de 6 caracteres apresentado pelo cliente.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700 font-medium text-center">{errorMessage}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <Input
              placeholder="Ex: XJ7K2P"
              className="text-center text-3xl font-mono tracking-[0.5em] h-16 uppercase"
              autoFocus
              maxLength={6}
              error={errors.code?.message}
              {...codeRegister}
              onChange={(e) => {
                handleInputChange(e);
                onChange(e);
              }}
            />
            
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              isLoading={isSubmitting}
            >
              Validar e Resgatar
            </Button>
          </div>
        </form>
      </Card>

      {successData && (
        <Card className="p-6 border-green-200 bg-green-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-green-900">{successData.message}</h3>
              <p className="text-green-800 text-sm">Entrega do prêmio físico liberada!</p>
            </div>

            <div className="w-full pt-4 border-t border-green-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 font-medium">Cliente:</span>
                <span className="text-green-900 font-bold">{successData.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 font-medium">Prêmio:</span>
                <span className="text-green-900 font-bold">{successData.campaignName}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-green-600 italic">
                <span>Data/Hora:</span>
                <span>{new Date(successData.redeemedAt || '').toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-100"
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
