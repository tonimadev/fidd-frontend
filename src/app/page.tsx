import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FIDD</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Cartões de Fidelidade Virtuais
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Aumentar a fidelidade de seus clientes nunca foi tão fácil. Gerenciar campanhas de pontos e recompensas de forma completa e segura.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Começar Agora
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h3 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Recursos Principais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Campanhas Inteligentes
            </h4>
            <p className="text-gray-600">
              Crie e gerencie campanhas de fidelização personalizadas com metas de pontos e recompensas.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Integração Mobile
            </h4>
            <p className="text-gray-600">
              Seus clientes acessam cartões de fidelidade virtuais pelo app mobile de forma simples e segura.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔐</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Segurança Garantida
            </h4>
            <p className="text-gray-600">
              Autenticação JWT, tokens seguros e conformidade total com padrões de segurança.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📈</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Análise em Tempo Real
            </h4>
            <p className="text-gray-600">
              Acompanhe métricas detalhadas de engajamento e conversão de suas campanhas.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              QR Codes Dinâmicos
            </h4>
            <p className="text-gray-600">
              Gere QR codes com tokens seguros para resgate rápido e verificação de pontos.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Rápido e Escalável
            </h4>
            <p className="text-gray-600">
              Infraestrutura robusta que cresce com seu negócio, desde pequenas lojas até redes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-8">
            Pronto para aumentar a fidelidade de seus clientes?
          </h3>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Criar Conta Gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-bold mb-4">FIDD</h5>
              <p className="text-sm">Cartões de Fidelidade Virtuais para seu negócio.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Produto</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Recursos</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Preços</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentação</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Empresa</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
                <li><Link href="/support" className="hover:text-white">Suporte</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white">Termos</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 FIDD. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
