/**
 * Componente para exibir planos de assinatura
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { subscriptionService } from '@/lib/subscription-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getStripePlans, StripePlan } from '@/lib/stripe-actions';

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<StripePlan[]>([]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getStripePlans();
        if (data && data.length > 0) {
          // Ordenar por preço
          const sortedPlans = [...data].sort((a, b) => a.amount - b.amount);
          setPlans(sortedPlans);
        } else {
          // Fallback se não houver planos vindos da API
          setPlans([
            {
              id: 'fidd_price_free',
              name: 'Plano Gratuito',
              description: 'Para quem está começando',
              amount: 0,
              currency: 'brl',
              interval: 'month',
              features: [
                'Até 50 cartões gerados /mês',
                '1 campanha ativa por vez',
                'Dashboard básico'
              ]
            },
            {
              id: 'fidd_price_lite',
              name: 'Plano Lite',
              description: 'Ideal para pequenos comércios',
              amount: 25,
              currency: 'brl',
              interval: 'month',
              features: [
                'Até 250 cartões gerados /mês',
                '3 campanhas ativas',
                'Suporte por email'
              ]
            },
            {
              id: 'fidd_price_pro',
              name: 'Plano Pro',
              description: 'Potencialize seu negócio',
              amount: 50,
              currency: 'brl',
              interval: 'month',
              features: [
                'Até 500 cartões gerados /mês',
                'Campanhas ilimitadas',
                'QR Codes personalizados',
                'Métricas avançadas',
                'Suporte prioritário 24/7'
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
      } finally {
        setFetchingPlans(false);
      }
    }
    loadPlans();
  }, []);

  const handleSubscribe = async (plan: StripePlan) => {
    setLoading(plan.id);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/dashboard?tab=subscriptions&subscription=success`;
      const cancelUrl = `${window.location.origin}/dashboard?tab=subscriptions&subscription=cancel`;
      
      // Mapeamento de IDs para nomes que o backend espera
      let planName = 'FREE';
      if (plan.id === 'fidd_price_pro') planName = 'PRO';
      else if (plan.id === 'fidd_price_lite') planName = 'LITE';

      const response = await subscriptionService.createCheckoutSession(
        planName,
        successUrl,
        cancelUrl
      );
      
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('URL de checkout não recebida do servidor.');
      }
    } catch (err) {
      setError('Erro ao criar sessão de checkout. Tente novamente mais tarde.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (!user?.plan) return planId === 'fidd_price_free'; // Default para FREE se não informado

    const userPlan = user.plan.toUpperCase();
    if (userPlan === 'PRO') return planId === 'fidd_price_pro';
    if (userPlan === 'LITE') return planId === 'fidd_price_lite';
    return planId === 'fidd_price_free';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planos de Assinatura</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Escolha o plano ideal para o tamanho do seu negócio.
        </p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {fetchingPlans ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Carregando planos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isPro = plan.id === 'fidd_price_pro';
            const isActive = isCurrentPlan(plan.id);

            return (
              <Card 
                key={plan.id}
                className={`flex flex-col relative overflow-hidden transition-all ${
                  isPro 
                    ? 'border-primary shadow-xl scale-105 z-10' 
                    : 'group hover:border-muted-foreground/20'
                } ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                {isPro && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                    Popular
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-br-xl">
                    Atual
                  </div>
                )}
                
                <CardHeader className="pb-8">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className={`mt-4 flex items-baseline ${isPro ? 'text-primary' : ''}`}>
                    <span className="text-4xl font-black text-foreground">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: plan.currency }).format(plan.amount)}
                    </span>
                    <span className="text-muted-foreground ml-1">/{plan.interval === 'month' ? 'mês' : plan.interval}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  {isActive ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Plano Atual
                    </Button>
                  ) : (
                    <Button 
                      className="w-full shadow-lg shadow-primary/20" 
                      onClick={() => handleSubscribe(plan)}
                      isLoading={loading === plan.id}
                      variant={plan.amount === 0 ? 'outline' : 'default'}
                    >
                      {plan.amount === 0 ? 'Migrar para Gratuito' : `Assinar ${plan.name}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <p className="text-center text-xs text-muted-foreground pt-4 flex items-center justify-center gap-2">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Pagamentos seguros via Stripe. Cancele quando quiser.
      </p>
    </div>
  );
};
