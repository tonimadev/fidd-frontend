'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { 
  LayoutDashboard, 
  Store, 
  Users,
  Megaphone,
  LogOut, 
  ChevronRight,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      aliases: [],
    },
    {
      title: 'Lojistas',
      href: '/admin/stores',
      icon: Store,
      aliases: [],
    },
    {
      title: 'Clientes',
      href: '/admin/customers',
      icon: Users,
      aliases: [],
    },
    {
      title: 'Campanhas',
      href: '/admin/campaigns',
      icon: Megaphone,
      aliases: ['/admin/campaings'],
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu administrativo"
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 lg:z-40 lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegação administrativa"
      >
        <div className="flex h-full flex-col px-3 py-4">
          <div className="mb-6 flex items-center justify-between gap-3 px-2 lg:mb-8">
            <div className="flex min-w-0 items-center">
              <Image src="/fidd.png" alt="Fidd Logo" width={32} height={32} className="mr-3 h-8 w-auto" />
              <span className="truncate text-xl font-bold text-gray-800">Fidd Admin</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || item.aliases.includes(pathname) || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="flex-1">{item.title}</span>
                  {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-4">
            <div className="mb-4 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Logado como</p>
              <p className="truncate text-sm font-medium text-gray-700">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                onClose?.();
                logout();
              }}
              className="flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5 shrink-0" />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
