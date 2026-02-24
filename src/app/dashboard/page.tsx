/**
 * Página de dashboard (protegida)
 */

'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FIDD Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm">
              Bem-vindo, <strong>{user?.tradeName}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo ao FIDD!</h2>
            <p className="text-gray-600 mt-2">
              Gerenciamento completo de campanhas de fidelização para sua loja
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">—</div>
              <p className="text-gray-700 text-sm font-medium mt-2">Campanhas Ativas</p>
              <p className="text-gray-600 text-xs mt-1">Veja suas campanhas</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="text-3xl font-bold text-green-600">—</div>
              <p className="text-gray-700 text-sm font-medium mt-2">Total de Clientes</p>
              <p className="text-gray-600 text-xs mt-1">Clientes em programa</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">—</div>
              <p className="text-gray-700 text-sm font-medium mt-2">Pontos Distribuídos</p>
              <p className="text-gray-600 text-xs mt-1">Total acumulado</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">—</div>
              <p className="text-gray-700 text-sm font-medium mt-2">Taxa de Engajamento</p>
              <p className="text-gray-600 text-xs mt-1">Últimos 30 dias</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-3">📋</div>
              <h4 className="font-semibold text-gray-900">Criar Campanha</h4>
              <p className="text-sm text-gray-600 mt-1">Inicie uma nova campanha de fidelização</p>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-3">🎟️</div>
              <h4 className="font-semibold text-gray-900">Gerar Convites</h4>
              <p className="text-sm text-gray-600 mt-1">Crie convites de fidelização para seus clientes</p>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-900">Configurações</h4>
              <p className="text-sm text-gray-600 mt-1">Gerencie sua conta e preferências</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

