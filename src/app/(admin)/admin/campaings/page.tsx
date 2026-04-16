'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminService, AdminCampaign } from '@/lib/admin-service';
import {
  Search,
  Megaphone,
  Store,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Hash,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

type NoticeState = {
  type: 'success' | 'error';
  message: string;
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [query, setQuery] = useState('');

  const showNotice = React.useCallback((n: NoticeState) => {
    setNotice(n);
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  const fetchCampaigns = React.useCallback(async (pageNumber: number) => {
    if (pageNumber < 0) {
      return;
    }

    if (totalPages > 0 && pageNumber >= totalPages) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCampaigns(pageNumber);
      setCampaigns(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (fetchError) {
      console.error('Erro ao buscar campanhas:', fetchError);
      setError('Não foi possível carregar as campanhas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchCampaigns(0);
  }, [fetchCampaigns]);

  const toggleCampaignStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      setNotice(null);
      await adminService.updateCampaignStatus(id, !currentStatus);
      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, isActive: !currentStatus } : campaign
        )
      );
      showNotice({
        type: 'success',
        message: 'Status da campanha atualizado com sucesso.',
      });
    } catch (toggleError) {
      console.error('Erro ao alterar status da campanha:', toggleError);
      showNotice({
        type: 'error',
        message: 'Não foi possível alterar o status da campanha.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) => {
        if (!normalizedQuery) {
          return true;
        }

        return [campaign.name, campaign.storeName, String(campaign.id)]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      }),
    [campaigns, normalizedQuery]
  );

  const totalPagesDisplay = Math.max(totalPages, 1);
  const emptyMessage = normalizedQuery
    ? 'Nenhuma campanha desta página corresponde à busca atual.'
    : 'Nenhuma campanha encontrada.';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <Megaphone className="mr-3 h-7 w-7 text-purple-500" /> Gerenciamento de Campanhas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitore campanhas com melhor leitura no celular e feedback claro de ações.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar campanha, loja ou ID..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchCampaigns(page)}
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
              onClick={() => fetchCampaigns(page)}
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
            ? `Exibindo ${filteredCampaigns.length} de ${campaigns.length} campanhas desta página.`
            : `Página ${page + 1} com ${campaigns.length} campanhas carregadas.`}
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
          ) : filteredCampaigns.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <article key={campaign.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-gray-900">{campaign.name}</h2>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">ID: {campaign.id}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {campaign.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Store className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{campaign.storeName}</span>
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {campaign.expirationDate
                      ? new Date(campaign.expirationDate).toLocaleDateString('pt-BR')
                      : 'Sem expiração'}
                  </p>
                  <p className="flex items-center font-medium text-blue-600">
                    <Hash className="mr-2 h-3.5 w-3.5" />
                    {campaign.totalPunches} punches
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCampaignStatus(campaign.id, campaign.isActive)}
                  disabled={actionLoading === campaign.id}
                  className={`mt-4 inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                    campaign.isActive
                      ? 'border-red-200 text-red-700 hover:bg-red-50'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {actionLoading === campaign.id ? (
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : campaign.isActive ? (
                    <>
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      Pausar campanha
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Ativar campanha
                    </>
                  )}
                </button>
              </article>
            ))
          )}
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Campanha</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Loja</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Expiração</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Punches</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 w-full rounded bg-gray-100"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">{emptyMessage}</td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ID: {campaign.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Store className="mr-2 h-3.5 w-3.5 text-gray-400" />
                          {campaign.storeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-3.5 w-3.5 text-gray-400" />
                          {campaign.expirationDate
                            ? new Date(campaign.expirationDate).toLocaleDateString('pt-BR')
                            : 'Sem expiração'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-blue-600">
                          <Hash className="mr-1 h-3 w-3" />
                          {campaign.totalPunches}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {campaign.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" /> Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <XCircle className="mr-1 h-3 w-3" /> Inativa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleCampaignStatus(campaign.id, campaign.isActive)}
                          disabled={actionLoading === campaign.id}
                          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                            campaign.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {actionLoading === campaign.id ? (
                            <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                          ) : campaign.isActive ? (
                            <>
                              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                              Ativar
                            </>
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
              onClick={() => fetchCampaigns(page - 1)}
              disabled={page === 0 || loading}
              className="rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[4rem] text-center text-sm font-medium text-gray-700">{page + 1} / {totalPagesDisplay}</span>
            <button
              type="button"
              onClick={() => fetchCampaigns(page + 1)}
              disabled={page + 1 >= totalPages || loading}
              className="rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              aria-label="Próxima página"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
