
import { useState, useCallback, useEffect } from 'react';
import { apiService, ApiMode, AwsConfig } from '@/services/api/ApiService';

interface ApiConfigHook {
  mode: ApiMode;
  configureAws: (config: AwsConfig) => void;
  useLocalMode: () => void;
  isConfigured: boolean;
  awsConfig: AwsConfig | null;
}

/**
 * Hook para gerenciar a configuração da API
 * Permite alternar entre modo local e AWS e persistir essa configuração
 */
export function useApiConfig(): ApiConfigHook {
  const [mode, setMode] = useState<ApiMode>('local');
  const [awsConfig, setAwsConfig] = useState<AwsConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Carregar configuração salva ao inicializar
  useEffect(() => {
    const savedMode = localStorage.getItem('api_mode') as ApiMode | null;
    const savedConfig = localStorage.getItem('aws_config');
    
    if (savedMode) {
      setMode(savedMode);
      
      if (savedMode === 'aws' && savedConfig) {
        try {
          const config = JSON.parse(savedConfig) as AwsConfig;
          setAwsConfig(config);
          apiService.configureAws(config);
          setIsConfigured(true);
        } catch (error) {
          console.error('Erro ao carregar configuração AWS:', error);
          // Em caso de erro, volta para o modo local
          setMode('local');
          apiService.useLocalMode();
        }
      } else {
        apiService.useLocalMode();
        setIsConfigured(true);
      }
    } else {
      // Configuração padrão: modo local
      apiService.useLocalMode();
      setIsConfigured(true);
    }
  }, []);

  // Configurar para AWS
  const configureAws = useCallback((config: AwsConfig) => {
    apiService.configureAws(config);
    setMode('aws');
    setAwsConfig(config);
    setIsConfigured(true);
    
    // Persistir configuração
    localStorage.setItem('api_mode', 'aws');
    localStorage.setItem('aws_config', JSON.stringify(config));
  }, []);

  // Configurar para modo local
  const useLocalMode = useCallback(() => {
    apiService.useLocalMode();
    setMode('local');
    setAwsConfig(null);
    setIsConfigured(true);
    
    // Persistir configuração
    localStorage.setItem('api_mode', 'local');
    localStorage.removeItem('aws_config');
  }, []);

  return {
    mode,
    configureAws,
    useLocalMode,
    isConfigured,
    awsConfig
  };
}
