import React from 'react';

export const DownloadButtons: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-slate-900/20">
      <div className="relative z-10">
        <h3 className="text-xl font-black tracking-tight mb-2 italic uppercase">
          Experiência Completa
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
          Para uma melhor experiência, notificações em tempo real e acesso offline, baixe nosso aplicativo oficial.
        </p>
        
        <div className="flex flex-col gap-3">
          <a 
            href="https://play.google.com/store/apps/details?id=digital.tonima.fidd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-white text-slate-900 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors active:scale-95 duration-200 shadow-lg"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.1-.12c-.106-.153-.16-.33-.16-.51V2.445c0-.18.054-.357.16-.51.03-.045.064-.085.1-.121zM14.735 12.943l2.844-2.844 3.764 2.14a1 1 0 0 1 0 1.74l-3.764 2.14-2.844-3.176zm-1.886-1.886L3.92 2.114 13.56 11.75l-.711.307zM3.92 21.886l8.929-8.929.711.307-9.64 9.64a.978.978 0 0 1-.225-.11z" />
            </svg>
            Google Play
          </a>
          
          <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/40 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-1.99.77-3.26.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.89 1.22-2.11 1.09-3.33-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2.03-1.1 3.22 1.16.09 2.33-.56 3.06-1.45z" />
            </svg>
            App Store (Breve)
          </div>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
    </div>
  );
};
