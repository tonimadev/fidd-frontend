/**
 * Componente de geração de convites de fidelização
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateInvitationsSchema, GenerateInvitationsFormData } from '@/lib/validations';
import { invitationService } from '@/lib/invitation-service';
import { GenerateInvitationsResponse } from '@/types/invitation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, QrCode, FileDown, PlusCircle } from 'lucide-react';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      expirationMinutes: 1440,
    },
  });

  const onSubmit: SubmitHandler<GenerateInvitationsFormData> = async (data) => {
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Convites Gerados com Sucesso!</h3>
          <p className="mt-1 text-sm text-emerald-600/80 dark:text-emerald-400/80">
            {invitationsResult.message}
          </p>
          <p className="mt-2 text-sm text-emerald-600/80 dark:text-emerald-400/80">
            Total de <span className="font-bold">{invitationsResult.totalGenerated}</span> convites para <span className="font-bold">{campaignName}</span>
          </p>
        </div>

        {/* Lista de Convites */}
        <div className="space-y-4">
          <h4 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
            <QrCode className="w-4 h-4 text-primary" />
            Seus Convites
          </h4>
          <div className="max-h-[450px] overflow-y-auto border border-border rounded-xl divide-y divide-border bg-card/50">
            {invitationsResult.invitations.map((invitation, index) => {
              const uniqueId = `inv-${index}`;
              return (
                <div
                  key={invitation.id || index}
                  className="p-5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground text-lg font-mono font-black px-4 py-2 rounded-lg tracking-widest shadow-sm ring-1 ring-primary/20">
                          {invitation.inviteToken}
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                          +{invitation.points} PONTOS
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 group/link">
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground/80 break-all select-all">
                            {invitation.inviteUrl}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          EXPIRA EM: {new Date(invitation.expiresAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                      <div className="hidden sm:block p-2.5 bg-white rounded-xl shadow-md group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                        {invitation.qrCodeUrl ? (
                          <Image
                            src={invitation.qrCodeUrl}
                            alt="QR Code"
                            width={70}
                            height={70}
                            className="w-[70px] h-[70px]"
                            unoptimized={true}
                          />
                        ) : (
                          <QRCodeSVG value={invitation.inviteUrl} size={70} />
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-36">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(invitation.inviteToken, `${uniqueId}-code`)}
                          className="h-9 text-xs font-bold justify-center border-border hover:border-primary/50"
                        >
                          {copiedId === `${uniqueId}-code` ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                          CÓDIGO
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const msg = `Parabéns! Você ganhou ${invitation.points} pontos da campanha "${campaignName}".\n\nResgate agora pelo App:\n🤖 Android: https://play.google.com/store/apps/details?id=digital.tonima.fidd\n🍎 Apple: (em breve)\n🌐 Web: ${window.location.origin}/app\n\nUse o código: ${invitation.inviteToken}`;
                            copyToClipboard(msg, `${uniqueId}-msg`);
                          }}
                          className="h-9 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 justify-center"
                        >
                          {copiedId === `${uniqueId}-msg` ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                          MENSAGEM
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={downloadInvitations}
            variant="outline"
            className="flex-1 font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            <FileDown className="w-4 h-4 mr-2" />
            BAIXAR CSV
          </Button>
          <Button
            onClick={() => {
              setInvitationsResult(null);
              reset();
              onSuccess?.();
            }}
            className="flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            GERAR MAIS
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1 font-bold"
          >
            FECHAR
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Informações da Campanha */}
      <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
        <p className="text-sm text-primary font-medium text-center">
          Campanha Ativa: <span className="font-black underline decoration-primary/30">{campaignName}</span>
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Quantidade de Convites"
          {...register('quantity', { valueAsNumber: true })}
          type="number"
          id="quantity"
          placeholder="10"
          min="1"
          max="1000"
          error={errors.quantity?.message}
        />
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter px-1">
          Limite: 1.000 unidades por lote
        </p>

        <Input
          label="Pontos por Convite"
          {...register('pointsPerInvitation', { valueAsNumber: true })}
          type="number"
          id="pointsPerInvitation"
          placeholder="5"
          min="1"
          max="10000"
          error={errors.pointsPerInvitation?.message}
        />

        <Input
          label="Expiração (em minutos)"
          {...register('expirationMinutes', { valueAsNumber: true })}
          type="number"
          id="expirationMinutes"
          placeholder="1440"
          min="5"
          max="10080"
          error={errors.expirationMinutes?.message}
        />
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter px-1">
          Padrão: 24 horas (1440 min)
        </p>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 font-bold"
        >
          {isSubmitting ? 'GERANDO...' : 'GERAR CONVITES'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 font-bold"
          >
            CANCELAR
          </Button>
        )}
      </div>
    </form>
  );
};
