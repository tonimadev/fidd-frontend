import axios from 'axios';

jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));

import { createApiClient } from '../api-client';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiClient', () => {
  let mockInterceptorsRequestUse: jest.Mock;
  let mockInterceptorsResponseUse: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockInterceptorsRequestUse = jest.fn();
    mockInterceptorsResponseUse = jest.fn();

    (mockedAxios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: { use: mockInterceptorsRequestUse },
        response: { use: mockInterceptorsResponseUse },
      },
    });

    // Reset navigator language to default
    Object.defineProperty(window, 'navigator', {
      value: { language: 'pt-BR' },
      configurable: true
    });

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
      configurable: true
    });
  });

  it('deve adicionar o header Accept-Language pt-BR por padrão', () => {
    createApiClient();
    
    const requestInterceptor = mockInterceptorsRequestUse.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers['Accept-Language']).toBe('pt-BR');
  });

  it('deve adicionar o header Accept-Language en-US se o idioma for en', () => {
    // Mock navigator language
    Object.defineProperty(window, 'navigator', {
      value: { language: 'en-US' },
      configurable: true
    });

    createApiClient();
    
    const requestInterceptor = mockInterceptorsRequestUse.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers['Accept-Language']).toBe('en-US');
  });

  it('deve priorizar o idioma do localStorage', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('en-US');
    
    // Mesmo que o navegador esteja em PT
    Object.defineProperty(window, 'navigator', {
      value: { language: 'pt-BR' },
      configurable: true
    });

    createApiClient();
    
    const requestInterceptor = mockInterceptorsRequestUse.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers['Accept-Language']).toBe('en-US');
  });

  it('deve adicionar o token de autorização se existir', () => {
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'authToken') return 'fake-token';
      return null;
    });

    createApiClient();
    
    const requestInterceptor = mockInterceptorsRequestUse.mock.calls[0][0];
    const config = { headers: {} };
    
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBe('Bearer fake-token');
  });
});
