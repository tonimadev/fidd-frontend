/**
 * Página de perfil do cliente (mobile web)
 */

'use client';

import React from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { User, LogOut, ChevronRight, Settings, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, logout } = useMobileAuth();

  return (
    <MobileLayout title="Perfil">
      <div className="px-6 py-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-800">{user?.name}</h2>
            <p className="text-slate-500 font-medium">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl px-6 font-bold uppercase text-xs">
            Editar Perfil
          </Button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
            <MenuItem 
              icon={<User size={20} className="text-blue-500" />} 
              label="Dados Pessoais" 
            />
            <MenuItem 
              icon={<Shield size={20} className="text-green-500" />} 
              label="Segurança e Senha" 
            />
            <MenuItem 
              icon={<Settings size={20} className="text-slate-500" />} 
              label="Configurações" 
            />
          </div>

          <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
            <MenuItem 
              icon={<HelpCircle size={20} className="text-amber-500" />} 
              label="Ajuda e Suporte" 
            />
            <MenuItem 
              icon={<LogOut size={20} className="text-red-500" />} 
              label="Sair da Conta" 
              onClick={() => logout()}
              showChevron={false}
              className="text-red-600"
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">FIDD v1.0.0</p>
        </div>
      </div>
    </MobileLayout>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

function MenuItem({ 
  icon, 
  label, 
  onClick, 
  showChevron = true,
  className = ""
}: MenuItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-50 p-2.5 rounded-xl">
          {icon}
        </div>
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      {showChevron && <ChevronRight size={18} className="text-slate-300" />}
    </button>
  );
}
