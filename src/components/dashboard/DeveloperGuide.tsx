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
          <h4 className="font-bold text-gray-800">1. Autenticação</h4>
          <p className="text-sm text-gray-600">
            Todas as requisições devem incluir o header <code className="bg-gray-100 px-1 rounded text-red-600">X-API-KEY</code> com sua chave gerada em <strong>Configurações</strong>.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h4 className="font-bold text-gray-800">2. URL Base</h4>
          <div className="bg-gray-900 rounded-lg p-3">
            <code className="text-green-400 text-sm">https://api.fidd.tonima.digital/api/external/v1</code>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="font-bold text-gray-800 border-t pt-4">3. Endpoints Principais</h4>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">POST</span>
                <code className="text-gray-800 font-semibold">/punches</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Registra um novo ponto para o cliente.</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-700">
{`{
  "customerEmail": "cliente@email.com",
  "campaignId": 1
}`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">GET</span>
                <code className="text-gray-800 font-semibold">/campaigns</code>
              </div>
              <p className="text-sm text-gray-600">Lista campanhas ativas da sua loja.</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">GET</span>
                <code className="text-gray-800 font-semibold">/customers/{'{email}'}/cards</code>
              </div>
              <p className="text-sm text-gray-600">Consulta cartões e pontuação de um cliente.</p>
            </div>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t">
          <h4 className="font-bold text-gray-800 mb-4">Exemplo de Implementação (JavaScript)</h4>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs overflow-x-auto text-gray-300 leading-relaxed">
{`async function adicionarPonto(email, campanhaId) {
    const response = await fetch('https://fidd.com.br/api/external/v1/punches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'SUA_CHAVE_DE_API'
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
