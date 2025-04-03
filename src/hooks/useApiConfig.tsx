
import { useState, useCallback, useEffect } from 'react';
import { apiService, ApiMode, AwsConfig } from '@/services/api/ApiService';
import { toast } from '@/hooks/use-toast';

interface ApiConfigHook {
  mode: ApiMode;
  configureAws: (config: AwsConfig) => Promise<boolean>;
  useLocalMode: () => void;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  awsConfig: AwsConfig | null;
  testConnection: () => Promise<boolean>;
}

/**
 * Hook para gerenciar a configuração da API
 * Permite alternar entre modo local e AWS e persistir essa configuração
 * Inclui feedback visual e tratamento de erros aprimorado
 */
export function useApiConfig(): ApiConfigHook {
  const [mode, setMode] = useState<ApiMode>('local');
  const [awsConfig, setAwsConfig] = useState<AwsConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar configuração salva ao inicializar
  useEffect(() => {
    const loadConfiguration = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const savedMode = localStorage.getItem('api_mode') as ApiMode | null;
        const savedConfig = localStorage.getItem('aws_config');
        
        if (savedMode) {
          setMode(savedMode);
          
          if (savedMode === 'aws' && savedConfig) {
            try {
              const config = JSON.parse(savedConfig) as AwsConfig;
              setAwsConfig(config);
              await apiService.configureAws(config);
              setIsConfigured(true);
              toast({
                title: "AWS conectado",
                description: "O aplicativo está usando serviços AWS"
              });
            } catch (error) {
              console.error('Erro ao carregar configuração AWS:', error);
              setError('Falha ao conectar com AWS. Usando modo local como fallback.');
              setMode('local');
              apiService.useLocalMode();
              toast({
                title: "Erro na configuração AWS",
                description: "Usando modo local como fallback",
                variant: "destructive"
              });
            }
          } else {
            apiService.useLocalMode();
            setIsConfigured(true);
            toast({
              title: "Modo local ativo",
              description: "O aplicativo está usando dados locais para testes"
            });
          }
        } else {
          // Configuração padrão: modo local
          apiService.useLocalMode();
          setIsConfigured(true);
        }
      } catch (error) {
        console.error('Erro ao configurar API:', error);
        setError('Erro ao inicializar a configuração da API');
        toast({
          title: "Erro de configuração",
          description: "Não foi possível inicializar a API",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  // Testar conexão com AWS
  const testConnection = useCallback(async (): Promise<boolean> => {
    if (mode !== 'aws' || !awsConfig) {
      return false;
    }

    try {
      setIsLoading(true);
      // Tenta fazer uma chamada simples para verificar a conexão
      await apiService.getTowers();
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com AWS foi testada com sucesso"
      });
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão AWS:', error);
      setError('Falha ao conectar com serviços AWS');
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar aos serviços AWS",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [mode, awsConfig]);

  // Configurar para AWS
  const configureAws = useCallback(async (config: AwsConfig): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.configureAws(config);
      setMode('aws');
      setAwsConfig(config);
      setIsConfigured(true);
      
      // Persistir configuração
      localStorage.setItem('api_mode', 'aws');
      localStorage.setItem('aws_config', JSON.stringify(config));
      
      toast({
        title: "AWS configurado",
        description: "Conexão com serviços AWS estabelecida com sucesso"
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao configurar AWS:', error);
      setError('Falha ao configurar serviços AWS');
      
      toast({
        title: "Erro de configuração",
        description: "Não foi possível configurar a conexão com AWS",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Configurar para modo local
  const useLocalMode = useCallback(() => {
    apiService.useLocalMode();
    setMode('local');
    setAwsConfig(null);
    setIsConfigured(true);
    setError(null);
    
    // Persistir configuração
    localStorage.setItem('api_mode', 'local');
    localStorage.removeItem('aws_config');
    
    toast({
      title: "Modo local ativado",
      description: "Usando dados locais para teste e desenvolvimento"
    });
  }, []);

  return {
    mode,
    configureAws,
    useLocalMode,
    isConfigured,
    isLoading,
    error,
    awsConfig,
    testConnection
  };
}
