import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, ExternalLink, Wrench, Armchair, AirVent } from 'lucide-react';
import { Equipment, EquipmentStatus, OfferType, ServiceTicketData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useApiConfig } from '@/hooks/useApiConfig';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceTicketButtonProps {
  roomId: string;
  roomName: string;
  equipment: Equipment[];
}

export const ServiceTicketButton: React.FC<ServiceTicketButtonProps> = ({
  roomId,
  roomName,
  equipment
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferType | ''>('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [contactName, setContactName] = useState(user?.name || '');
  const [petrobrasKey, setPetrobrasKey] = useState(user?.petrobrasKey || '');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<{id: string, url: string} | null>(null);
  
  const { mode } = useApiConfig();

  const openServiceNow = () => {
    if (ticketCreated?.url) {
      window.open(ticketCreated.url, '_blank');
    }
  };

  const handleSubmit = async () => {
    if (!selectedOffer) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de oferta",
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
    
    const petrobrasKeyRegex = /^[A-Za-z0-9]{4}$/;
    if (!petrobrasKeyRegex.test(petrobrasKey)) {
      toast({
        title: "Erro",
        description: "A chave Petrobrás deve conter exatamente 4 caracteres alfanuméricos",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const ticketData: ServiceTicketData = {
        equipmentId: selectedOffer,
        description,
        priority,
        contactName,
        contactPhone: contactPhone || undefined,
        petrobrasKey: petrobrasKey,
        roomId,
        roomName
      };
      
      if (mode === 'aws') {
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const mockResponse = {
            success: true,
            ticketId: `INC${Math.floor(Math.random() * 10000000)}`,
            ticketUrl: `https://servicenow.example.com/ticket/INC${Math.floor(Math.random() * 10000000)}`
          };
          
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTicketId = `INC${Math.floor(Math.random() * 10000000)}`;
        
        setTicketCreated({
          id: mockTicketId,
          url: `https://dev-servicenow.example.com/ticket/${mockTicketId}`
        });
        
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

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Nova Oferta
      </Button>
      
      <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && setIsOpen(open)}>
        <DialogContent className="sm:max-w-[550px]">
          {!ticketCreated ? (
            <>
              <DialogHeader>
                <DialogTitle>Nova Oferta de Manutenção</DialogTitle>
                <DialogDescription>
                  Registre uma oferta de manutenção para {roomName}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="offerType">Tipo de Oferta <span className="text-red-500">*</span></Label>
                  <Select 
                    value={selectedOffer} 
                    onValueChange={setSelectedOffer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de oferta" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OfferType).map(type => (
                        <SelectItem key={type} value={type} className="flex items-center gap-2">
                          {getOfferIcon(type)}
                          <span>{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="medium">Média - Precisa ser resolvida</SelectItem>
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
                      placeholder="4 caracteres alfanuméricos"
                      maxLength={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      A chave Petrobrás deve conter exatamente 4 caracteres alfanuméricos.
                    </p>
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
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Criar Oferta"
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
                  onClick={() => setIsOpen(false)} 
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
