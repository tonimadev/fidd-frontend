/**
 * Página de login — Enhanced with Trust & Animated Stats
 *
 * 🧠 Psychological Principle: Social Proof & Authority
 * Animated counters on the branding panel create a sense of a thriving
 * community. Rotating testimonials from merchants build trust through
 * peer authority.
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Ana Silva',
    business: 'Cafeteria Aroma',
    quote: 'O FIDD triplicou o retorno dos meus clientes em apenas 2 meses.',
  },
  {
    name: 'Carlos Souza',
    business: 'Burger & Beer',
    quote: 'Meus clientes adoram o programa de selos digital. É super fácil de usar.',
  },
  {
    name: 'Marina Santos',
    business: 'Salão Beleza Pura',
    quote: 'Substituí os cartões de papel e nunca mais tive reclamações de clientes.',
  },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const isAccountDeleted = searchParams.get('deleted') === 'true';

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-base">
          Acesse sua conta para gerenciar suas campanhas de selos
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isAccountDeleted && (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Sua conta foi marcada para deleção. Você tem 30 dias para reativar sua conta ao fazer login.
            </p>
          </div>
        )}
        <LoginForm />
      </CardContent>
    </Card>
  );
}

// Animated counter component
function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
    >
      <div className="font-bold text-xl mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Coluna da Esquerda: Formulário */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Image src="/fidd.png" alt="FIDD Logo" width={64} height={64} className="mb-2 dark:brightness-110" />
            <h1 className="text-4xl font-black tracking-tighter text-primary">FIDD</h1>
          </div>

          <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
            <LoginContent />
          </Suspense>

          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, você concorda com nossos{' '}
            <Link href="/terms" className="hover:text-primary underline transition-colors">
              Termos de Serviço
            </Link>
            {' '}e{' '}
            <a href="https://tonima.digital/fidd-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition-colors">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>

      {/* Coluna da Direita: Branding/Visual (Oculto em Mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground max-w-lg flex flex-col items-center">
          <Image src="/fidd.png" alt="FIDD Logo" width={100} height={100} className="mb-6" />
          <h1 className="text-6xl font-black tracking-tighter mb-6">FIDD</h1>
          <h2 className="text-3xl font-bold mb-4">Fidelize seus clientes com simplicidade.</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Crie cartões de selos virtuais, acompanhe o engajamento e aumente o faturamento da sua loja com uma plataforma intuitiva e moderna.
          </p>
          
          {/* Animated stats */}
          <motion.div 
            className="mt-12 grid grid-cols-2 gap-6 text-left w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedStat value="+150%" label="Retenção de clientes" />
            <AnimatedStat value="2 min" label="Configuração rápida" />
          </motion.div>

          {/* Rotating testimonials */}
          <motion.div 
            className="mt-8 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-left"
              >
                <p className="text-sm text-primary-foreground/90 italic mb-3">
                  &quot;{testimonials[currentTestimonial].quote}&quot;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-foreground">{testimonials[currentTestimonial].name}</p>
                    <p className="text-[10px] text-primary-foreground/60">{testimonials[currentTestimonial].business}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentTestimonial ? 'bg-white w-4' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
