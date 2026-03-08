/**
 * Componente para exibir planos de assinatura
 */

'use client';

import React, { useState } from 'react';
import { subscriptionService } from '@/lib/subscription-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plano Free */}
        <Card className="flex flex-col relative overflow-hidden group hover:border-muted-foreground/20 transition-all">
          <CardHeader className="pb-8">
            <CardTitle>Plano Gratuito</CardTitle>
            <CardDescription>Ideal para pequenos comércios testarem</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-black">R$ 0</span>
              <span className="text-muted-foreground ml-1">/mês</span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              {[
                { text: 'Até 50 cartões gerados /mês', check: true },
                { text: '1 campanha ativa por vez', check: true },
                { text: 'Dashboard básico de métricas', check: true },
                { text: 'Personalização de QR Codes', check: false },
              ].map((item, i) => (
                <li key={i} className={`flex items-center gap-3 ${item.check ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
                  {item.check ? (
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {item.text}
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button variant="secondary" className="w-full" disabled>
              Plano Atual
            </Button>
          </CardFooter>
        </Card>

        {/* Plano Pro */}
        <Card className="flex flex-col relative overflow-hidden border-primary shadow-xl scale-105 z-10">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
            Popular
          </div>
          
          <CardHeader className="pb-8">
            <CardTitle>Plano Pro</CardTitle>
            <CardDescription>Potencialize a fidelidade de seus clientes</CardDescription>
            <div className="mt-4 flex items-baseline text-primary">
              <span className="text-4xl font-black text-foreground">R$ 50</span>
              <span className="text-muted-foreground ml-1">/mês</span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              {[
                'Até 500 cartões gerados /mês',
                'Campanhas ilimitadas',
                'Geração de QR Codes personalizados',
                'Métricas avançadas',
                'Suporte prioritário 24/7',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {text}
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full shadow-lg shadow-primary/20" 
              onClick={handleSubscribePro}
              isLoading={loading}
            >
              Assinar Plano Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <p className="text-center text-xs text-muted-foreground pt-4 flex items-center justify-center gap-2">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Pagamentos seguros via Stripe. Cancele quando quiser.
      </p>
    </div>
  );
};
