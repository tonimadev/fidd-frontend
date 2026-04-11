/**
 * Layout base para a área do cliente (mobile web)
 */

'use client';

import React from 'react';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Home, MapPin, QrCode, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UnifiedScannerModal } from '@/components/mobile/UnifiedScannerModal';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = 'FIDD' }) => {
  const { logout, isAuthenticated, isLoading } = useMobileAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-border/40 px-6 py-4">
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border/40 px-6 py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 pb-2 border-b border-border/50">
            <a
              href="https://instagram.com/fidd_br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
              title="Siga-nos no Instagram"
            >
              <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold tracking-tight hidden sm:inline">@fidd_br</span>
            </a>
            <a
              href="https://www.facebook.com/share/1DP63NZmqw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
              title="Siga-nos no Facebook"
            >
              <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold tracking-tight hidden sm:inline">FIDD no Facebook</span>
            </a>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-around items-center">
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
                onClick={() => setIsScannerOpen(true)}
                className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/40 active:scale-95 transition-transform group relative"
                title="Escanear"
              >
                <QrCode size={28} className="group-hover:rotate-12 transition-transform" />
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
        </div>
      </nav>
      {/* Scanner Modal */}
      <UnifiedScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)}
        onSuccess={() => {
          // Recarrega os dados se estiver na home ou card detail
          if (pathname === '/app' || pathname.startsWith('/app/cards/')) {
            window.location.reload();
          }
        }}
      />
    </div>
  );
};
