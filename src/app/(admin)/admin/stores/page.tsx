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
  Key
} from 'lucide-react';

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

  const handleEditClick = (store: AdminStore) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
    setAdminPassword('');
    setTempPassword(null);
  };

  const handleDetailsClick = async (id: number) => {
    try {
      setActionLoading(id);
      const data = await adminService.getStoreById(id);
      setSelectedStore(data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da loja:', error);
      alert('Erro ao buscar detalhes da loja');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !adminPassword) return;

    try {
      setIsSubmitting(true);
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
      
      // Update local list
      setStores(stores.map(s => s.id === selectedStore.id ? selectedStore : s));
      setIsEditModalOpen(false);
      alert('Loja atualizada com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao atualizar loja:', error);
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Erro ao atualizar loja. Verifique a senha do administrador.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedStore || !adminPassword) {
      alert('Digite sua senha de administrador primeiro.');
      return;
    }

    if (!confirm(`Tem certeza que deseja resetar a senha de ${selectedStore.tradeName}?`)) return;

    try {
      setIsSubmitting(true);
      const password = await adminService.resetStorePassword(selectedStore.id, adminPassword);
      setTempPassword(password);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert('Erro ao resetar senha. Verifique a senha do administrador.');
    } finally {
      setIsSubmitting(false);
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
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleDetailsClick(store.id)}
                        className="inline-flex items-center p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Detalhes"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(store)}
                        className="inline-flex items-center p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStoreStatus(store.id, store.isActive)}
                        aria-label={store.isActive ? 'Desativar lojista' : 'Ativar lojista'}
                        title={store.isActive ? 'Desativar lojista' : 'Ativar lojista'}
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

      {/* Modal de Detalhes */}
      {isDetailsModalOpen && selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-500" /> Detalhes do Lojista
              </h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="mt-1 text-sm text-gray-600">{selectedStore.email}</p>
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
                    {selectedStore.latitude && selectedStore.longitude 
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

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Edit className="mr-2 h-5 w-5 text-amber-500" /> Editar Lojista
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStore}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input 
                        type="number" step="any"
                        value={selectedStore.latitude || ''}
                        onChange={(e) => setSelectedStore({...selectedStore, latitude: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input 
                        type="number" step="any"
                        value={selectedStore.longitude || ''}
                        onChange={(e) => setSelectedStore({...selectedStore, longitude: parseFloat(e.target.value)})}
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

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
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
