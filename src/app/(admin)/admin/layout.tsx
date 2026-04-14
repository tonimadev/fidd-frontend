'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { withAdminAuth } from '@/components/auth/withAdminAuth';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminLayout);
