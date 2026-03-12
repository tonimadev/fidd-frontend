/**
 * Componente para exibir planos de assinatura
 */

'use client';

import React, { useState, useEffect } from 'react';
import { subscriptionService } from '@/lib/subscription-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getStripePlans, StripePlan } from '@/lib/stripe-actions';

export const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<StripePlan[]>([]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getStripePlans();
        if (data && data.length > 0) {
          // Ordenar para garantir que o Lite venha antes do Pro
          const sortedPlans = [...data].sort((a, b) => a.amount - b.amount);
          setPlans(sortedPlans);
        } else {
          // Fallback se não houver planos (ex: chave não configurada)
          setPlans([
            {
              id: 'fidd_price_lite',
              name: 'Plano Gratuito',
              description: 'Ideal para pequenos comércios testarem',
              amount: 0,
              currency: 'brl',
              interval: 'month',
              features: [
                'Até 50 cartões gerados /mês',
                '1 campanha ativa por vez',
                'Dashboard básico de métricas'
              ]
            },
            {
              id: 'fidd_price_pro',
              name: 'Plano Pro',
              description: 'Potencialize a fidelidade de seus clientes',
              amount: 50,
              currency: 'brl',
              interval: 'month',
              features: [
                'Até 500 cartões gerados /mês',
                'Campanhas ilimitadas',
                'Geração de QR Codes personalizados',
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

  const handleSubscribePro = async () => {
    setLoading(true);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/dashboard?subscription=cancel`;
      
      const response = await subscriptionService.createCheckoutSession(successUrl, cancelUrl);
      
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('URL de checkout não recebida do servidor.');
      }
    } catch (err) {
      setError('Erro ao criar sessão de checkout. Tente novamente mais tarde.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planos de Assinatura</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Escolha o plano ideal para o tamanho do seu negócio e comece a fidelizar seus clientes hoje mesmo.
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
          <p className="text-muted-foreground animate-pulse">Carregando planos da Stripe...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const isPro = plan.id === 'fidd_price_pro';
            const isFree = plan.amount === 0;

            return (
              <Card 
                key={plan.id}
                className={`flex flex-col relative overflow-hidden transition-all ${
                  isPro 
                    ? 'border-primary shadow-xl scale-105 z-10' 
                    : 'group hover:border-muted-foreground/20'
                }`}
              >
                {isPro && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                    Popular
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
                  {isFree ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Plano Atual
                    </Button>
                  ) : (
                    <Button 
                      className="w-full shadow-lg shadow-primary/20" 
                      onClick={handleSubscribePro}
                      isLoading={loading}
                    >
                      Assinar {plan.name}
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
