
import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AwsConfigPanel } from '@/components/settings/AwsConfigPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useApiConfig } from '@/hooks/useApiConfig';

export default function SettingsPage() {
  const { mode } = useApiConfig();
  const [activeTab, setActiveTab] = useState<string>('aws');

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações do aplicativo e da integração com AWS
            </p>
          </div>

          <Separator />

          <div className="flex-1 space-y-4">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="aws">
                  AWS Free Tier
                </TabsTrigger>
                <TabsTrigger value="app">
                  Aplicativo
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="aws" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-6">
                    <AwsConfigPanel />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="app" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-6">
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">
                        Configurações adicionais do aplicativo serão implementadas aqui.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Modo atual: {mode === 'aws' ? 'AWS' : 'Local'}</h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'aws' 
                ? 'O aplicativo está usando serviços AWS para armazenamento e processamento de dados.' 
                : 'O aplicativo está usando dados locais para testes e desenvolvimento.'}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
