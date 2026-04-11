/**
 * Componente de formulário para criar campanha
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, CreateCampaignFormData } from '@/lib/validations';
import { campaignService } from '@/lib/campaign-service';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { useSearchParams } from 'next/navigation';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess, onCancel }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createCampaignSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      pointsRequired: Number(searchParams?.get('stampCount')) || 10,
      expirationDate: '',
      description: '',
    }
  });

  const expirationDate = watch('expirationDate');

  const setExpirationDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    const formattedDate = date.toISOString().split('T')[0];
    setValue('expirationDate', formattedDate);
  };

  const onSubmit = async (data: CreateCampaignFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await campaignService.createCampaign({
        name: data.name,
        pointsRequired: data.pointsRequired,
        expirationDate: data.expirationDate,
        description: data.description,
      });

      reset();
      onSuccess?.();
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao criar campanha. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obter data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <Input
        label="Nome da Campanha"
        placeholder="Ex: Promoção de Verão"
        error={errors.name?.message}
        maxLength={100}
        {...register('name')}
      />

      <TextArea
        label="Descrição da Campanha"
        placeholder="Descreva as regras da promoção (ex: válido apenas na loja física)"
        error={errors.description?.message}
        {...register('description')}
        maxLength={1000}
      />

      <div className="space-y-1.5">
        <Input
          label="Pontos Requeridos"
          type="number"
          placeholder="10"
          min="1"
          max="10000"
          error={errors.pointsRequired?.message}
          {...register('pointsRequired')}
        />
        <p className="text-xs text-muted-foreground">
          Quantidade de selos necessários para o cliente resgatar a recompensa.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {[1, 2, 3, 6].map((months) => {
            const date = new Date();
            date.setMonth(date.getMonth() + months);
            const formatted = date.toISOString().split('T')[0];
            const isActive = expirationDate === formatted;
            
            return (
              <Button
                key={months}
                type="button"
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setExpirationDate(months)}
                className="text-xs"
              >
                {months} {months === 1 ? 'mês' : 'meses'}
              </Button>
            );
          })}
        </div>

        <Input
          label="Data de Expiração"
          type="date"
          min={today}
          error={errors.expirationDate?.message}
          {...register('expirationDate')}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          isLoading={isSubmitting}
        >
          Criar Campanha
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

