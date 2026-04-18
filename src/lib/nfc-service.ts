/**
 * Serviço para gerenciar operações Web NFC (NDEFReader)
 */

export interface NfcPayload {
  token: string;
  amount: number;
}

export class NfcService {
  /**
   * Verifica se o Web NFC é suportado pelo navegador
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'NDEFReader' in window;
  }

  /**
   * Solicita permissão e tenta escrever um payload no NFC
   */
  static async write(payload: NfcPayload): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('NFC_NOT_SUPPORTED');
    }

    try {
      // @ts-expect-error - NDEFReader não está nos tipos padrão do TS ainda
      const reader = new window.NDEFReader();
      await reader.write({
        records: [
          {
            recordType: "url",
            // Formato: fidd://pontos?token=XYZ&amount=10
            // O app Android deve estar configurado para capturar esse esquema
            data: `fidd://pontos?token=${payload.token}&amount=${payload.amount}`
          }
        ]
      });
    } catch (error: unknown) {
      console.error('Erro ao escrever no NFC:', error);
      const err = error as { name?: string };
      if (err.name === 'NotAllowedError') {
        throw new Error('NFC_PERMISSION_DENIED');
      } else if (err.name === 'NotSupportedError') {
        throw new Error('NFC_NOT_SUPPORTED');
      } else {
        throw new Error('NFC_WRITE_FAILED');
      }
    }
  }
}
