/**
 * Sidebar — Enhanced with Progress Indicators & Feature Discovery
 *
 * 🧠 Psychological Principle: Curiosity Gap (Loewenstein)
 * People are motivated to fill gaps in their knowledge. By showing partial
 * information ("3 novos insights disponíveis") and golden shimmer on PRO tabs,
 * merchants are compelled to click and explore.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { isUserPro } from '@/lib/auth-utils';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';
import { DashboardTab } from '@/types/dashboard';
import { BadgeCheck, Crown } from 'lucide-react';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  onHelpClick: (tutorialId?: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuSection {
  label: string;
  items: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onHelpClick,
  isOpen = false,
  onClose
}) => {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.profilePictureUrl]);

  const isPro = isUserPro(user);
  const isAdmin = user?.role === 'ADMIN';
  const proTabs: DashboardTab[] = ['insights', 'public-page', 'automations', 'referrals', 'history'];

  // Grouped menu sections for better cognitive organization
  const menuSections: MenuSection[] = [
    {
      label: 'Visão Geral',
      items: [
        { id: 'home', label: 'Dashboard', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )},
        { id: 'insights', label: 'Insights', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )},
      ],
    },
    {
      label: 'Operações',
      items: [
        { id: 'campaigns', label: 'Campanhas', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )},
        { id: 'customers', label: 'Clientes', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )},
        { id: 'redemptions', label: 'Resgates', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )},
        { id: 'nfc', label: 'Emitir NFC', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )},
      ],
    },
    {
      label: 'Crescimento',
      items: [
        { id: 'automations', label: 'Automações', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )},
        { id: 'referrals', label: 'Indicações', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )},
        { id: 'public-page', label: 'Página Pública', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )},
        { id: 'history', label: 'Histórico', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )},
      ],
    },
    {
      label: 'Configuração',
      items: [
        { id: 'subscriptions', label: 'Assinatura', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )},
        { id: 'settings', label: 'Configurações', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )},
        { id: 'simulator', label: 'Simulador ROI', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )},
        { id: 'developers', label: 'Desenvolvedores', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )},
      ],
    },
  ];

  // Add admin section if applicable
  if (isAdmin) {
    menuSections.push({
      label: 'Administração',
      items: [
        { id: 'admin-panel' as DashboardTab, label: 'Painel Admin', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )},
      ],
    });
  }

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 
      fixed lg:sticky 
      top-0 left-0 z-40 
      w-64 bg-card border-r border-border h-screen 
      flex flex-col transition-transform duration-300 ease-in-out
    `}>
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={() => {
            setActiveTab('home');
            onClose?.();
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image src="/fidd.png" alt="FIDD Logo" width={32} height={32} className="dark:brightness-110" />
          <span className="text-2xl font-black tracking-tighter text-primary">FIDD</span>
        </button>

        <button
          onClick={onClose}
          className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* PRO badge for non-pro users */}
      {!isPro && (
        <div className="mx-4 mb-3">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 hover:shadow-md transition-all text-xs font-bold"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade para PRO</span>
            <span className="ml-auto text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-black">
              NOVO
            </span>
          </button>
        </div>
      )}
      
      <nav className="flex-1 px-4 overflow-y-auto">
        {menuSections.map((section, sectionIdx) => (
          <div key={section.label} className={sectionIdx > 0 ? 'mt-4' : ''}>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isProTab = proTabs.includes(item.id);
                const isLocked = isProTab && !isPro;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'admin-panel') {
                        window.location.href = '/admin/dashboard';
                        return;
                      }
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${isLocked ? 'relative overflow-hidden' : ''}`}
                  >
                    {/* Golden shimmer effect on locked PRO tabs */}
                    {isLocked && activeTab !== item.id && (
                      <div className="absolute inset-0 animate-shimmer-gold opacity-50 rounded-lg pointer-events-none" />
                    )}
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {isLocked && (
                      <span className="text-[8px] bg-gradient-to-r from-amber-500 to-amber-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        Pro
                      </span>
                    )}
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[9px] min-w-[18px] h-[18px] rounded-full font-bold flex items-center justify-center animate-badge-pop">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <button
          onClick={() => onHelpClick()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/10 mt-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Central de Ajuda
          <span className="ml-auto bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">NOVO</span>
        </button>
      </nav>

      <div className="p-4 border-t border-border space-y-4 bg-muted/20">
        <div className="px-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Siga-nos</p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/fidd_br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm8.95 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
              </svg>
              <span className="text-[11px] font-bold tracking-tight">@fidd_br</span>
            </a>
            <a
              href="https://www.facebook.com/share/1DP63NZmqw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors group"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M13.5 22v-8h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H7.9v3h2.8v8h2.8Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="h-px bg-border mx-3 opacity-50"></div>

        <div className="flex items-center gap-3 px-3 py-1">
          {user?.profilePictureUrl ? (
            <Image 
              src={imgError ? `https://via.placeholder.com/150?text=${user?.tradeName?.charAt(0) || 'L'}` : user.profilePictureUrl} 
              alt={user.tradeName || 'Logo'} 
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {user?.tradeName?.charAt(0).toUpperCase() || 'L'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate text-foreground">{user?.tradeName}</p>
              {user?.plan === 'Pro' && (
                <BadgeCheck className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]/10 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          onClick={onLogout}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </Button>
      </div>
    </aside>
  );
};
