/**
 * Layout base para a área do cliente (mobile web)
 */

'use client';

import React from 'react';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Home, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RedeemInviteModal } from '@/components/mobile/RedeemInviteModal';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = 'FIDD' }) => {
  const { logout, isAuthenticated, isLoading } = useMobileAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedeemModalOpen, setIsRedeemModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/app/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Image src="/fidd.png" alt="FIDD" width={32} height={32} className="dark:brightness-110" />
            <h1 className="text-xl font-black tracking-tighter text-primary uppercase">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => logout()}
              className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-lg mx-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/40 px-6 py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <Link 
            href="/app" 
            className={`flex flex-col items-center gap-1 ${pathname === '/app' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home size={22} className={pathname === '/app' ? 'fill-primary/10' : ''} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
          </Link>
          
          <Link 
            href="/app#stores" 
            className={`flex flex-col items-center gap-1 ${pathname === '/app#stores' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <MapPin size={22} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Lojas</span>
          </Link>

          <div className="-mt-12">
            <button 
              onClick={() => setIsRedeemModalOpen(true)}
              className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/40 active:scale-95 transition-transform group relative"
              title="Resgatar Convite"
            >
              <Ticket size={28} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-foreground text-primary text-[10px] items-center justify-center font-black">!</span>
              </span>
            </button>
          </div>

          <Link 
            href="/app/profile" 
            className={`flex flex-col items-center gap-1 ${pathname === '/app/profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <User size={22} className={pathname === '/app/profile' ? 'fill-primary/10' : ''} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </Link>
          
          <button 
            onClick={() => logout()}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sair</span>
          </button>
        </div>
      </nav>
      {/* Redeem Modal */}
      <RedeemInviteModal 
        isOpen={isRedeemModalOpen} 
        onClose={() => setIsRedeemModalOpen(false)}
        onSuccess={() => {
          // Se estiver no dashboard, recarrega os dados
          if (pathname === '/app') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
};
