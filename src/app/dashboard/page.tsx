/**
 * Página de dashboard (protegida)
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CampaignsList } from '@/components/campaigns/CampaignsList';
import { AccountSettings } from '@/components/account/AccountSettings';
import { DashboardMetricsCard } from '@/components/dashboard/DashboardMetricsCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';

type DashboardTab = 'home' | 'campaigns' | 'settings' | 'subscriptions';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');

  const subscriptionStatus = searchParams.get('subscription');

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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'home'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Campanhas
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Assinaturas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {subscriptionStatus === 'success' && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 shadow-sm">
            <span className="text-xl">✅</span> 
            <div>
              <p className="font-bold">Assinatura realizada!</p>
              <p className="text-sm">Seu plano Pro já está ativo. Aproveite todos os benefícios.</p>
            </div>
          </div>
        )}

        {subscriptionStatus === 'cancel' && (
          <div className="mb-8 p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 flex items-center gap-3 shadow-sm">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-bold">Checkout cancelado</p>
              <p className="text-sm">A sessão de pagamento foi encerrada. Nenhuma cobrança foi realizada.</p>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <>
            {/* Métricas do Dashboard */}
            <DashboardMetricsCard />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-3">📋</div>
                  <h4 className="font-semibold text-gray-900">Criar Campanha</h4>
                  <p className="text-sm text-gray-600 mt-1">Inicie uma nova campanha de fidelização</p>
                </button>

                <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                  <div className="text-2xl mb-3">🎟️</div>
                  <h4 className="font-semibold text-gray-900">Gerar Convites</h4>
                  <p className="text-sm text-gray-600 mt-1">Crie convites de fidelização para seus clientes</p>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-3">🔧</div>
                  <h4 className="font-semibold text-gray-900">Configurações</h4>
                  <p className="text-sm text-gray-600 mt-1">Gerencie sua conta e preferências</p>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'campaigns' && <CampaignsList />}
        {activeTab === 'settings' && <AccountSettings />}
        {activeTab === 'subscriptions' && <SubscriptionPlans />}
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

