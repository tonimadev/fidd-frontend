/**
 * Utilitários para validação de documentos fiscais (CPF e CNPJ).
 */

/**
 * Valida CPF (11 dígitos).
 */
export function isValidCpf(cpf: string | null | undefined): boolean {
  if (!cpf) return false;

  const cleanCpf = cpf.replace(/\D/g, '');

  if (cleanCpf.length !== 11) return false;

  // Rejeita repetidos
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  return calculateCpfDigits(cleanCpf);
}

/**
 * Valida CNPJ (14 dígitos).
 */
export function isValidCnpj(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;

  const cleanCnpj = cnpj.replace(/\D/g, '');

  if (cleanCnpj.length !== 14) return false;

  // Rejeita repetidos
  if (/^(\d)\1{13}$/.test(cleanCnpj)) return false;

  return calculateCnpjDigits(cleanCnpj);
}

function calculateCpfDigits(cpf: string): boolean {
  const digits = cpf.split('').map(Number);

  // Primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  if (digits[9] !== firstDigit) return false;

  // Segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  return digits[10] === secondDigit;
}

function calculateCnpjDigits(cnpj: string): boolean {
  const digits = cnpj.split('').map(Number);

  // Primeiro dígito
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weight[i];
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  if (digits[12] !== firstDigit) return false;

  // Segundo dígito
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * weight[i];
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  return digits[13] === secondDigit;
}
