
import { Tower, Room, Inspection, Equipment, Inspector, Report, PerformanceReport } from '@/types';
import { mockTowers, mockRooms, mockInspectors, mockInspections, mockReports } from '@/data/mockData';
import { performanceReports } from '@/data/performanceData';

/**
 * Modo de API - Local usa dados mockados, AWS usa API Gateway
 */
export type ApiMode = 'local' | 'aws';

/**
 * Configuração para conexão com AWS
 */
export interface AwsConfig {
  apiEndpoint: string;
  region: string;
  cognitoUserPoolId?: string;
  cognitoClientId?: string;
}

/**
 * Classe responsável pela comunicação com a API
 * Implementa o padrão Adapter para alternar facilmente entre
 * dados locais e AWS API Gateway
 */
class ApiService {
  private mode: ApiMode = 'local';
  private awsConfig: AwsConfig | null = null;
  private token: string | null = null;

  /**
   * Configura o serviço para usar AWS
   */
  public configureAws(config: AwsConfig): void {
    this.mode = 'aws';
    this.awsConfig = config;
    console.log('API configurada para modo AWS');
  }

  /**
   * Configura o serviço para usar dados locais
   */
  public useLocalMode(): void {
    this.mode = 'local';
    console.log('API configurada para modo local');
  }

  /**
   * Define o token de autenticação
   */
  public setAuthToken(token: string): void {
    this.token = token;
  }

  /**
   * Remove o token de autenticação
   */
  public clearAuthToken(): void {
    this.token = null;
  }

  /**
   * Método genérico para fazer requisições à API AWS
   */
  private async fetchFromAws<T>(path: string, method: string = 'GET', body?: any): Promise<T> {
    if (!this.awsConfig) {
      throw new Error('AWS não configurado. Use configureAws() primeiro.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.awsConfig.apiEndpoint}/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição à API');
    }

    return response.json();
  }

  /**
   * Obter todas as torres
   */
  public async getTowers(): Promise<Tower[]> {
    if (this.mode === 'local') {
      // Simula um pequeno atraso de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTowers;
    }

    return this.fetchFromAws<Tower[]>('towers');
  }

  /**
   * Obter todas as salas
   */
  public async getRooms(): Promise<Room[]> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRooms;
    }

    return this.fetchFromAws<Room[]>('rooms');
  }

  /**
   * Obter sala por ID
   */
  public async getRoomById(id: string): Promise<Room | undefined> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockRooms.find(room => room.id === id);
    }

    return this.fetchFromAws<Room>(`rooms/${id}`);
  }

  /**
   * Obter salas por torre
   */
  public async getRoomsByTower(towerId: string): Promise<Room[]> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRooms.filter(room => room.towerId === towerId);
    }

    return this.fetchFromAws<Room[]>(`towers/${towerId}/rooms`);
  }

  /**
   * Obter inspeções
   */
  public async getInspections(): Promise<Inspection[]> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockInspections;
    }

    return this.fetchFromAws<Inspection[]>('inspections');
  }

  /**
   * Obter inspeção por ID
   */
  public async getInspectionById(id: string): Promise<Inspection | undefined> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockInspections.find(inspection => inspection.id === id);
    }

    return this.fetchFromAws<Inspection>(`inspections/${id}`);
  }

  /**
   * Obter relatórios de desempenho
   */
  public async getPerformanceReports(period: 'daily' | 'weekly' | 'monthly', inspectorId?: string): Promise<PerformanceReport[]> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Se um ID de inspetor for fornecido, filtra os relatórios apenas para esse inspetor
      if (inspectorId) {
        return performanceReports
          .filter(report => report.period === period && report.inspectorId === inspectorId);
      }
      
      return performanceReports.filter(report => report.period === period);
    }

    const path = inspectorId 
      ? `reports/performance/${period}?inspectorId=${inspectorId}`
      : `reports/performance/${period}`;
    
    return this.fetchFromAws<PerformanceReport[]>(path);
  }

  /**
   * Salvar uma inspeção
   */
  public async saveInspection(inspection: Omit<Inspection, 'id'>): Promise<Inspection> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newInspection: Inspection = {
        ...inspection,
        id: Math.random().toString(36).substring(2, 11),
      };
      
      // Em um ambiente real, isso seria persistido no backend
      console.log('Inspeção salva (mock):', newInspection);
      
      return newInspection;
    }

    return this.fetchFromAws<Inspection>('inspections', 'POST', inspection);
  }

  /**
   * Upload de imagem para o backend/S3
   */
  public async uploadImage(file: File, inspectionId: string): Promise<{ url: string }> {
    if (this.mode === 'local') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula um URL para a imagem
      const fakeUrl = `https://example.com/images/${Math.random().toString(36).substring(2, 11)}.jpg`;
      console.log('Imagem enviada (mock):', fakeUrl);
      
      return { url: fakeUrl };
    }

    // Para AWS, precisaríamos de um endpoint pré-assinado do S3
    // Primeiro, solicitamos um URL de upload pré-assinado
    const uploadUrl = await this.fetchFromAws<{ uploadUrl: string, fileUrl: string }>(
      `inspections/${inspectionId}/image-upload-url`, 'POST', { fileType: file.type }
    );

    // Então fazemos o upload diretamente para o S3
    await fetch(uploadUrl.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return { url: uploadUrl.fileUrl };
  }
}

// Exporta uma instância singleton do serviço
export const apiService = new ApiService();

// Exemplo de como configurar para AWS (deve ser feito durante a inicialização do app)
/*
apiService.configureAws({
  apiEndpoint: 'https://api.example.com/v1',
  region: 'us-east-1',
  cognitoUserPoolId: 'us-east-1_abcdefg',
  cognitoClientId: '1234567890abcdefg',
});
*/
