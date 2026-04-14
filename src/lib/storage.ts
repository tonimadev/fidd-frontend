/**
 * Utilitários para armazenamento seguro de dados no localStorage no front-end.
 * Isso evita que dados sensíveis como tokens de autenticação fiquem em plain text.
 * Nota: Como a chave de criptografia reside no front-end, isso é uma medida de ofuscação
 * para mitigar ataques triviais de inspeção de armazenamento.
 */

// Chave para ofuscação (XOR)
const STORAGE_SECRET = 'fidd-secret-key-2024';

/**
 * Ofusca uma string usando XOR e Base64
 */
const encrypt = (text: string): string => {
  if (!text) return '';
  try {
    const xorPart = text.split('').map((char, index) => {
      return String.fromCharCode(char.charCodeAt(0) ^ STORAGE_SECRET.charCodeAt(index % STORAGE_SECRET.length));
    }).join('');
    return btoa(xorPart);
  } catch (e) {
    console.error('Erro ao ofuscar dados:', e);
    return text;
  }
};

/**
 * Reverte a ofuscação de uma string
 */
const decrypt = (encoded: string): string => {
  if (!encoded) return '';
  try {
    const decoded = atob(encoded);
    return decoded.split('').map((char, index) => {
      return String.fromCharCode(char.charCodeAt(0) ^ STORAGE_SECRET.charCodeAt(index % STORAGE_SECRET.length));
    }).join('');
  } catch {
    // Se falhar, pode ser que o dado já estivesse em plain text (legado)
    return encoded;
  }
};

export const storage = {
  /**
   * Salva um item no localStorage de forma ofuscada
   */
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    const encryptedValue = encrypt(value);
    localStorage.setItem(key, encryptedValue);
  },

  /**
   * Recupera um item do localStorage e remove a ofuscação
   */
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    return decrypt(value);
  },

  /**
   * Remove um item do localStorage
   */
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Limpa o localStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
};
