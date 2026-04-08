/**
 * Componente de geração de convites de fidelização
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateInvitationsSchema, GenerateInvitationsFormData } from '@/lib/validations';
import { invitationService } from '@/lib/invitation-service';
import { GenerateInvitationsResponse } from '@/types/invitation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';

import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';

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
  } = useForm({
    resolver: zodResolver(generateInvitationsSchema),
    mode: 'onBlur',
    defaultValues: {
      quantity: 10,
      pointsPerInvitation: 5,
      expirationMinutes: 1440,
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
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao gerar convites. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string = 'Link') => {
    navigator.clipboard.writeText(text);
    alert(`${label} copiado para a área de transferência!`);
  };

  const downloadInvitations = () => {
    if (!invitationsResult) return;

    const csv = invitationsResult.invitations
      .map((inv, index) => `${index + 1},${inv.inviteToken},${inv.points},${inv.expiresAt},${inv.inviteUrl}`)
      .join('\n');

    const header = 'ID,Token,Pontos,Expira em,URL do Convite\n';
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
            {invitationsResult.message}
          </p>
          <p className="mt-1 text-sm text-green-700">
            Total de <strong>{invitationsResult.totalGenerated}</strong> convites gerados para a campanha{' '}
            <strong>{campaignName}</strong>
          </p>
        </div>

        {/* Lista de Convites */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Seus Convites:
          </h4>
          <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm">
            {invitationsResult.invitations.map((invitation, index) => (
              <div
                key={invitation.id || index}
                className="p-5 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white text-lg font-mono font-bold px-4 py-1.5 rounded-lg tracking-wider shadow-sm">
                        {invitation.inviteToken}
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wide border border-green-100">
                        {invitation.points} pontos
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 break-all flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" />
                        </svg>
                        {invitation.inviteUrl}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Expira em: {new Date(invitation.expiresAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block p-2 bg-white border border-gray-100 rounded-lg shadow-sm group-hover:border-primary/30 transition-colors">
                      {invitation.qrCodeUrl ? (
                        <Image 
                          src={invitation.qrCodeUrl} 
                          alt="QR Code" 
                          width={64}
                          height={64}
                          className="w-16 h-16"
                          unoptimized={true}
                        />
                      ) : (
                        <QRCodeSVG value={invitation.inviteUrl} size={64} />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(invitation.inviteToken, 'Código')}
                        className="h-8 text-xs font-semibold justify-start md:justify-center"
                      >
                        Copiar Código
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invitation.inviteUrl, 'Link')}
                        className="h-8 text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/5 justify-start md:justify-center"
                      >
                        Copiar Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const msg = `Parabéns! Você ganhou ${invitation.points} pontos da campanha "${campaignName}".\n\nResgate agora pelo App:\n🤖 Android: https://play.google.com/store/apps/details?id=digital.tonima.fidd\n🍎 Apple: (em breve)\n🌐 Web: ${window.location.origin}/app\n\nUse o código: ${invitation.inviteToken}`;
                          copyToClipboard(msg, 'Mensagem');
                        }}
                        className="h-8 text-xs font-semibold text-green-600 hover:text-green-700 hover:bg-green-50 justify-start md:justify-center"
                      >
                        Copiar Mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Button
            onClick={downloadInvitations}
            variant="outline"
            className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
          >
            Baixar CSV
          </Button>
          <Button
            onClick={() => {
              setInvitationsResult(null);
              reset();
              onSuccess?.();
            }}
            variant="primary"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Gerar Mais
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Fechar
          </Button>
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
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm text-primary/90">
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Gerando...' : 'Gerar Convites'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

