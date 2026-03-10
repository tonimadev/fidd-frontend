/**
 * Componente para gerenciamento de chaves de API
 */

'use client';

import React, { useState, useEffect } from 'react';
import { accountService } from '@/lib/account-service';
import { ApiKey } from '@/types/account';

export const ApiKeysSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const keys = await accountService.listApiKeys();
      setApiKeys(keys);
    } catch (error) {
      setErrorMessage('Erro ao carregar chaves de API.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setIsCreating(true);
      setErrorMessage('');
      const newKey = await accountService.createApiKey({ name: newKeyName });
      setApiKeys([...apiKeys, newKey]);
      setLastCreatedKey(newKey.key);
      setNewKeyName('');
    } catch (error) {
      setErrorMessage('Erro ao criar chave de API.');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (id: number) => {
    if (!confirm('Tem certeza que deseja revogar esta chave? Ela deixará de funcionar imediatamente.')) {
      return;
    }

    try {
      await accountService.revokeApiKey(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
    } catch (error) {
      setErrorMessage('Erro ao revogar chave.');
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Chave copiada para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Chaves de API</h3>
          <p className="mt-1 text-sm text-gray-600">
            Utilize estas chaves para integrar seu sistema externo (PDV, E-commerce, CRM) com o FIDD.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Formulário de Criação */}
        <form onSubmit={handleCreateKey} className="mb-8 flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Nome da chave (ex: PDV Loja Centro)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isCreating ? 'Gerando...' : 'Gerar Nova Chave'}
          </button>
        </form>

        {/* Exibição da chave recém-criada */}
        {lastCreatedKey && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-900">Guarde sua chave com segurança!</h4>
            <p className="mt-1 text-sm text-yellow-700">
              Por motivos de segurança, ela não será exibida novamente.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 break-all rounded bg-white p-2 border border-yellow-300 font-mono text-sm">
                {lastCreatedKey}
              </code>
              <button
                onClick={() => copyToClipboard(lastCreatedKey)}
                className="rounded bg-yellow-600 px-3 py-2 text-sm font-bold text-white hover:bg-yellow-700"
              >
                Copiar
              </button>
              <button
                onClick={() => setLastCreatedKey(null)}
                className="text-sm text-yellow-700 hover:underline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Chaves */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Criada em</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Último uso</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Carregando chaves...</td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Nenhuma chave de API gerada.</td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">{key.name}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Nunca utilizada'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revogar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
