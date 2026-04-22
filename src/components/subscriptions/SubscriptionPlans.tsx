/**
 * Componente para exibir planos de assinatura — Enhanced with Decoy Effect
 *
 * 🧠 Psychological Principle: Decoy Effect + Zero Risk Bias
 * The Decoy Effect: By positioning Lite as a clearly inferior option next to Pro,
 * users see Pro as the obvious "best value." The annual savings ("Economize R$120/ano")
 * frames the cost as loss avoidance. The 30-day guarantee eliminates perceived risk.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { subscriptionService } from '@/lib/subscription-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getStripePlans, StripePlan } from '@/lib/stripe-actions';
import { redirectToCheckout } from '@/lib/navigation';
import { analyticsService } from '@/lib/analytics';
import { motion } from 'framer-motion';
import { Crown, Shield, Check, Sparkles, Star } from 'lucide-react';

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getStripePlans();
        if (data && data.length > 0) {
          // Ordenar por preço
          const sortedPlans = [...data].sort((a, b) => a.amount - b.amount);
          setPlans(sortedPlans);
          // Log viewing first plan or most relevant one
          if (sortedPlans.length > 0) {
            analyticsService.track('subscription_plan_viewed', { plan_id: sortedPlans[0].id });
          }
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
                'Até 20 cartões gerados /mês',
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
                'Até 100 cartões gerados /mês',
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

      analyticsService.track('subscription_checkout_started', {
        plan_id: plan.id,
        interval: plan.interval === 'year' ? 'yearly' : 'monthly'
      });
      
      if (response && response.url) {
              // Sai o window.location.href, entra o nosso wrapper
              redirectToCheckout(response.url);
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
    if (!user?.plan) return planId === 'fidd_price_free';

    const userPlan = user.plan.toUpperCase();
    
    // Suporte para nomes variados do plano PRO
    if (userPlan.includes('PRO')) return planId === 'fidd_price_pro';
    if (userPlan.includes('LITE')) return planId === 'fidd_price_lite';
    
    return planId === 'fidd_price_free';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <motion.h2 
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Planos de Assinatura
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-lg mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Escolha o plano ideal para o tamanho do seu negócio.
        </motion.p>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 p-1 bg-muted rounded-xl border border-border"
        >
          <button
            onClick={() => setBillingPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              billingPeriod === 'month'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('year')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
              billingPeriod === 'year'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
              -20%
            </span>
          </button>
        </motion.div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20 text-sm font-medium">
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
          {plans.map((plan, index) => {
            const isPro = plan.id === 'fidd_price_pro';
            const isActive = isCurrentPlan(plan.id);
            const displayAmount = billingPeriod === 'year' ? plan.amount * 0.8 : plan.amount;
            const annualSavings = plan.amount * 12 * 0.2;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.15 }}
              >
                <Card 
                  className={`flex flex-col relative overflow-hidden transition-all ${
                    isPro 
                      ? 'border-2 border-amber-400 shadow-xl scale-105 z-10 border-pro-shimmer' 
                      : 'group hover:border-muted-foreground/20'
                  } ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  {isPro && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" />
                      Mais Popular
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-br-xl z-10">
                      Atual
                    </div>
                  )}
                  
                  <CardHeader className="pb-8">
                    <div className="flex items-center gap-2">
                      {isPro && <Crown className="w-5 h-5 text-amber-500" />}
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className={`mt-4 flex items-baseline ${isPro ? 'text-amber-600' : ''}`}>
                      <span className="text-4xl font-black text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: plan.currency }).format(displayAmount)}
                      </span>
                      <span className="text-muted-foreground ml-1">/{billingPeriod === 'month' ? 'mês' : 'mês'}</span>
                    </div>
                    {billingPeriod === 'year' && plan.amount > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm line-through text-muted-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: plan.currency }).format(plan.amount)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          Economize {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: plan.currency }).format(annualSavings)}/ano
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <ul className="space-y-3 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className={`w-4 h-4 shrink-0 ${isPro ? 'text-amber-500' : 'text-primary'}`} />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                      {/* Show what's missing on Free plan (Loss Visualization) */}
                      {plan.id === 'fidd_price_free' && (
                        <>
                          <li className="flex items-center gap-3 opacity-40">
                            <span className="w-4 h-4 shrink-0 text-red-400 flex items-center justify-center text-xs">✕</span>
                            <span className="line-through">Insights & Métricas PRO</span>
                          </li>
                          <li className="flex items-center gap-3 opacity-40">
                            <span className="w-4 h-4 shrink-0 text-red-400 flex items-center justify-center text-xs">✕</span>
                            <span className="line-through">Automação de Marketing</span>
                          </li>
                          <li className="flex items-center gap-3 opacity-40">
                            <span className="w-4 h-4 shrink-0 text-red-400 flex items-center justify-center text-xs">✕</span>
                            <span className="line-through">Motor de Indicações</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    {isActive ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Plano Atual
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${
                          isPro 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30 font-bold'
                            : plan.amount === 0 
                              ? '' 
                              : 'shadow-lg shadow-primary/20'
                        }`}
                        onClick={() => handleSubscribe(plan)}
                        isLoading={loading === plan.id}
                        variant={plan.amount === 0 ? 'outline' : 'primary'}
                      >
                        {isPro && <Sparkles className="w-4 h-4 mr-1" />}
                        {plan.amount === 0 ? 'Migrar para Gratuito' : `Assinar ${plan.name}`}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trust badges */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Garantia de 30 dias
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Pagamentos seguros via Stripe
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Cancele quando quiser
          </span>
        </div>
      </div>
    </div>
  );
};
