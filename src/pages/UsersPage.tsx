
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserRole, UserPermission } from '@/types';
import { UserPlus, Trash2, ShieldAlert, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipo para os usuários da página de gerenciamento
type UserData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  petrobrasKey: string;
};

// Usuários de exemplo (em uma aplicação real, seriam carregados de uma API)
const demoUsers: UserData[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    petrobrasKey: 'A12B',
  },
  {
    id: '2',
    name: 'Carlos Supervisor',
    email: 'supervisor@example.com',
    role: UserRole.SUPERVISOR,
    petrobrasKey: 'S34C',
  },
  {
    id: '3',
    name: 'Maria Inspetora',
    email: 'inspector@example.com',
    role: UserRole.INSPECTOR,
    petrobrasKey: '78D9',
  }
];

const UsersPage = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState<UserData[]>(demoUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserData>>({
    name: '',
    email: '',
    role: UserRole.INSPECTOR,
    petrobrasKey: '',
  });
  
  // Verificar se o usuário tem permissão para gerenciar usuários
  const canManageUsers = hasPermission(UserPermission.MANAGE_USERS);
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.petrobrasKey) {
      toast({
        title: "Erro ao adicionar usuário",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    // Validar o formato da chave Petrobrás
    const petrobrasKeyRegex = /^[A-Za-z0-9]{4}$/;
    if (!petrobrasKeyRegex.test(newUser.petrobrasKey)) {
      toast({
        title: "Erro",
        description: "A chave Petrobrás deve conter exatamente 4 caracteres alfanuméricos",
        variant: "destructive"
      });
      return;
    }
    
    const newUserData = {
      ...newUser,
      id: `${users.length + 1}`, // Em uma aplicação real, seria gerado pelo backend
    } as UserData;
    
    setUsers([...users, newUserData]);
    setIsDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'inspector',
      petrobrasKey: '',
    });
    
    toast({
      title: "Usuário adicionado com sucesso",
      description: `${newUser.name} foi adicionado como ${newUser.role}`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    // Não permitir que o usuário exclua sua própria conta
    if (userId === user?.id) {
      toast({
        title: "Operação não permitida",
        description: "Você não pode excluir sua própria conta",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Usuário removido com sucesso",
    });
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'supervisor':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'inspector':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-muted-foreground">
              {canManageUsers 
                ? "Adicione, edite e remova usuários do sistema"
                : "Visualize os usuários do sistema"}
            </p>
          </div>
          
          {canManageUsers && (
            <Button onClick={() => setIsDialogOpen(true)} className="ml-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Chave Petrobrás</TableHead>
                  {canManageUsers && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role === UserRole.ADMIN && 'Administrador'}
                        {user.role === UserRole.SUPERVISOR && 'Supervisor'}
                        {user.role === UserRole.INSPECTOR && 'Inspetor'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.petrobrasKey}</TableCell>
                    {canManageUsers && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === '1'} // Não permitir exclusão do admin principal
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para adicionar um novo usuário ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="petrobrasKey" className="text-right">
                Chave Petrobrás
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="petrobrasKey"
                  value={newUser.petrobrasKey}
                  onChange={(e) => setNewUser({...newUser, petrobrasKey: e.target.value.toUpperCase()})}
                  maxLength={4}
                  placeholder="4 caracteres alfanuméricos"
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  A chave deve conter exatamente 4 caracteres (letras e números).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Função
              </Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.INSPECTOR}>Inspetor</SelectItem>
                  <SelectItem value={UserRole.SUPERVISOR}>Supervisor</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default UsersPage;
