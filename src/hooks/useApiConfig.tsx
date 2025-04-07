
import { useState, useCallback, useEffect } from 'react';
import { apiService, ApiMode } from '@/services/api/ApiService';
import { toast } from '@/hooks/use-toast';
import { AwsConfig } from '@/types';

interface ApiConfigHook {
  mode: ApiMode;
  configureAws: (config: AwsConfig) => Promise<boolean>;
  updateConfig: (config: AwsConfig) => Promise<boolean>;
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
              
              // Validar configuração antes de aplicar
              if (!isValidAwsConfig(config)) {
                throw new Error('Configuração AWS incompleta ou inválida');
              }
              
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

  // Função para validar configuração AWS
  const isValidAwsConfig = (config: AwsConfig): boolean => {
    if (config.mode !== 'aws') return false;
    
    // Validar campos obrigatórios para AWS
    if (!config.apiKey || config.apiKey.trim() === '') return false;
    if (!config.region || config.region.trim() === '') return false;
    
    // Validação específica para Cognito
    if (config.userPoolId && !config.clientId) return false;
    if (!config.userPoolId && config.clientId) return false;
    
    return true;
  };

  // Testar conexão com AWS
  const testConnection = useCallback(async (): Promise<boolean> => {
    if (mode !== 'aws' || !awsConfig) {
      toast({
        title: "Teste não realizado",
        description: "Configure o modo AWS primeiro",
        variant: "destructive"
      });
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
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Falha ao conectar com serviços AWS: ${errorMessage}`);
      toast({
        title: "Erro de conexão",
        description: `Não foi possível conectar aos serviços AWS: ${errorMessage}`,
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
      // Validar configuração
      if (!isValidAwsConfig(config)) {
        throw new Error('Configuração AWS inválida ou incompleta');
      }
      
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
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Falha ao configurar serviços AWS: ${errorMessage}`);
      
      toast({
        title: "Erro de configuração",
        description: `Não foi possível configurar a conexão com AWS: ${errorMessage}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar configuração existente
  const updateConfig = useCallback(async (config: AwsConfig): Promise<boolean> => {
    if (config.mode === 'aws') {
      return await configureAws(config);
    } else {
      useLocalMode();
      return true;
    }
  }, [configureAws]);

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
    
    return true;
  }, []);

  return {
    mode,
    configureAws,
    updateConfig,
    useLocalMode,
    isConfigured,
    isLoading,
    error,
    awsConfig,
    testConnection
  };
}
