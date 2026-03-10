import axios from 'axios';
import { getFriendlyErrorMessage } from '../error-handler';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getFriendlyErrorMessage', () => {
  it('should return mapped message for Subscription limit reached', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {
          message: 'Subscription limit reached'
        }
      }
    };
    
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = getFriendlyErrorMessage(error, 'Fallback');
    expect(result).toBe('Este estabelecimento atingiu o limite mensal de cartões. Entre em contato com o suporte do local.');
  });

  it('should return backend message if it is not a technical error', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Cartela incompleta'
        }
      }
    };
    
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = getFriendlyErrorMessage(error, 'Fallback');
    expect(result).toBe('Cartela incompleta');
  });

  it('should return fallback for technical errors (SQL)', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          message: 'SQL Grammatical error near ...'
        }
      }
    };
    
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = getFriendlyErrorMessage(error, 'Erro genérico');
    expect(result).toBe('Erro interno no servidor. Tente novamente mais tarde.');
  });
});
