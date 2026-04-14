'use client';

import React, { useEffect, useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchCampaigns = async (pageNumber: number) => {
    try {
      setLoading(true);
      const data = await adminService.getCampaigns(pageNumber);
      setCampaigns(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(0);
  }, []);

  const toggleCampaignStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await adminService.updateCampaignStatus(id, !currentStatus);
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
    } catch (error) {
      console.error('Erro ao alterar status da campanha:', error);
      alert('Erro ao alterar status da campanha');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Megaphone className="mr-3 h-7 w-7 text-purple-500" /> Gerenciamento de Campanhas
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar campanha ou loja..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campanha</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loja</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiração</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punches</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhuma campanha encontrada.</td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">ID: {campaign.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Store className="h-3.5 w-3.5 mr-2 text-gray-400" />
                        {campaign.storeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                        {campaign.expirationDate
                          ? new Date(campaign.expirationDate).toLocaleDateString('pt-BR')
                          : 'Sem expiração'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-blue-600">
                        <Hash className="h-3 w-3 mr-1" />
                        {campaign.totalPunches}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" /> Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" /> Inativa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.isActive)}
                        disabled={actionLoading === campaign.id}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          campaign.isActive
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        } disabled:opacity-50`}
                      >
                        {actionLoading === campaign.id ? (
                          <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Página <span className="font-medium">{page + 1}</span> de <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchCampaigns(page - 1)}
              disabled={page === 0 || loading}
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => fetchCampaigns(page + 1)}
              disabled={page + 1 >= totalPages || loading}
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
