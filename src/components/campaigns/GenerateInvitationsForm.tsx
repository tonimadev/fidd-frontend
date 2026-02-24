/**
 * Componente de geração de convites de fidelização
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateInvitationsSchema, GenerateInvitationsFormData } from '@/lib/validations';
import { invitationService } from '@/lib/invitation-service';
import { GenerateInvitationsResponse, Invitation } from '@/types/invitation';
import { AxiosError } from 'axios';

interface GenerateInvitationsFormProps {
  campaignId: number;
  campaignName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GenerateInvitationsForm: React.FC<GenerateInvitationsFormProps> = ({
  campaignId,
  campaignName,
  onSuccess,
  onCancel,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationsResult, setInvitationsResult] = useState<GenerateInvitationsResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateInvitationsFormData>({
    resolver: zodResolver(generateInvitationsSchema),
    mode: 'onBlur',
    defaultValues: {
      quantity: 10,
      pointsPerInvitation: 5,
      expirationMinutes: 60,
    },
  });

  const onSubmit = async (data: GenerateInvitationsFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const result = await invitationService.generateInvitations({
        campaignId,
        quantity: data.quantity,
        pointsPerInvitation: data.pointsPerInvitation,
        expirationMinutes: data.expirationMinutes,
      });

      setInvitationsResult(result);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data?.message || 'Erro ao gerar convites. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Token copiado para a área de transferência!');
  };

  const downloadInvitations = () => {
    if (!invitationsResult) return;

    const csv = invitationsResult.invitations
      .map((inv, index) => `${index + 1},${inv.token},${inv.pointsValue},${inv.expiresAt}`)
      .join('\n');

    const header = 'ID,Token,Pontos,Expira em\n';
    const content = header + csv;

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convites-${campaignName}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Se convites foram gerados, mostrar resultado
  if (invitationsResult) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-green-50 border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-green-900">Convites Gerados com Sucesso!</h3>
          <p className="mt-2 text-sm text-green-700">
            Total de <strong>{invitationsResult.totalGenerated}</strong> convites gerados para a campanha{' '}
            <strong>{campaignName}</strong>
          </p>
          <p className="mt-1 text-sm text-green-700">
            Cada convite vale <strong>{invitationsResult.pointsPerInvitation} pontos</strong> e expira em{' '}
            <strong>{invitationsResult.expirationMinutes} minutos</strong>
          </p>
        </div>

        {/* Lista de Convites */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Tokens dos Convites:</h4>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {invitationsResult.invitations.map((invitation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Convite #{index + 1}</p>
                  <p className="text-sm font-mono text-gray-700 break-all">{invitation.token}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {invitation.pointsValue} pontos | Expira: {new Date(invitation.expiresAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(invitation.token)}
                  className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <button
            onClick={downloadInvitations}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Baixar CSV
          </button>
          <button
            onClick={() => {
              setInvitationsResult(null);
              reset();
              onSuccess?.();
            }}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Gerar Mais Convites
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Informações da Campanha */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          Gerando convites para a campanha: <strong>{campaignName}</strong>
        </p>
      </div>

      {/* Quantidade de Convites */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantidade de Convites
        </label>
        <input
          {...register('quantity')}
          type="number"
          id="quantity"
          placeholder="10"
          min="1"
          max="1000"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Quantidade de convites a gerar (1-1000)
        </p>
      </div>

      {/* Pontos por Convite */}
      <div>
        <label htmlFor="pointsPerInvitation" className="block text-sm font-medium text-gray-700">
          Pontos por Convite
        </label>
        <input
          {...register('pointsPerInvitation')}
          type="number"
          id="pointsPerInvitation"
          placeholder="5"
          min="1"
          max="10000"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.pointsPerInvitation && (
          <p className="mt-1 text-sm text-red-600">{errors.pointsPerInvitation.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Quantos pontos cada cliente ganha ao usar o convite
        </p>
      </div>

      {/* Expiração em Minutos */}
      <div>
        <label htmlFor="expirationMinutes" className="block text-sm font-medium text-gray-700">
          Expiração (em minutos)
        </label>
        <input
          {...register('expirationMinutes')}
          type="number"
          id="expirationMinutes"
          placeholder="60"
          min="5"
          max="10080"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.expirationMinutes && (
          <p className="mt-1 text-sm text-red-600">{errors.expirationMinutes.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Tempo de expiração dos convites (5 min a 7 dias = 10080 min)
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Gerando...' : 'Gerar Convites'}
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

