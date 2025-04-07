
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useApiConfig } from '@/hooks/useApiConfig';
import { AwsConfig } from '@/types';

// Esquema de validação para o formulário
const awsConfigSchema = z.object({
  mode: z.enum(['aws', 'local']),
  apiKey: z.string().optional(),
  userPoolId: z.string().optional(),
  clientId: z.string().optional(),
  region: z.string().optional()
});

export const AwsConfigPanel: React.FC = () => {
  const { mode, updateConfig } = useApiConfig();
  
  const form = useForm<z.infer<typeof awsConfigSchema>>({
    resolver: zodResolver(awsConfigSchema),
    defaultValues: {
      mode: mode || 'local',
      apiKey: '',
      userPoolId: '',
      clientId: '',
      region: ''
    }
  });

  const onSubmit = (data: z.infer<typeof awsConfigSchema>) => {
    try {
      updateConfig(data);
      toast({
        title: "Configurações atualizadas",
        description: `Modo alterado para: ${data.mode === 'aws' ? 'AWS' : 'Local'}`
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar configurações",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  onCheckedChange={(checked) => 
                    field.onChange(checked ? 'aws' : 'local')
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Campos adicionais para configuração AWS */}
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="Insira sua API Key" {...field} />
              </FormControl>
              <FormDescription>
                Chave de API para serviços AWS
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userPoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Pool ID</FormLabel>
              <FormControl>
                <Input placeholder="Insira o User Pool ID" {...field} />
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

        <Button type="submit">Salvar Configurações</Button>
      </form>
    </Form>
  );
};
