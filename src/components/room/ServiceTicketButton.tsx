
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Ticket } from 'lucide-react';
import { Equipment, EquipmentStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter only equipment with issues
  const problematicEquipment = equipment.filter(
    item => item.status === EquipmentStatus.DAMAGED || 
            item.status === EquipmentStatus.MAINTENANCE
  );
  
  const handleSubmit = async () => {
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
    
    setIsSubmitting(true);
    
    try {
      // Here you would integrate with ServiceNow API
      // For now we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Chamado aberto com sucesso",
        description: `Um chamado para o problema no equipamento foi registrado no ServiceNow.`,
      });
      
      setIsOpen(false);
      setSelectedEquipment('');
      setDescription('');
    } catch (error) {
      console.error('Error creating service ticket:', error);
      toast({
        title: "Erro ao abrir chamado",
        description: "Não foi possível criar o chamado no ServiceNow. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Abrir Chamado no ServiceNow</DialogTitle>
            <DialogDescription>
              Registre um problema com equipamento da sala {roomName} para suporte técnico.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="equipment">Equipamento com problema</Label>
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
              <Label htmlFor="description">Descrição do problema</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente o problema encontrado..."
                className="resize-none"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? "Enviando..." : "Abrir Chamado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
