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
import Image from 'next/image';
import { SubscriptionPlans } from '@/components/subscriptions/SubscriptionPlans';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { HelpCenter } from '@/components/dashboard/HelpCenter';
import { RedemptionForm } from '@/components/dashboard/RedemptionForm';
import { CustomersList } from '@/components/dashboard/CustomersList';
import { DashboardTab } from '@/types/dashboard';


function DashboardContent() {
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as DashboardTab;
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || 'home');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    setIsSidebarOpen(false); // Fecha o sidebar ao trocar de aba no mobile
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

  const handleQuickActionRedeem = () => {
    router.push('/dashboard?tab=redemptions');
    setActiveTab('redemptions');
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
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 items-start border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                    onClick={handleQuickActionRedeem}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Resgatar Prêmio</div>
                      <div className="text-xs text-muted-foreground font-normal">Valide um código</div>
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
                      &quot;Lojistas que oferecem um benefício intermediário após 5 selos têm uma taxa de retorno 40% maior do que os que oferecem apenas no final.&quot;
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
      case 'customers':
        return <CustomersList />;
      case 'redemptions':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Resgate de Prêmios</h2>
              <p className="text-muted-foreground">
                Valide os códigos de resgate apresentados pelos seus clientes.
              </p>
            </div>
            <RedemptionForm />
          </div>
        );
      case 'settings':
        return <AccountSettings />;
      case 'subscriptions':
        return <SubscriptionPlans />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
        onHelpClick={() => {
          setIsHelpOpen(true);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay para mobile quando o sidebar está aberto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center h-16 px-4 border-b border-border bg-white sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 ml-4">
            <Image src="/fidd.png" alt="FIDD Logo" width={24} height={24} />
            <span className="text-xl font-black tracking-tighter text-primary">FIDD</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
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
    </div>

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

