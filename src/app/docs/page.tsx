import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/fidd.png" alt="FIDD Logo" width={32} height={32} className="dark:brightness-110" />
            <span className="text-2xl font-bold text-primary">FIDD</span>
          </Link>
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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Documentação e Guia de Uso</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-12 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introdução ao FIDD</h2>
              <p>O FIDD é uma plataforma completa de cartões de fidelidade virtuais que ajuda o seu negócio a reter clientes e aumentar o faturamento através de recompensas e campanhas inteligentes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Como Criar uma Campanha de Fidelidade</h2>
              <p>Configure sua primeira campanha para recompensar seus clientes frequentes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acesse o menu <strong>&apos;Campanhas&apos;</strong> no painel lateral.</li>
                <li>Clique no botão <strong>&apos;Nova Campanha&apos;</strong> no canto superior direito.</li>
                <li>Defina um nome atrativo (ex: &apos;Café Grátis após 10 compras&apos;).</li>
                <li>Defina a quantidade de pontos necessários para completar a cartela.</li>
                <li>Escolha uma data de validade para a campanha.</li>
                <li>Clique em <strong>&apos;Salvar&apos;</strong> para ativar a campanha imediatamente.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Como Pontuar Clientes no Balcão</h2>
              <p>Gere códigos QR dinâmicos que seus clientes podem escanear com o celular no momento da compra:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Selecione uma campanha ativa no seu <strong>Dashboard</strong>.</li>
                <li>Clique no ícone de <strong>&apos;QR Code&apos;</strong> ou no botão <strong>&apos;Gerar QR Code de Balcão&apos;</strong>.</li>
                <li>Um código QR será exibido na tela por 60 segundos por segurança.</li>
                <li>Peça ao cliente para abrir o <strong>App FIDD</strong> e escanear o código.</li>
                <li>A pontuação é automática e segura após o escaneamento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Inovação: Uso do NFC</h2>
              <p>O FIDD utiliza a tecnologia NFC (Near Field Communication) para tornar a experiência ainda mais fluida:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-bold text-primary mb-2">Emissão por Aproximação</h3>
                  <p className="text-sm">Em vez de QR Code, você pode simplesmente encostar o celular do cliente no seu tablet ou celular para entregar os selos.</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-bold text-primary mb-2">Resgate por Toque</h3>
                  <p className="text-sm">Para trocar prêmios, o cliente aproxima o celular e o resgate é validado instantaneamente sem digitação de códigos.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Como Gerar Convites e Atrair Novos Clientes</h2>
              <p>Crie códigos de 6 caracteres para distribuir em redes sociais ou WhatsApp:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No menu <strong>&apos;Convites&apos;</strong>, selecione a campanha desejada.</li>
                <li>Defina quantos convites deseja gerar e quantos pontos de boas-vindas o cliente ganhará.</li>
                <li>Clique em <strong>&apos;Gerar Convites&apos;</strong>.</li>
                <li>Copie os códigos gerados ou as URLs de resgate e compartilhe com seus clientes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Análise de Resultados</h2>
              <p>No Dashboard principal, você pode acompanhar o desempenho do seu programa:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Total de cartelas emitidas e completadas.</li>
                <li>Faturamento gerado através das campanhas.</li>
                <li>Ranking dos clientes mais fiéis da sua loja.</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-border text-sm italic text-center">
              Ainda com dúvidas? Entre em contato com o suporte através de <a href="mailto:suporte@fidd.com.br" className="text-primary hover:underline">suporte@fidd.com.br</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 FIDD. Todos os direitos reservados.</p>
          <div className="mt-4 space-x-4 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Voltar para Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
