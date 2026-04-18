'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoiSimulator } from '@/components/RoiSimulator';
import { AppScreenshotsCarousel } from '@/components/AppScreenshotsCarousel';

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
  "description": "Plataforma de gerenciamento de clube de selos para lojas e estabelecimentos comerciais."
};

export default function HomePage() {
  const [userType, setUserType] = useState<'merchant' | 'customer'>('merchant');

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
              href={userType === 'merchant' ? "/login" : "/app/login"}
              className="px-4 py-2 text-foreground hover:text-primary font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href={userType === 'merchant' ? "/register" : "/app/register"}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
            >
              {userType === 'merchant' ? 'Criar Conta Lojista' : 'Criar Conta Cliente'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* User Type Toggle */}
          <div className="inline-flex p-1 bg-muted rounded-xl mb-12 shadow-inner border border-border">
            <button
              onClick={() => setUserType('merchant')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                userType === 'merchant'
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sou Lojista
            </button>
            <button
              onClick={() => setUserType('customer')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                userType === 'customer'
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sou Cliente
            </button>
          </div>

          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            {userType === 'merchant' ? (
              <>Transforme Clientes em Fãs com seu <span className="text-primary">Clube de Selos</span></>
            ) : (
              <>Ganhe Prêmios e Benefícios Exclusivos em <span className="text-primary">suas lojas favoritas</span></>
            )}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {userType === 'merchant' 
              ? 'Aumente seu faturamento em até 30% com um Clube de Selos digital que seus clientes realmente amam usar.'
              : 'Acumule selos, acompanhe seus cartões e resgate prêmios de forma simples e 100% digital. Sem papel, sem complicação.'
            }
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={userType === 'merchant' ? "/register" : "/app"}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-semibold text-lg shadow-lg shadow-primary/20"
            >
              {userType === 'merchant' ? 'Começar Grátis Agora' : 'Quero Meus Prêmios'}
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-all font-semibold text-lg"
            >
              Ver Como Funciona
            </Link>
          </div>

          {/* Social Proof Banner */}
          <div className="mt-20 pt-10 border-t border-border/50">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
              Mais de <span className="text-primary">100 lojas</span> e milhares de clientes já confiam no FIDD
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl italic text-slate-400">Café <span className="text-slate-500">Express</span></div>
              <div className="flex items-center gap-2 font-bold text-xl italic text-slate-400">Burger <span className="text-slate-500">House</span></div>
              <div className="flex items-center gap-2 font-bold text-xl italic text-slate-400">Estilo <span className="text-slate-500">Moda</span></div>
              <div className="flex items-center gap-2 font-bold text-xl italic text-slate-400">Pet <span className="text-slate-500">Love</span></div>
              <div className="flex items-center gap-2 font-bold text-xl italic text-slate-400">Academia <span className="text-slate-500">FIT</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa para <span className="text-primary">crescer</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa para criar, gerenciar e escalar seu Clube de Selos sem complicações técnicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Análise">📈</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Recorrência Garantida
            </h3>
            <p className="text-muted-foreground">
              Clientes fiéis compram até 67% mais. Crie motivos reais para eles voltarem sempre à sua loja.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Celular">📱</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Seu App Próprio
            </h3>
              <p className="text-muted-foreground">
                Sua marca no bolso do cliente. Interface moderna e intuitiva que substitui os antigos cartões de papel.
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
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Segurança">🔐</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Segurança de Elite
            </h3>
            <p className="text-muted-foreground">
              Proteção total de dados e transações. Fique tranquilo com nossa infraestrutura robusta e segura.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Crescimento">💎</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              ROI Comprovado
            </h3>
            <p className="text-muted-foreground">
              Nossa calculadora mostra exatamente o quanto você deixa de ganhar sem um Clube de Selos.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Tecnologia">⚡</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              NFC & QR Code
            </h3>
            <p className="text-muted-foreground">
              Pontue clientes em segundos via aproximação (NFC) ou leitura de QR Code. Modernidade e agilidade no seu balcão.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4" role="img" aria-label="Suporte">🎧</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Suporte Prioritário
            </h3>
            <p className="text-muted-foreground">
              Não está sozinho. Nossa equipe de especialistas está pronta para ajudar seu negócio a decolar.
            </p>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="bg-muted/30 py-24 border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              O <span className="text-primary">App</span> na sua Mão
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leve seus cartões de selos para qualquer lugar. Interface intuitiva, rápida e segura para seus clientes.
            </p>
          </div>

          <AppScreenshotsCarousel />
        </div>
      </section>

      {/* ROI Simulator Section */}
      {userType === 'merchant' && (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Simule seu <span className="text-primary">Lucro</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Veja na prática como um clube de selos bem estruturado pode aumentar seu faturamento sem comprometer sua margem.
              </p>
            </div>
            <RoiSimulator />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {userType === 'merchant' 
              ? 'Pare de perder clientes para a concorrência'
              : 'Comece a ser recompensado pelos seus selos'
            }
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {userType === 'merchant'
              ? 'Junte-se a centenas de empresas que já modernizaram seu programa de selos.'
              : 'Baixe o app e descubra um mundo de vantagens nas suas lojas favoritas.'
            }
          </p>
          <Link
            href={userType === 'merchant' ? "/register" : "/app"}
            className="inline-block px-10 py-4 bg-white text-primary rounded-lg hover:bg-muted transition-all hover:scale-105 font-bold text-xl shadow-2xl"
          >
            {userType === 'merchant' ? 'Criar Meu Clube Grátis' : 'Começar a Ganhar Agora'}
          </Link>
          {userType === 'merchant' && (
            <p className="mt-6 text-white/80 text-sm">
              Não requer cartão de crédito • Setup em 2 minutos
            </p>
          )}
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
              <p className="text-sm mb-4">Cartões de Selos Virtuais para todos.</p>
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
              <h5 className="text-white font-bold mb-4">Acesso</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/app" className="hover:text-white transition-colors">Área do Cliente (Web)</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Painel do Lojista</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Criar Conta Lojista</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Suporte</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><a href="mailto:suporte@fidd.com.br" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="mailto:suporte@fidd.com.br" className="hover:text-white transition-colors">Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
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
