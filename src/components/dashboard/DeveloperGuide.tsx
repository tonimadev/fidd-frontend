/**
 * Componente com guia de integração para desenvolvedores
 */

'use client';

import React from 'react';

export const DeveloperGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Guia para Desenvolvedores</h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">API de Integração Externa</h3>
        
        <p className="text-gray-600 mb-6">
          Integre o FIDD com seu PDV, E-commerce ou CRM utilizando nossa API RESTful.
        </p>

        <section className="space-y-4 mb-8">
          <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">1. Autenticação</h4>
          <p className="text-sm text-gray-600">
            Todas as requisições para a API externa devem incluir o header <code className="bg-gray-100 px-1 rounded text-red-600 font-semibold">X-API-KEY</code> com a chave gerada no painel do lojista.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-blue-700">
            <strong>Importante:</strong> As novas chaves geradas seguem o padrão <code className="bg-blue-100 px-1 rounded">fidd_</code> seguido de uma sequência segura (ex: <code className="bg-blue-100 px-1 rounded text-gray-700">fidd_aB1...</code>). Chaves antigas em formato UUID continuam válidas até serem revogadas.
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">2. URL Base</h4>
          <div className="bg-gray-900 rounded-lg p-3">
            <code className="text-green-400 text-sm">https://api.fidd.com.br/api/external/v1</code>
          </div>
        </section>

        <section className="space-y-6 mb-8">
          <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-t pt-4">3. Endpoints Disponíveis</h4>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">GET</span>
                <code className="text-gray-800 font-semibold">/campaigns</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Retorna as campanhas de fidelidade da loja que estão dentro do prazo de validade.</p>
              <pre className="bg-gray-50 p-3 rounded text-[10px] overflow-x-auto text-gray-700">
{`[
  {
    "id": 1,
    "name": "Café Fidelidade",
    "pointsRequired": 10,
    "expirationDate": "2026-12-31",
    "isActive": true,
    "description": "Ganhe 1 ponto a cada café..."
  }
]`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">GET</span>
                <code className="text-gray-800 font-semibold">/customers/{'{email}'}/cards</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Busca todos os cartões (em progresso ou concluídos) de um cliente na sua loja.</p>
              <pre className="bg-gray-50 p-3 rounded text-[10px] overflow-x-auto text-gray-700">
{`[
  {
    "cardId": 500,
    "campaignName": "Café Fidelidade",
    "currentPoints": 5,
    "pointsRequired": 10,
    "status": "IN_PROGRESS",
    "updatedAt": "2026-03-10T11:00:00"
  }
]`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">POST</span>
                <code className="text-gray-800 font-semibold">/punches</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Adiciona 1 ponto ao cartão do cliente em uma campanha específica.</p>
              <pre className="bg-gray-50 p-3 rounded text-[10px] overflow-x-auto text-gray-700">
{`{
  "customerEmail": "cliente@email.com",
  "campaignId": 1
}`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">POST</span>
                <code className="text-gray-800 font-semibold">/redemptions</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Valida um código de resgate e marca o prêmio como entregue.</p>
              <pre className="bg-gray-50 p-3 rounded text-[10px] overflow-x-auto text-gray-700">
{`{
  "code": "ABC123"
}`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">GET</span>
                <code className="text-gray-800 font-semibold">/metrics</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Retorna métricas simplificadas de engajamento e limites da loja.</p>
              <pre className="bg-gray-50 p-3 rounded text-[10px] overflow-x-auto text-gray-700">
{`{
  "activeCampaigns": 2,
  "totalCustomers": 150,
  "pointsDistributed": 1250,
  "engagementRate": 15.5,
  "monthlyLimit": 500,
  "availableCards": 350
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-t pt-4">4. Tratamento de Erros</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded border border-red-100">
              <span className="text-xs font-bold text-red-700 block">401 Unauthorized</span>
              <p className="text-[10px] text-red-600">Chave de API ausente ou inválida.</p>
            </div>
            <div className="bg-orange-50 p-3 rounded border border-orange-100">
              <span className="text-xs font-bold text-orange-700 block">400 Bad Request</span>
              <p className="text-[10px] text-orange-600">Código de resgate já utilizado ou expirado.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <span className="text-xs font-bold text-gray-700 block">404 Not Found</span>
              <p className="text-[10px] text-gray-600">Cliente ou campanha não encontrados.</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <span className="text-xs font-bold text-yellow-700 block">429 Too Many Requests</span>
              <p className="text-[10px] text-yellow-600">Limite de taxa (rate limit) atingido.</p>
            </div>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t">
          <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Exemplo de Implementação (JavaScript)</h4>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs overflow-x-auto text-gray-300 leading-relaxed">
{`async function adicionarPonto(email, campanhaId) {
    const response = await fetch('https://api.fidd.com.br/api/external/v1/punches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'fidd_sua_chave_aqui'
        },
        body: JSON.stringify({
            customerEmail: email,
            campaignId: campanhaId
        })
    });
    return await response.json();
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
