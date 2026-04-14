'use client';

import React, { useEffect, useState } from 'react';
import { adminService, AdminStore } from '@/lib/admin-service';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchStores = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await adminService.getStores(pageNumber);
      setStores(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      console.error('Erro ao buscar lojistas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(0);
  }, []);

  const toggleStoreStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await adminService.updateStoreStatus(id, !currentStatus);
      // Atualizar lista localmente
      setStores(stores.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (error) {
      console.error('Erro ao alterar status da loja:', error);
      alert('Erro ao alterar status da loja');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Lojistas</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Fantasia / CNPJ</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Assinatura</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ativo (Admin)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Nenhum lojista encontrado.</td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{store.tradeName}</p>
                      <p className="text-xs text-gray-500">{store.taxId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {store.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.subscriptionStatus === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {store.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {store.isActive ? (
                        <span className="inline-flex items-center text-green-600 text-xs font-medium">
                          <CheckCircle className="mr-1 h-3 w-3" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 text-xs font-medium">
                          <XCircle className="mr-1 h-3 w-3" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStoreStatus(store.id, store.isActive)}
                        disabled={actionLoading === store.id}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          store.isActive 
                            ? 'text-red-600 border-red-200 hover:bg-red-50' 
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        } disabled:opacity-50`}
                      >
                        {actionLoading === store.id ? (
                          <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : store.isActive ? (
                          <>
                            <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                            Desativar
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Página <span className="font-medium">{page + 1}</span> de <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchStores(page - 1)}
              disabled={page === 0 || loading}
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => fetchStores(page + 1)}
              disabled={page + 1 >= totalPages || loading}
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
