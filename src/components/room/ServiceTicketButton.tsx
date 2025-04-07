
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Ticket, Loader2, ExternalLink } from 'lucide-react';
import { Equipment, EquipmentStatus } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useApiConfig } from '@/hooks/useApiConfig';

interface ServiceTicketButtonProps {
  roomId: string;
  roomName: string;
  equipment: Equipment[];
}

interface ServiceNowTicket {
  equipmentId: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  contactName: string;
  contactPhone?: string;
  petrobrasKey?: string; // Adicionando o campo para a chave Petrobrás
  roomId: string;
  roomName: string;
}

export const ServiceTicketButton: React.FC<ServiceTicketButtonProps> = ({
  roomId,
  roomName,
  equipment
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [petrobrasKey, setPetrobrasKey] = useState(''); // Estado para a chave Petrobrás
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<{id: string, url: string} | null>(null);
  
  const { mode } = useApiConfig();
  
  // Filter only equipment with issues
  const problematicEquipment = equipment.filter(
    item => item.status === EquipmentStatus.DAMAGED || 
            item.status === EquipmentStatus.MAINTENANCE
  );
  
  const handleSubmit = async () => {
    // Validação dos campos
    if (!selectedEquipment) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Erro",
        description: "Descreva o problema",
        variant: "destructive"
      });
      return;
    }
    
    if (!contactName.trim()) {
      toast({
        title: "Erro",
        description: "Informe o nome do contato",
        variant: "destructive"
      });
      return;
    }
    
    if (!petrobrasKey.trim()) {
      toast({
        title: "Erro",
        description: "Informe a chave Petrobrás",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Criar objeto do ticket
      const ticketData: ServiceNowTicket = {
        equipmentId: selectedEquipment,
        description,
        priority,
        contactName,
        contactPhone: contactPhone || undefined,
        petrobrasKey: petrobrasKey, // Incluindo a chave Petrobrás no ticket
        roomId,
        roomName
      };
      
      // Integração com ServiceNow
      if (mode === 'aws') {
        // Em produção, usar AWS API Gateway para enviar ao ServiceNow
        try {
          // Simulação da chamada à API para AWS
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Em uma implementação real, aqui seria feita a chamada para a API Gateway
          // const response = await fetch('https://api-gateway-url/servicenow/ticket', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(ticketData)
          // });
          
          // const result = await response.json();
          
          // Simular resposta de sucesso
          const mockResponse = {
            success: true,
            ticketId: `INC${Math.floor(Math.random() * 10000000)}`,
            ticketUrl: `https://servicenow.example.com/ticket/INC${Math.floor(Math.random() * 10000000)}`
          };
          
          // Registrar ticket criado
          setTicketCreated({
            id: mockResponse.ticketId,
            url: mockResponse.ticketUrl
          });
          
          toast({
            title: "Chamado aberto com sucesso",
            description: `Ticket ${mockResponse.ticketId} registrado no ServiceNow.`,
          });
        } catch (error) {
          console.error('Erro ao criar ServiceNow ticket via AWS:', error);
          throw new Error('Falha na comunicação com ServiceNow via AWS API Gateway');
        }
      } else {
        // No modo local, simular criação de chamado
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTicketId = `INC${Math.floor(Math.random() * 10000000)}`;
        
        // Simular resposta de sucesso
        setTicketCreated({
          id: mockTicketId,
          url: `https://dev-servicenow.example.com/ticket/${mockTicketId}`
        });
        
        // Logar os dados que seriam enviados
        console.log('ServiceNow Ticket (simulado):', ticketData);
        
        toast({
          title: "Chamado simulado",
          description: `Em produção, um chamado seria registrado no ServiceNow. ID Simulado: ${mockTicketId}`,
        });
      }
    } catch (error) {
      console.error('Error creating service ticket:', error);
      toast({
        title: "Erro ao abrir chamado",
        description: error instanceof Error ? error.message : "Não foi possível criar o chamado no ServiceNow. Tente novamente.",
        variant: "destructive"
      });
      setTicketCreated(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSelectedEquipment('');
    setDescription('');
    setPriority('medium');
    setContactName('');
    setContactPhone('');
    setPetrobrasKey(''); // Resetando o campo da chave Petrobrás
    setTicketCreated(null);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300); // Reset após animação de fechamento
  };
  
  const openServiceNow = () => {
    if (ticketCreated?.url) {
      window.open(ticketCreated.url, '_blank');
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 flex items-center gap-2"
      >
        <Ticket className="h-4 w-4" />
        Abrir Chamado ServiceNow
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[550px]">
          {!ticketCreated ? (
            <>
              <DialogHeader>
                <DialogTitle>Abrir Chamado no ServiceNow</DialogTitle>
                <DialogDescription>
                  Registre um problema com equipamento da sala {roomName} para suporte técnico.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="equipment">Equipamento com problema <span className="text-red-500">*</span></Label>
                  <Select 
                    value={selectedEquipment} 
                    onValueChange={setSelectedEquipment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {problematicEquipment.length > 0 ? (
                        problematicEquipment.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        equipment.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {problematicEquipment.length === 0 && (
                    <div className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Nenhum equipamento com problemas registrados.</span>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridade <span className="text-red-500">*</span></Label>
                  <Select 
                    value={priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setPriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa - Pode esperar</SelectItem>
                      <SelectItem value="medium">Média - Precisa ser resolvido</SelectItem>
                      <SelectItem value="high">Alta - Urgente</SelectItem>
                      <SelectItem value="critical">Crítica - Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição do problema <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o problema encontrado..."
                    className="resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-4 pt-2 border-t">
                  <h4 className="text-sm font-medium">Informações de Contato</h4>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contactName">Nome do solicitante <span className="text-red-500">*</span></Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="petrobrasKey">Chave Petrobrás <span className="text-red-500">*</span></Label>
                    <Input
                      id="petrobrasKey"
                      value={petrobrasKey}
                      onChange={(e) => setPetrobrasKey(e.target.value)}
                      placeholder="Informe sua chave Petrobrás"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Telefone para contato</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      type="tel"
                    />
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Campos com <span className="text-red-500">*</span> são obrigatórios
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Abrir Chamado"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Chamado Registrado com Sucesso!</DialogTitle>
                <DialogDescription>
                  Seu chamado foi registrado no ServiceNow e será atendido em breve.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-6">
                <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                  <p className="font-semibold text-green-800 mb-1">
                    Número do Chamado:
                  </p>
                  <p className="text-xl font-bold text-green-700 mb-4">
                    {ticketCreated.id}
                  </p>
                  <p className="text-sm text-green-600">
                    {mode === 'aws' 
                      ? "Este chamado foi registrado no ServiceNow e será tratado conforme a prioridade selecionada."
                      : "Este é um chamado simulado. Em produção, seria registrado no ServiceNow."}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={openServiceNow}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir no ServiceNow
                </Button>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleClose} 
                  className="bg-orange-600 hover:bg-orange-700 w-full"
                >
                  Concluir
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
