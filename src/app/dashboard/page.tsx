/**
 * Página de dashboard (protegida)
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CampaignsList } from '@/components/campaigns/CampaignsList';
import { AccountSettings } from '@/components/account/AccountSettings';
import { DashboardMetricsCard } from '@/components/dashboard/DashboardMetricsCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { HelpCenter } from '@/components/dashboard/HelpCenter';

type DashboardTab = 'home' | 'campaigns' | 'settings' | 'subscriptions';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as DashboardTab;
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || 'home');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [initialHelpTutorialId, setInitialHelpTutorialId] = useState<string | null>(null);

  const openHelp = (tutorialId: string | null = null) => {
    setInitialHelpTutorialId(tutorialId);
    setIsHelpOpen(true);
  };

  // Sincronizar aba com parâmetro da URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as DashboardTab;
    const tab = tabFromUrl || 'home';
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const subscriptionStatus = searchParams.get('subscription');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    // Atualizar a URL para manter sincronizado e permitir navegação de volta/frente
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'home') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    // Sempre limpar o parâmetro de ação ao trocar de aba via menu
    params.delete('action');
    
    const query = params.toString();
    router.push(query ? `/dashboard?${query}` : '/dashboard');
  };

  const handleQuickActionCreate = () => {
    router.push('/dashboard?tab=campaigns&action=create');
    setActiveTab('campaigns');
  };

  const handleQuickActionInvitations = () => {
    router.push('/dashboard?tab=campaigns&action=invitations');
    setActiveTab('campaigns');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Visão geral do desempenho da sua fidelização.
              </p>
            </div>

            <DashboardMetricsCard />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>O que você deseja fazer agora?</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 items-start"
                    onClick={handleQuickActionCreate}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Nova Campanha</div>
                      <div className="text-xs text-muted-foreground font-normal">Crie um novo cartão</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 items-start"
                    onClick={handleQuickActionInvitations}
                  >
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Gerar Convites</div>
                      <div className="text-xs text-muted-foreground font-normal">Atraia novos clientes</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dica do FIDD</CardTitle>
                  <CardDescription>Como melhorar seu engajamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <p className="text-sm leading-relaxed italic text-foreground">
                      "Lojistas que oferecem um benefício intermediário após 5 selos têm uma taxa de retorno 40% maior do que os que oferecem apenas no final."
                    </p>
                  </div>
                  <Button 
                    variant="link" 
                    className="mt-4 p-0 h-auto text-primary"
                    onClick={() => openHelp()}
                  >
                    Ver mais dicas estratégicas →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'campaigns':
        return <CampaignsList onOpenHelp={openHelp} />;
      case 'settings':
        return <AccountSettings />;
      case 'subscriptions':
        return <SubscriptionPlans />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
        onHelpClick={() => setIsHelpOpen(true)}
      />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {subscriptionStatus === 'success' && (
            <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-3 shadow-sm">
              <div className="bg-emerald-500 text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Assinatura realizada!</p>
                <p className="text-sm">Seu plano Pro já está ativo. Aproveite todos os benefícios.</p>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      <HelpCenter 
        isOpen={isHelpOpen} 
        onClose={() => {
          setIsHelpOpen(false);
          setInitialHelpTutorialId(null);
        }} 
        activeTab={activeTab}
        initialTutorialId={initialHelpTutorialId}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}

