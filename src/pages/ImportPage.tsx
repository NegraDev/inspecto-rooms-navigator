
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ExcelImport } from '@/components/import/ExcelImport';
import { Tower, Room } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, ShieldAlert, FileSpreadsheet, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CsvImport } from '@/components/import/CsvImport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImportPage = () => {
  const [importedData, setImportedData] = useState<{ towers: Tower[], rooms: Room[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Verifique se o usuário é admin (ProtectedRoute já faz essa verificação, mas essa é uma camada a mais de segurança)
  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              Esta página é reservada apenas para administradores do sistema.
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }
  
  const handleImportComplete = (towers: Tower[], rooms: Room[]) => {
    setImportedData({ towers, rooms });
  };
  
  const handleSaveData = () => {
    if (!importedData) return;
    
    setImporting(true);
    
    // Aqui, em uma aplicação real, você enviaria estes dados para um backend
    // Como estamos trabalhando com dados simulados, apenas fingimos que estamos salvando
    setTimeout(() => {
      // Você pode armazenar os dados no localStorage para persistência entre sessões
      localStorage.setItem('importedTowers', JSON.stringify(importedData.towers));
      localStorage.setItem('importedRooms', JSON.stringify(importedData.rooms));
      
      toast({
        title: "Dados salvos com sucesso",
        description: "Os dados importados foram salvos e estão disponíveis no sistema.",
      });
      
      setImporting(false);
      navigate('/rooms');
    }, 1500);
  };
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Área Administrativa - Importar Dados
            </h1>
            <p className="text-muted-foreground">
              Importe dados de salas e torres a partir de arquivos Excel ou CSV
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Files className="h-4 w-4" />
              CSV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel">
            <ExcelImport onImportComplete={handleImportComplete} />
          </TabsContent>
          
          <TabsContent value="csv">
            <CsvImport onImportComplete={handleImportComplete} />
          </TabsContent>
        </Tabs>
        
        {importedData && (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Dados processados com sucesso</AlertTitle>
              <AlertDescription>
                <span className="text-green-700">
                  Foram encontradas {importedData.rooms.length} salas em {importedData.towers.length} torres.
                </span>
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveData} 
                disabled={importing}
                className="px-4 py-2"
              >
                {importing && (
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                )}
                Salvar Dados
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ImportPage;
