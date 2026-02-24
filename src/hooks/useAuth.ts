/**
 * Hook customizado para usar autenticação
 */

'use client';

import { useAuth } from '@/context/auth-context';

export const useAuthState = () => {
  return useAuth();
};

