import { User } from '@/types/auth';

/**
 * Verifica se o usuário tem acesso às funcionalidades PRO.
 * O acesso é concedido se o usuário for um administrador ou se possuir o plano PRO.
 * A verificação do plano é case-insensitive e tolerante (ex: "Pro", "PRO", "Plano Pro").
 */
export const isUserPro = (user: User | null | undefined): boolean => {
  if (!user) return false;
  
  // Administradores sempre têm acesso PRO
  if (user.role === 'ADMIN') return true;
  
  // Se não houver plano, não é PRO
  if (!user.plan) return false;
  
  const planLower = user.plan.toLowerCase();
  
  // Verifica se o nome do plano contém "pro" (robusto para "Pro", "PRO", "Plano Pro", "Pro Plan", etc)
  return planLower.includes('pro');
};
