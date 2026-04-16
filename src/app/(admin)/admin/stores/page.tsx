'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminService, AdminStore } from '@/lib/admin-service';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Info,
  Lock,
  MapPin,
  Building2,
  AtSign,
  Hash,
  X,
  AlertTriangle,
  Key,
  RefreshCw
} from 'lucide-react';

type NoticeState = {
  type: 'success' | 'error';
  message: string;
};

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function AdminStoresPage() {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [query, setQuery] = useState('');

  const showNotice = React.useCallback((n: NoticeState) => {
    setNotice(n);
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  const fetchStores = React.useCallback(async (pageNumber: number) => {
    if (pageNumber < 0) {
      return;
    }

    if (totalPages > 0 && pageNumber >= totalPages) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getStores(pageNumber);
      setStores(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      console.error('Erro ao buscar lojistas:', error);
      setError('Não foi possível carregar os lojistas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchStores(0);
  }, [fetchStores]);

  const toggleStoreStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      setNotice(null);
      await adminService.updateStoreStatus(id, !currentStatus);
      setStores((currentStores) =>
        currentStores.map((store) =>
          store.id === id ? { ...store, isActive: !currentStatus } : store
        )
      );
      showNotice({
        type: 'success',
        message: 'Status da loja atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao alterar status da loja:', error);
      showNotice({
        type: 'error',
        message: 'Não foi possível alterar o status da loja.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (store: AdminStore) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
    setAdminPassword('');
    setTempPassword(null);
  };

  const handleDetailsClick = async (id: number) => {
    try {
      setActionLoading(id);
      setNotice(null);
      const data = await adminService.getStoreById(id);
      setSelectedStore(data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da loja:', error);
      showNotice({
        type: 'error',
        message: 'Não foi possível carregar os detalhes da loja.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !adminPassword) return;

    try {
      setIsSubmitting(true);
      setNotice(null);
      await adminService.updateStore(selectedStore.id, {
        tradeName: selectedStore.tradeName,
        taxId: selectedStore.taxId,
        email: selectedStore.email,
        isActive: selectedStore.isActive,
        address: selectedStore.address,
        latitude: selectedStore.latitude,
        longitude: selectedStore.longitude,
        adminPassword: adminPassword
      });

      setStores((currentStores) =>
        currentStores.map((store) =>
          store.id === selectedStore.id ? { ...store, ...selectedStore } : store
        )
      );
      setIsEditModalOpen(false);
      showNotice({
        type: 'success',
        message: 'Loja atualizada com sucesso.',
      });
    } catch (error: unknown) {
      console.error('Erro ao atualizar loja:', error);
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Erro ao atualizar loja. Verifique a senha do administrador.';
      showNotice({
        type: 'error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedStore || !adminPassword) {
      showNotice({
        type: 'error',
        message: 'Digite sua senha de administrador antes de resetar a senha do lojista.',
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja resetar a senha de ${selectedStore.tradeName}?`)) return;

    try {
      setIsSubmitting(true);
      setNotice(null);
      const password = await adminService.resetStorePassword(selectedStore.id, adminPassword);
      setTempPassword(password);
      showNotice({
        type: 'success',
        message: `Senha temporária gerada para ${selectedStore.tradeName}.`,
      });
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      showNotice({
        type: 'error',
        message: 'Não foi possível resetar a senha. Verifique sua senha de administrador.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredStores = useMemo(
    () =>
      stores.filter((store) => {
        if (!normalizedQuery) {
          return true;
        }

        return [store.tradeName, store.email, store.taxId]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      }),
    [normalizedQuery, stores]
  );

  const totalPagesDisplay = Math.max(totalPages, 1);
  const emptyMessage = normalizedQuery
    ? 'Nenhum lojista desta página corresponde à busca atual.'
    : 'Nenhum lojista encontrado.';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Lojistas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize, filtre e gerencie lojistas com uma experiência melhor em telas menores.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, email ou documento..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchStores(page)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            notice.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchStores(page)}
              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 font-medium text-red-700 hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-500 sm:px-6">
          {normalizedQuery
            ? `Exibindo ${filteredStores.length} de ${stores.length} lojistas desta página.`
            : `Página ${page + 1} com ${stores.length} lojistas carregados.`}
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-gray-100 p-4">
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
                <div className="mt-4 h-10 rounded bg-gray-100" />
              </div>
            ))
          ) : filteredStores.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            filteredStores.map((store) => (
              <article key={store.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-gray-900">{store.tradeName}</h2>
                    <p className="mt-1 text-xs text-gray-500">{store.taxId}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {store.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="truncate">{store.email}</p>
                  <p>
                    Assinatura: <span className="font-medium text-gray-800">{store.subscriptionStatus}</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDetailsClick(store.id)}
                    disabled={actionLoading === store.id}
                    className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditClick(store)}
                    className="inline-flex items-center justify-center rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStoreStatus(store.id, store.isActive)}
                    disabled={actionLoading === store.id}
                    className={`col-span-2 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                      store.isActive
                        ? 'border-red-200 text-red-700 hover:bg-red-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {actionLoading === store.id ? (
                      <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : store.isActive ? (
                      <>
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Desativar lojista
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Ativar lojista
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Nome Fantasia / CNPJ</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Contato</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status Assinatura</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Ativo (Admin)</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 w-full rounded bg-gray-100"></div></td>
                    </tr>
                  ))
                ) : filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">{emptyMessage}</td>
                  </tr>
                ) : (
                  filteredStores.map((store) => (
                    <tr key={store.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{store.tradeName}</p>
                        <p className="text-xs text-gray-500">{store.taxId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{store.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          store.subscriptionStatus === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {store.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {store.isActive ? (
                          <span className="inline-flex items-center text-xs font-medium text-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" /> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-medium text-red-600">
                            <XCircle className="mr-1 h-3 w-3" /> Inativo
                          </span>
                        )}
                      </td>
                      <td className="space-x-2 px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDetailsClick(store.id)}
                          className="inline-flex items-center rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Detalhes"
                          aria-label={`Ver detalhes de ${store.tradeName}`}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(store)}
                          className="inline-flex items-center rounded-md p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                          title="Editar"
                          aria-label={`Editar ${store.tradeName}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStoreStatus(store.id, store.isActive)}
                          aria-label={store.isActive ? 'Desativar lojista' : 'Ativar lojista'}
                          title={store.isActive ? 'Desativar lojista' : 'Ativar lojista'}
                          disabled={actionLoading === store.id}
                          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                            store.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {actionLoading === store.id ? (
                            <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                          ) : store.isActive ? (
                            <ShieldAlert className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">
            Página <span className="font-medium">{page + 1}</span> de <span className="font-medium">{totalPagesDisplay}</span>
          </p>
          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => fetchStores(page - 1)}
              disabled={page === 0 || loading}
              className="rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[4rem] text-center text-sm font-medium text-gray-700">{page + 1} / {totalPagesDisplay}</span>
            <button
              type="button"
              onClick={() => fetchStores(page + 1)}
              disabled={page + 1 >= totalPages || loading}
              className="rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              aria-label="Próxima página"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isDetailsModalOpen && selectedStore && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
              <h3 className="flex items-center text-lg font-bold text-gray-900">
                <Info className="mr-2 h-5 w-5 text-blue-500" /> Detalhes do Lojista
              </h3>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 overflow-y-auto p-5 sm:p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase flex items-center">
                    <Building2 className="mr-1.5 h-3 w-3" /> Nome Fantasia
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedStore.tradeName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase flex items-center">
                    <Hash className="mr-1.5 h-3 w-3" /> CNPJ / CPF
                  </label>
                  <p className="mt-1 text-sm text-gray-600">{selectedStore.taxId}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase flex items-center">
                    <AtSign className="mr-1.5 h-3 w-3" /> E-mail de Login
                  </label>
                  <p className="mt-1 break-all text-sm text-gray-600">{selectedStore.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Status do Sistema</label>
                  <div className="mt-1 flex items-center">
                    {selectedStore.isActive ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Ativo</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Inativo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase flex items-center">
                    <MapPin className="mr-1.5 h-3 w-3" /> Endereço
                  </label>
                  <p className="mt-1 text-sm text-gray-600">{selectedStore.address || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Coordenadas</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedStore.latitude != null && selectedStore.longitude != null
                      ? `${selectedStore.latitude}, ${selectedStore.longitude}`
                      : 'Não informadas'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Plano Atual</label>
                  <p className="mt-1 text-sm font-semibold text-blue-600">{selectedStore.planName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Assinatura</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedStore.subscriptionStatus}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedStore && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
              <h3 className="flex items-center text-lg font-bold text-gray-900">
                <Edit className="mr-2 h-5 w-5 text-amber-500" /> Editar Lojista
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStore} className="flex flex-1 flex-col overflow-hidden">
              <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                    <input 
                      type="text" 
                      value={selectedStore.tradeName}
                      onChange={(e) => setSelectedStore({...selectedStore, tradeName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ / CPF</label>
                    <input 
                      type="text" 
                      value={selectedStore.taxId}
                      onChange={(e) => setSelectedStore({...selectedStore, taxId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input 
                      type="text" 
                      value={selectedStore.address || ''}
                      onChange={(e) => setSelectedStore({...selectedStore, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input 
                        type="number" step="any"
                        value={selectedStore.latitude ?? ''}
                        onChange={(e) => setSelectedStore({...selectedStore, latitude: parseOptionalNumber(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input 
                        type="number" step="any"
                        value={selectedStore.longitude ?? ''}
                        onChange={(e) => setSelectedStore({...selectedStore, longitude: parseOptionalNumber(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Lock className="mr-1.5 h-4 w-4 text-gray-400" /> Ações de Segurança
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full mb-2 flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <Key className="mr-2 h-4 w-4" /> Resetar Senha do Lojista
                  </button>
                  {tempPassword && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg mb-4">
                      <p className="text-xs text-green-800 font-medium mb-1">Nova Senha Temporária:</p>
                      <code className="text-lg font-bold text-green-900 tracking-wider">{tempPassword}</code>
                      <p className="text-[10px] text-green-600 mt-1">Copie agora, ela não será exibida novamente.</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-amber-900 mb-1">Sua Senha de Administrador</label>
                        <p className="text-xs text-amber-700 mb-3">Necessário para confirmar qualquer alteração.</p>
                        <input 
                          type="password" 
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Digite sua senha de admin"
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !adminPassword}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center shadow-sm shadow-blue-200"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
