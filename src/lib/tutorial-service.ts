import { apiClient } from './api-client';
import { Tutorial } from '@/types/tutorial';

export const tutorialService = {
  /**
   * Busca todos os tutoriais disponíveis para o lojista.
   */
  async getTutorials(): Promise<Tutorial[]> {
    const response = await apiClient.get<Tutorial[]>('/api/web/v1/tutorials');
    return response.data;
  },

  /**
   * Busca um tutorial específico pelo ID.
   */
  async getTutorialById(id: string): Promise<Tutorial | null> {
    const tutorials = await this.getTutorials();
    return tutorials.find(t => t.id === id) || null;
  }
};
