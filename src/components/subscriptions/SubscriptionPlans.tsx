/**
 * Componente para exibir planos de assinatura
 */

'use client';

import React, { useState } from 'react';
import { subscriptionService } from '@/lib/subscription-service';

export const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribePro = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usando window.location.origin para as URLs de retorno do Stripe
      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/dashboard?subscription=cancel`;
      
      const response = await subscriptionService.createCheckoutSession(successUrl, cancelUrl);
      
      // Redireciona para o checkout do Stripe
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
    <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Escolha seu plano</h3>
        <p className="text-gray-600">Planos flexíveis para qualquer tamanho de negócio</p>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plano Free */}
        <div className="border border-gray-200 rounded-2xl p-8 flex flex-col h-full bg-white hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900">Plano Gratuito</h4>
            <p className="text-gray-500 mt-2 text-sm">Ideal para pequenos comércios testarem</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-gray-900">R$ 0,00</span>
            <span className="text-gray-500 ml-1">/mês</span>
          </div>
          
          <ul className="space-y-4 mb-10 flex-grow text-sm">
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Até 50 cartões gerados por mês</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>1 campanha ativa por vez</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Dashboard básico de métricas</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <span className="font-bold">✗</span>
              <span>Personalização de QR Codes</span>
            </li>
          </ul>
          
          <button 
            disabled 
            className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-bold cursor-not-allowed"
          >
            Plano Atual
          </button>
        </div>

        {/* Plano Pro */}
        <div className="border-2 border-blue-600 rounded-2xl p-8 flex flex-col h-full relative overflow-hidden bg-white shadow-lg transform hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-5 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
            Recomendado
          </div>
          
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900">Plano Pro</h4>
            <p className="text-gray-500 mt-2 text-sm">Potencialize a fidelidade de seus clientes</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-gray-900">R$ 50,00</span>
            <span className="text-gray-500 ml-1">/mês</span>
          </div>
          
          <ul className="space-y-4 mb-10 flex-grow text-sm">
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Até 500 cartões gerados por mês</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Campanhas de fidelização ilimitadas</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Geração de QR Codes personalizados</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Métricas avançadas de engajamento</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              <span>Suporte prioritário via chat/email</span>
            </li>
          </ul>
          
          <button 
            onClick={handleSubscribePro}
            disabled={loading}
            className={`w-full py-4 px-4 rounded-lg font-bold text-white transition-all shadow-md ${
              loading 
              ? 'bg-blue-400 cursor-wait' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando checkout...
              </span>
            ) : 'Assinar Plano Pro'}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400">
        Pagamentos seguros processados pelo Stripe. Cancelamento fácil a qualquer momento.
      </p>
    </div>
  );
};
