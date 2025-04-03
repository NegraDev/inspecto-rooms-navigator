
import React, { useState } from 'react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { AwsConfig } from '@/services/api/ApiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AwsConfigPanel() {
  const { 
    mode, 
    configureAws, 
    useLocalMode, 
    isConfigured, 
    isLoading, 
    error, 
    awsConfig,
    testConnection 
  } = useApiConfig();

  const [formValues, setFormValues] = useState<AwsConfig>({
    region: awsConfig?.region || 'us-east-1',
    apiKey: awsConfig?.apiKey || '',
    apiEndpoint: awsConfig?.apiEndpoint || '',
    userPoolId: awsConfig?.userPoolId || '',
    clientId: awsConfig?.clientId || '',
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await configureAws(formValues);
    if (success) {
      await handleTestConnection();
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus('idle');
    
    try {
      const success = await testConnection();
      setTestStatus(success ? 'success' : 'error');
    } catch (error) {
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleMode = (checked: boolean) => {
    if (checked) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      useLocalMode();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração da API</CardTitle>
        <CardDescription>
          Configure a conexão com os serviços AWS para uso em produção ou utilize o modo local para desenvolvimento
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">Modo AWS</h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'aws' 
                ? 'Usando serviços AWS em produção' 
                : 'Usando dados locais para desenvolvimento'}
            </p>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <Switch 
              checked={mode === 'aws'}
              onCheckedChange={handleToggleMode}
            />
          )}
        </div>

        <Separator className="my-4" />

        <Tabs defaultValue={mode === 'aws' ? 'aws' : 'local'}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="aws">AWS Free Tier</TabsTrigger>
            <TabsTrigger value="local">Modo Local</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aws">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="region">Região AWS</Label>
                  <Input 
                    id="region" 
                    name="region"
                    value={formValues.region}
                    onChange={handleInputChange}
                    placeholder="ex: us-east-1"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="apiEndpoint">API Gateway Endpoint</Label>
                  <Input 
                    id="apiEndpoint" 
                    name="apiEndpoint"
                    value={formValues.apiEndpoint}
                    onChange={handleInputChange}
                    placeholder="https://xxxxxx.execute-api.region.amazonaws.com/stage"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey" 
                    name="apiKey"
                    type="password"
                    value={formValues.apiKey}
                    onChange={handleInputChange}
                    placeholder="Sua API key"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userPoolId">Cognito User Pool ID</Label>
                  <Input 
                    id="userPoolId" 
                    name="userPoolId"
                    value={formValues.userPoolId}
                    onChange={handleInputChange}
                    placeholder="region_xxxxxxxxx"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clientId">Cognito Client ID</Label>
                  <Input 
                    id="clientId" 
                    name="clientId"
                    value={formValues.clientId}
                    onChange={handleInputChange}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 mt-4 p-2 text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle size={16} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {mode === 'aws' && testStatus === 'success' && (
                <div className="flex items-center gap-2 mt-4 p-2 text-green-600 bg-green-50 rounded-md">
                  <CheckCircle2 size={16} />
                  <p className="text-sm">Conexão com AWS estabelecida com sucesso</p>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTesting || mode !== 'aws' || !isConfigured}
                >
                  {isTesting ? 'Testando...' : 'Testar Conexão'}
                </Button>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="local">
            <div className="space-y-4">
              <p>
                No modo local, o aplicativo utiliza dados mockados para testes e desenvolvimento.
                Nenhuma configuração adicional é necessária.
              </p>
              
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Vantagens do modo local:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Desenvolvimento sem dependência de conexão internet</li>
                  <li>Testes rápidos sem consumo de recursos AWS</li>
                  <li>Não há custo associado</li>
                  <li>Dados de exemplo já pré-configurados</li>
                </ul>
              </div>
              
              {mode === 'local' && (
                <div className="flex items-center gap-2 p-2 text-green-600 bg-green-50 rounded-md">
                  <CheckCircle2 size={16} />
                  <p className="text-sm">Modo local ativo e funcionando</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Para mais informações sobre a arquitetura AWS utilizada, consulte a documentação em 
          <code className="mx-1 p-1 bg-muted rounded">src/docs/aws-architecture.md</code>.
        </p>
      </CardFooter>
    </Card>
  );
}
