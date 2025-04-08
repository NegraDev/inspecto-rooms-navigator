
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PageLayout } from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/use-toast';
import { LogIn, Info, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiConfig } from '@/hooks/useApiConfig';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [petrobrasKey, setPetrobrasKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTestInfo, setShowTestInfo] = useState(false);
  const { login } = useAuth();
  const { mode } = useApiConfig();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obter o caminho de redirecionamento, se houver
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validar formato da chave Petrobras quando informada
      if (petrobrasKey && !/^[A-Za-z0-9]{4}$/.test(petrobrasKey)) {
        toast({
          title: "Formato inválido",
          description: "A chave Petrobras deve ter 4 caracteres alfanuméricos",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const loginData = {
        email,
        password,
        ...(petrobrasKey ? { petrobrasKey } : {})
      };

      // No modo AWS, passaríamos os dados para um serviço de autenticação real
      // Por enquanto, usamos o login simulado com os dados de teste
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate(from);
      } else {
        toast({
          title: "Erro de login",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowTestInfo(!showTestInfo)}
                title="Informações para teste"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
            
            {mode === 'aws' && (
              <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription>
                  Autenticação via AWS Cognito está configurada
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          
          <Tabs defaultValue="credentials">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
              <TabsTrigger value="testInfo" onClick={() => setShowTestInfo(true)}>
                Informações de Teste
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="petrobrasKey">
                      Chave Petrobras <span className="text-xs text-muted-foreground">(4 caracteres alfanuméricos)</span>
                    </Label>
                    <Input
                      id="petrobrasKey"
                      placeholder="Ex: A12B"
                      value={petrobrasKey}
                      onChange={(e) => setPetrobrasKey(e.target.value.toUpperCase())}
                      maxLength={4}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span>Carregando...</span>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>Entrar</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="testInfo">
              <CardContent className="pt-4">
                <div className="rounded-md border p-4 space-y-2">
                  <h3 className="font-medium">Usuários para teste:</h3>
                  
                  <div className="grid gap-2">
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-semibold">Admin</p>
                      <p className="text-sm">Email: admin@example.com</p>
                      <p className="text-sm">Senha: admin123</p>
                      <p className="text-sm">Chave Petrobras: A12B</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Acesso total ao sistema, incluindo gerenciamento de usuários
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-semibold">Supervisor</p>
                      <p className="text-sm">Email: supervisor@example.com</p>
                      <p className="text-sm">Senha: super123</p>
                      <p className="text-sm">Chave Petrobras: S34C</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Acesso a relatórios, gerenciamento de inspeções, sem gerenciamento de usuários
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-semibold">Inspetor</p>
                      <p className="text-sm">Email: inspector@example.com</p>
                      <p className="text-sm">Senha: insp123</p>
                      <p className="text-sm">Chave Petrobras: 78D9</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Acesso limitado a inspeções e visualização de salas
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-2">
                    <p className="font-medium">Modo de Autenticação:</p>
                    <p>Atual: {mode === 'aws' ? 'AWS Cognito' : 'Local (Demo)'}</p>
                    <p className="mt-1">Para alterar o modo de autenticação, acesse as configurações do sistema (apenas administrador).</p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
