'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminService, AdminCustomer } from '@/lib/admin-service';
import {
  Search,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fetchCustomers = React.useCallback(async (pageNumber: number) => {
    if (pageNumber < 0) {
      return;
    }

    if (totalPages > 0 && pageNumber >= totalPages) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCustomers(pageNumber);
      setCustomers(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (fetchError) {
      console.error('Erro ao buscar clientes:', fetchError);
      setError('Não foi possível carregar os clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchCustomers(0);
  }, [fetchCustomers]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        if (!normalizedQuery) {
          return true;
        }

        return [customer.name, customer.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      }),
    [customers, normalizedQuery]
  );

  const totalPagesDisplay = Math.max(totalPages, 1);
  const emptyMessage = normalizedQuery
    ? 'Nenhum cliente desta página corresponde à busca atual.'
    : 'Nenhum cliente encontrado.';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="flex items-center text-2xl font-bold text-gray-800">
            <User className="mr-3 h-7 w-7 text-green-500" /> Gerenciamento de Clientes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulte clientes com uma visualização otimizada para celular e desktop.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchCustomers(page)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchCustomers(page)}
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
            ? `Exibindo ${filteredCustomers.length} de ${customers.length} clientes desta página.`
            : `Página ${page + 1} com ${customers.length} clientes carregados.`}
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-gray-100 p-4">
                <div className="h-4 w-1/2 rounded bg-gray-100" />
                <div className="mt-3 h-3 w-2/3 rounded bg-gray-100" />
                <div className="mt-4 h-3 w-1/3 rounded bg-gray-100" />
              </div>
            ))
          ) : filteredCustomers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <article key={customer.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-gray-900">{customer.name}</h2>
                    <p className="mt-1 flex items-center break-all text-sm text-gray-600">
                      <Mail className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {customer.email}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-gray-400" />
                      {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {customer.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" /> Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                      <XCircle className="mr-1 h-3 w-3" /> Inativo
                    </span>
                  )}
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
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">E-mail</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Membro Desde</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="h-4 w-full rounded bg-gray-100"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">{emptyMessage}</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="mr-2 h-3.5 w-3.5 text-gray-400" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-3.5 w-3.5 text-gray-400" />
                          {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {customer.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" /> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <XCircle className="mr-1 h-3 w-3" /> Inativo
                          </span>
                        )}
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
              onClick={() => fetchCustomers(page - 1)}
              disabled={page === 0 || loading}
              className="rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[4rem] text-center text-sm font-medium text-gray-700">{page + 1} / {totalPagesDisplay}</span>
            <button
              type="button"
              onClick={() => fetchCustomers(page + 1)}
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
