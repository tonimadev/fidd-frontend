import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FIDD",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  },
  "description": "Plataforma de gerenciamento de campanhas de fidelização para lojas e estabelecimentos comerciais."
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/fidd.png" alt="FIDD Logo" width={32} height={32} className="dark:brightness-110" />
            <span className="text-2xl font-bold text-primary">FIDD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-foreground hover:text-primary font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Cartões de Fidelidade Virtuais
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aumentar a fidelidade de seus clientes nunca foi tão fácil. Gerenciar campanhas de pontos e recompensas de forma completa e segura.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            >
              Começar Agora
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-lg"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">
          Recursos Principais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Análise">📊</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Campanhas Inteligentes
            </h3>
            <p className="text-muted-foreground">
              Crie e gerencie campanhas de fidelização personalizadas com metas de pontos e recompensas.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Celular">📱</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Integração Mobile
            </h3>
              <p className="text-muted-foreground">
                Seus clientes acessam cartões de fidelidade virtuais pelo app mobile de forma simples e segura.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a 
                  href="https://play.google.com/store/apps/details?id=digital.tonima.fidd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.1-.12c-.106-.153-.16-.33-.16-.51V2.445c0-.18.054-.357.16-.51.03-.045.064-.085.1-.121zM14.735 12.943l2.844-2.844 3.764 2.14a1 1 0 0 1 0 1.74l-3.764 2.14-2.844-3.176zm-1.886-1.886L3.92 2.114 13.56 11.75l-.711.307zM3.92 21.886l8.929-8.929.711.307-9.64 9.64a.978.978 0 0 1-.225-.11z" />
                  </svg>
                  Google Play
                </a>
                <Link 
                  href="/app"
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-md shadow-primary/20"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Acessar via Web
                </Link>
                <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-1.99.77-3.26.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.89 1.22-2.11 1.09-3.33-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2.03-1.1 3.22 1.16.09 2.33-.56 3.06-1.45z" />
                  </svg>
                  App Store (Breve)
                </div>
              </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Segurança">🔐</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Segurança Garantida
            </h3>
            <p className="text-muted-foreground">
              Autenticação JWT, tokens seguros e conformidade total com padrões de segurança.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Crescimento">📈</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Análise em Tempo Real
            </h3>
            <p className="text-muted-foreground">
              Acompanhe métricas detalhadas de engajamento e conversão de suas campanhas.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Alvo">🎯</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              QR Codes Dinâmicos
            </h3>
            <p className="text-muted-foreground">
              Gere QR codes com tokens seguros para resgate rápido e verificação de pontos.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4" role="img" aria-label="Velocidade">⚡</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Rápido e Escalável
            </h3>
            <p className="text-muted-foreground">
              Infraestrutura robusta que cresce com seu negócio, desde pequenas lojas até redes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Pronto para aumentar a fidelidade de seus clientes?
          </h2>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-card text-primary rounded-lg hover:bg-muted transition-colors font-bold text-lg shadow-xl"
          >
            Criar Conta Gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/fidd.png" alt="FIDD Logo" width={24} height={24} />
                <h5 className="text-white font-bold">FIDD</h5>
              </div>
              <p className="text-sm mb-4">Cartões de Fidelidade Virtuais para seu negócio.</p>
              <div className="space-y-2">
                <a 
                  href="https://play.google.com/store/apps/details?id=digital.tonima.fidd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium w-fit border border-slate-800"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.1-.12c-.106-.153-.16-.33-.16-.51V2.445c0-.18.054-.357.16-.51.03-.045.064-.085.1-.121zM14.735 12.943l2.844-2.844 3.764 2.14a1 1 0 0 1 0 1.74l-3.764 2.14-2.844-3.176zm-1.886-1.886L3.92 2.114 13.56 11.75l-.711.307zM3.92 21.886l8.929-8.929.711.307-9.64 9.64a.978.978 0 0 1-.225-.11z" />
                  </svg>
                  Google Play
                </a>
                <div className="flex items-center gap-2 bg-slate-950 text-slate-600 px-3 py-2 rounded-lg text-xs font-medium w-fit border border-slate-900 cursor-not-allowed">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-1.99.77-3.26.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.89 1.22-2.11 1.09-3.33-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2.03-1.1 3.22 1.16.09 2.33-.56 3.06-1.45z" />
                  </svg>
                  App Store (Breve)
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Produto</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Recursos</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentação</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Empresa</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:suporte@fidd.com.br" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="mailto:suporte@fidd.com.br" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos</Link></li>
                <li><a href="https://tonima.digital/fidd-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 FIDD. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
