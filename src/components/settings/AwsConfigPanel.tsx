
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';
import { useApiConfig } from '@/hooks/useApiConfig';
import { AwsConfig } from '@/types';

// Esquema de validação aprimorado para o formulário AWS
const awsConfigSchema = z.object({
  mode: z.enum(['aws', 'local']),
  apiEndpoint: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || val?.startsWith('https://'), {
      message: "A URL da API deve começar com https://"
    }),
  apiKey: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || val?.length > 20, {
      message: "A API Key deve ter pelo menos 20 caracteres"
    }),
  userPoolId: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || /^[a-z]{2}-[a-z]+-\d+_[A-Za-z0-9]+$/.test(val as string), {
      message: "User Pool ID inválido. Formato esperado: region_poolid (ex: us-east-1_abc123)"
    }),
  clientId: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || /^[a-zA-Z0-9]{26}$/.test(val as string), {
      message: "Client ID inválido. Deve conter 26 caracteres alfanuméricos"
    }),
  region: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || /^[a-z]+-[a-z]+-\d+$/.test(val as string), {
      message: "Região inválida. Formato esperado: us-east-1, eu-west-1, etc."
    })
})
// Validação condicional para quando modo AWS está selecionado
.refine(data => data.mode !== 'aws' || (data.apiKey && data.apiKey.length > 0), {
  message: "API Key é obrigatória no modo AWS",
  path: ["apiKey"]
})
.refine(data => data.mode !== 'aws' || (data.region && data.region.length > 0), {
  message: "Região é obrigatória no modo AWS",
  path: ["region"]
})
.refine(data => data.mode !== 'aws' || (data.apiEndpoint && data.apiEndpoint.length > 0), {
  message: "URL da API é obrigatória no modo AWS",
  path: ["apiEndpoint"]
})
.refine(
  data => {
    // Se ambos estiverem vazios ou ambos preenchidos, está ok
    if (data.mode !== 'aws') return true;
    return ((!data.userPoolId && !data.clientId) || (data.userPoolId && data.clientId));
  },
  {
    message: "User Pool ID e Client ID devem ser ambos preenchidos ou ambos vazios",
    path: ["userPoolId"]
  }
);

export const AwsConfigPanel: React.FC = () => {
  const { mode, awsConfig, updateConfig, testConnection, isLoading, error } = useApiConfig();
  const [isTesting, setIsTesting] = useState(false);
  
  // Estado para armazenar valores atuais da configuração
  const [currentConfig, setCurrentConfig] = useState<AwsConfig>({
    mode: mode || 'local',
    apiEndpoint: '',
    apiKey: '',
    userPoolId: '',
    clientId: '',
    region: ''
  });
  
  // Inicializar o formulário
  const form = useForm<z.infer<typeof awsConfigSchema>>({
    resolver: zodResolver(awsConfigSchema),
    defaultValues: {
      mode: mode || 'local',
      apiEndpoint: '',
      apiKey: '',
      userPoolId: '',
      clientId: '',
      region: ''
    }
  });

  // Atualizar formulário quando a configuração mudar
  useEffect(() => {
    if (awsConfig) {
      form.reset({
        mode: awsConfig.mode,
        apiEndpoint: awsConfig.apiEndpoint || '',
        apiKey: awsConfig.apiKey || '',
        userPoolId: awsConfig.userPoolId || '',
        clientId: awsConfig.clientId || '',
        region: awsConfig.region || ''
      });
      setCurrentConfig(awsConfig);
    } else {
      form.reset({
        mode: 'local',
        apiEndpoint: '',
        apiKey: '',
        userPoolId: '',
        clientId: '',
        region: ''
      });
      setCurrentConfig({
        mode: 'local',
        apiEndpoint: '',
        apiKey: '',
        userPoolId: '',
        clientId: '',
        region: ''
      });
    }
  }, [awsConfig, form, mode]);

  // Função para testar a conexão
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const success = await testConnection();
      if (success) {
        toast({
          title: "Conexão bem-sucedida",
          description: "Os serviços AWS estão configurados corretamente"
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  // Função para submeter o formulário
  const onSubmit = async (data: z.infer<typeof awsConfigSchema>) => {
    try {
      // Verificar se há mudanças reais na configuração
      const hasChanges = 
        data.mode !== currentConfig.mode ||
        data.apiKey !== currentConfig.apiKey ||
        data.userPoolId !== currentConfig.userPoolId ||
        data.clientId !== currentConfig.clientId ||
        data.apiEndpoint !== currentConfig.apiEndpoint ||
        data.region !== currentConfig.region;
        
      if (!hasChanges) {
        toast({
          title: "Sem alterações",
          description: "Não foram detectadas mudanças na configuração"
        });
        return;
      }
      
      // Preparar a configuração completa com base no modo selecionado
      let configToSave: AwsConfig;
      
      if (data.mode === 'aws') {
        configToSave = {
          mode: 'aws',
          apiEndpoint: data.apiEndpoint!,  // Validação Z garantirá que isto não é undefined
          apiKey: data.apiKey,
          userPoolId: data.userPoolId,
          clientId: data.clientId,
          region: data.region!  // Validação Z garantirá que isto não é undefined
        };
      } else {
        // No modo local, definimos valores padrão vazios
        configToSave = {
          mode: 'local',
          apiEndpoint: '',
          region: ''
        };
      }
      
      const success = await updateConfig(configToSave);
      if (success) {
        setCurrentConfig(configToSave);
        toast({
          title: "Configurações atualizadas",
          description: `Modo alterado para: ${data.mode === 'aws' ? 'AWS' : 'Local'}`
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro ao atualizar configurações",
        description: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro de configuração</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Modo de Operação
                  </FormLabel>
                  <FormDescription>
                    Alterne entre modo AWS e modo Local
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'aws'}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? 'aws' : 'local');
                      // Mostrar orientações ao mudar para AWS
                      if (checked) {
                        toast({
                          title: "Modo AWS selecionado",
                          description: "Preencha as credenciais para conectar aos serviços AWS",
                        });
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Campos condicionalmente exibidos apenas quando modo AWS está ativo */}
          {form.watch("mode") === "aws" && (
            <div className="space-y-6 border p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-medium">Configuração AWS</h3>
                {currentConfig.mode === 'aws' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isTesting || isLoading}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Testar Conexão
                      </>
                    )}
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da API <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://api.exemplo.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      URL base da API Gateway (ex: https://abc123.execute-api.us-east-1.amazonaws.com/prod)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Insira sua API Key" 
                        {...field} 
                        type="password" 
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>
                      Chave de API para serviços AWS (necessário para autenticação)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Região AWS <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: us-east-1" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Região onde seus serviços AWS estão hospedados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6 border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Configuração do Amazon Cognito (opcional)
                </h4>
                
                <FormField
                  control={form.control}
                  name="userPoolId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Pool ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: us-east-1_abc123" {...field} />
                      </FormControl>
                      <FormDescription>
                        ID do User Pool do Amazon Cognito
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira o Client ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        ID do cliente do Amazon Cognito
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Salvar Configurações'
              )}
            </Button>
            
            {form.formState.isDirty && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => form.reset()}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
      
      {mode === 'aws' && !error && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>AWS Configurado</AlertTitle>
          <AlertDescription>
            O aplicativo está conectado aos serviços AWS. Autenticação e armazenamento remoto estão ativos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
