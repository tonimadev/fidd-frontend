import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Copy, ExternalLink, Globe, Layout, Smartphone } from 'lucide-react';
import { ProUpgradeGate } from './ProUpgradeGate';

export const PublicPageManager: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const isPro = user?.plan === 'PRO' || user?.role === 'ADMIN';

  if (!isPro) {
    return (
      <ProUpgradeGate 
        title="Sua Vitrine Digital Profissional"
        description="Crie um link exclusivo para sua bio e transforme seguidores em clientes fiéis. Mostre suas campanhas ativas em uma página personalizada com sua marca."
      />
    );
  }

  const publicUrl = `${window.location.origin}/loja/${user?.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Globe className="text-primary" size={32} />
            Página Pública
          </h1>
          <p className="text-slate-500 font-medium">Sua vitrine digital para atrair e fidelizar clientes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.open(publicUrl, '_blank')} className="gap-2">
            <ExternalLink size={16} />
            Visualizar Página
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* URL Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Layout size={18} className="text-primary" />
              Link da sua Bio
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Use este link no seu Instagram, WhatsApp e outras redes sociais para divulgar suas campanhas.
            </p>
            
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 truncate flex-1">{publicUrl}</span>
              <button 
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'hover:bg-slate-200 text-slate-400'}`}
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && <p className="text-[10px] font-black text-green-600 uppercase tracking-widest text-center">Copiado para a área de transferência!</p>}
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/10 space-y-4">
            <h3 className="font-black text-primary flex items-center gap-2">
              Dica Pro
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              &quot;Personalize sua cor de destaque e adicione uma biografia nas configurações para deixar sua página com a cara da sua marca.&quot;
            </p>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Smartphone size={18} className="text-primary" />
            Pré-visualização Mobile
          </h3>
          
          <div className="relative mx-auto max-w-[320px] h-[640px] border-[8px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden bg-white">
            <div className="absolute top-0 w-full h-6 bg-slate-800 flex justify-center">
              <div className="w-20 h-4 bg-slate-900 rounded-b-xl" />
            </div>
            <iframe 
              src={publicUrl} 
              className="w-full h-full border-none pt-4 pointer-events-none select-none"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
