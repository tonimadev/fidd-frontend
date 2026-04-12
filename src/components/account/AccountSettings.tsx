/**
 * Componente de configurações de conta
 */

'use client';

import React, { useState, useEffect } from 'react';
import { accountService } from '@/lib/account-service';
import { DeleteAccountStatus, StoreProfile } from '@/types/account';
import { ApiError } from '@/types/auth';
import { AxiosError } from 'axios';
import { DeleteAccountModal } from './DeleteAccountModal';
import { ApiKeysSettings } from './ApiKeysSettings';
import { AddressSettings } from './AddressSettings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SecurityConfirmationModal } from './SecurityConfirmationModal';

export const AccountSettings: React.FC = () => {
  const [deleteStatus, setDeleteStatus] = useState<DeleteAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Profile fields
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [tradeName, setTradeName] = useState('');
  
  // Security Modal
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [requirePasswordCreation, setRequirePasswordCreation] = useState(false);
  const [securityError, setSecurityError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const [status, profileData] = await Promise.all([
        accountService.getDeleteStatus(),
        accountService.getProfile()
      ]);
      setDeleteStatus(status);
      setProfile(profileData);
      setTradeName(profileData.tradeName);
    } catch (error) {
      setErrorMessage('Erro ao carregar dados da conta. Tente novamente.');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfileClick = () => {
    if (!tradeName.trim()) {
      setErrorMessage('O nome da loja não pode estar vazio.');
      return;
    }
    setSecurityError('');
    setShowSecurityModal(true);
  };

  const confirmProfileUpdate = async (password: string) => {
    try {
      setIsSaving(true);
      setSecurityError('');
      setSuccessMessage('');
      
      await accountService.updateProfile({
        tradeName,
        currentPassword: password
      });
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      setShowSecurityModal(false);
      setRequirePasswordCreation(false);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMsg = axiosError.response?.data?.message || '';
      if (errorMsg === 'REQUIRE_PASSWORD_CREATION') {
        setRequirePasswordCreation(true);
        setSecurityError('REQUIRE_PASSWORD_CREATION');
      } else if (errorMsg === 'authentication.invalid.password') {
        setSecurityError('Senha incorreta');
      } else {
        setSecurityError('Erro ao atualizar perfil');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!confirm('Tem certeza que deseja cancelar a deleção da sua conta?')) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const status = await accountService.cancelAccountDeletion();
      setDeleteStatus(status);
    } catch (error) {
      setErrorMessage('Erro ao cancelar deleção. Tente novamente.');
      console.error('Erro ao cancelar deleção:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    loadDeleteStatus();
  };

  const isPendingDeletion = deleteStatus?.status === 'PENDING_DELETION';

  if (isLoading && !deleteStatus) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Configurações da Conta</h2>

      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{successMessage}</p>
        </div>
      )}

      {/* Seção de Informações Básicas */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Altere as informações públicas do seu estabelecimento.
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome do Estabelecimento</label>
            <Input 
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              placeholder="Ex: Pizzaria do Zé"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail de Contato</label>
            <Input 
              value={profile?.email || ''} 
              disabled 
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">O e-mail não pode ser alterado</p>
          </div>

          <div className="pt-2">
            <Button onClick={handleUpdateProfileClick}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Localização */}
      <AddressSettings />

      {/* Seção de Chaves de API */}
      <ApiKeysSettings />

      {/* Seção de Deleção de Conta */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Gerenciamento de Conta</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Opções para gerenciar sua conta na plataforma
          </p>
        </div>

        {isPendingDeletion ? (
          // Status de deleção pendente
          <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Sua conta está marcada para deleção</h4>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Sua conta será permanentemente deletada em{' '}
                  <strong>{deleteStatus.daysRemaining} dias</strong> ({deleteStatus.scheduledDeletionDate}).
                </p>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Se deseja manter sua conta, você pode cancelar a deleção clicando no botão abaixo.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCancelDeletion}
                disabled={isLoading}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-muted"
              >
                {isLoading ? 'Cancelando...' : 'Cancelar Deleção'}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isLoading}
                className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-500/10 disabled:bg-muted"
              >
                Confirmar Deleção Imediata
              </button>
            </div>
          </div>
        ) : (
          // Conta ativa
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Sua conta está ativa
              </p>
            </div>

            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <h4 className="font-semibold text-red-600 dark:text-red-400">Zona de Perigo</h4>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Deletar sua conta é uma ação permanente. Todos os seus dados, campanhas e histórico serão perdidos.
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Você terá 30 dias para mudar de ideia e reativar sua conta. Após esse período, a deleção será permanente.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Deletar Conta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Deleção */}
      {showDeleteModal && (
        <DeleteAccountModal
          onSuccess={handleDeleteSuccess}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Modal de Segurança */}
      <SecurityConfirmationModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        onConfirm={confirmProfileUpdate}
        isLoading={isSaving}
        error={securityError}
        requirePasswordCreation={requirePasswordCreation}
      />
    </div>
  );
};

