/**
 * Componente de formulário para criar campanha
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, CreateCampaignFormData } from '@/lib/validations';
import { campaignService } from '@/lib/campaign-service';
import { AxiosError } from 'axios';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess, onCancel }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    mode: 'onBlur',
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
      });

      reset();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || 'Erro ao criar campanha. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obter data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Nome da Campanha */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome da Campanha
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="Ex: Promoção de Verão"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Pontos Requeridos */}
      <div>
        <label htmlFor="pointsRequired" className="block text-sm font-medium text-gray-700">
          Pontos Requeridos
        </label>
        <input
          {...register('pointsRequired')}
          type="number"
          id="pointsRequired"
          placeholder="10"
          min="1"
          max="10000"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.pointsRequired && (
          <p className="mt-1 text-sm text-red-600">{errors.pointsRequired.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Quantidade de pontos necessários para o cliente resgatar essa campanha
        </p>
      </div>

      {/* Data de Expiração */}
      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
          Data de Expiração
        </label>

        {/* Atalhos para datas */}
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setExpirationDate(1)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              expirationDate === new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1 mês
          </button>
          <button
            type="button"
            onClick={() => setExpirationDate(2)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              expirationDate === new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0]
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2 meses
          </button>
        </div>

        <input
          {...register('expirationDate')}
          type="date"
          id="expirationDate"
          min={today}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.expirationDate && (
          <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Criando...' : 'Criar Campanha'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

