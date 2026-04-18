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
      await reader.write(`fidd://pontos?token=${payload.token}&amount=${payload.amount}`);
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

  /**
   * Entra em modo de escaneamento para ler um token de resgate do NFC
   */
  static async scan(): Promise<string> {
    if (!this.isSupported()) {
      throw new Error('NFC_NOT_SUPPORTED');
    }

    try {
      // @ts-expect-error - NDEFReader não está nos tipos padrão do TS ainda
      const reader = new window.NDEFReader();
      await reader.scan();

      return new Promise((resolve, reject) => {
        // @ts-expect-error - NDEFReadingEvent não tipado
        reader.onreading = (event) => {
          try {
            const { message } = event;
            for (const record of message.records) {
              if (record.recordType === "url") {
                const decoder = new TextDecoder();
                const url = decoder.decode(record.data);

                // Esperado: fidd://rescue?token=XYZ
                if (url.startsWith('fidd://rescue')) {
                  const urlObj = new URL(url.replace('fidd://', 'https://'));
                  const token = urlObj.searchParams.get('token');
                  if (token) {
                    resolve(token);
                    return;
                  }
                }
              }
            }
            reject(new Error('NFC_INVALID_PAYLOAD'));
          } catch (e) {
            reject(e);
          }
        };

        reader.onreadingerror = () => {
          reject(new Error('NFC_READ_ERROR'));
        };
      });
    } catch (error: unknown) {
      console.error('Erro ao iniciar scan NFC:', error);
      const err = error as { name?: string };
      if (err.name === 'NotAllowedError') {
        throw new Error('NFC_PERMISSION_DENIED');
      } else {
        throw new Error('NFC_SCAN_FAILED');
      }
    }
  }
}
