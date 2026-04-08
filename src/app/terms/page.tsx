import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Termos de Uso</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground">1. Aceitação dos Termos</h2>
              <p>Ao utilizar a plataforma FIDD, você concorda em cumprir e ser regido por estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">2. Deveres e Direitos do Usuário</h2>
              <h3 className="text-xl font-semibold text-foreground mt-4">Direitos:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acessar e utilizar as ferramentas de gerenciamento de fidelidade oferecidas pela plataforma.</li>
                <li>Criar e administrar campanhas de pontos e recompensas para seus clientes.</li>
                <li>Solicitar suporte técnico através dos canais oficiais.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mt-4">Deveres:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações verdadeiras e precisas durante o cadastro e uso da plataforma.</li>
                <li>Zelar pela segurança e confidencialidade de suas credenciais de acesso.</li>
                <li>Cumprir todas as leis e regulamentos locais e nacionais aplicáveis.</li>
                <li>Honrar as recompensas e benefícios prometidos aos seus clientes através das campanhas criadas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">3. Restrições e Proibições</h2>
              <p>É estritamente proibido o uso da plataforma FIDD para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="font-semibold text-red-500">Criar, gerenciar ou promover campanhas envolvendo itens ilegais, substâncias controladas, armas, ou qualquer produto/serviço que viole a legislação brasileira vigente.</li>
                <li>Praticar atividades fraudulentas ou enganosas contra clientes ou contra a própria plataforma.</li>
                <li>Tentar burlar os sistemas de segurança ou interferir no funcionamento técnico do serviço.</li>
                <li>Enviar comunicações não solicitadas (spam) utilizando os dados obtidos através da plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">4. Suporte</h2>
              <p>Para dúvidas, reclamações ou suporte técnico, entre em contato através do e-mail: <a href="mailto:suporte@fidd.com.br" className="text-primary hover:underline">suporte@fidd.com.br</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">5. Alterações</h2>
              <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após sua publicação na plataforma.</p>
            </section>

            <div className="pt-8 border-t border-border text-sm italic">
              Última atualização: 07 de abril de 2026
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
