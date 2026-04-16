'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { withAdminAuth } from '@/components/auth/withAdminAuth';
import { Menu } from 'lucide-react';

const ROUTE_NAMES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/stores': 'Lojistas',
  '/admin/customers': 'Clientes',
  '/admin/campaigns': 'Campanhas',
  '/admin/campaings': 'Campanhas',
};

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = ROUTE_NAMES[pathname] ?? 'Painel Fidd';

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Admin</p>
            <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
            aria-label="Abrir menu administrativo"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminLayout);
