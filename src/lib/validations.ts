/**
 * Schemas de validação com Zod
 */

import { z } from 'zod';

// Regex para validar senha forte
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Regex para validar CNPJ (14 dígitos)
const cnpjRegex = /^\d{14}$/;

// Regex para validar CPF (11 dígitos)
const cpfRegex = /^\d{11}$/;

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  tradeName: z.string()
    .min(3, 'Nome da loja deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da loja não pode exceder 100 caracteres'),
  taxIdType: z.enum(['CNPJ', 'CPF'], {
    message: 'Selecione CNPJ ou CPF'
  }),
  taxId: z.string().min(1, 'Documento obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(passwordRegex, 'Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => {
  // Validar CNPJ se selecionado
  if (data.taxIdType === 'CNPJ') {
    return cnpjRegex.test(data.taxId);
  }
  // Validar CPF se selecionado
  if (data.taxIdType === 'CPF') {
    return cpfRegex.test(data.taxId);
  }
  return false;
}, {
  message: 'Documento inválido para o tipo selecionado',
  path: ['taxId'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

