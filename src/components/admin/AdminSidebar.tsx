'use client';

import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Lojistas',
      href: '/admin/stores',
      icon: Store,
    },
    {
      title: 'Clientes',
      href: '/admin/customers',
      icon: Users,
    },
    {
      title: 'Campanhas',
      href: '/admin/campaigns',
      icon: Megaphone,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="flex items-center mb-8 px-2">
          <Image src="/fidd.png" alt="Fidd Logo" width={32} height={32} className="h-8 w-auto mr-3" />
          <span className="text-xl font-bold text-gray-800">Fidd Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="flex-1">{item.title}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="mb-4 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Logado como</p>
            <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};
