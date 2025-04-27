import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Trash, 
  Edit, 
  Mail, 
  Phone, 
  Building, 
  Shield 
} from 'lucide-react';
import { UserRole, RolePermissionMap } from '@/types';
import { Badge } from '@/components/ui/badge';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@petrobras.com.br',
    role: UserRole.ADMIN,
    department: 'TI',
    petrobrasKey: 'JS7890',
    phone: '(21) 99999-1234'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@petrobras.com.br',
    role: UserRole.MANAGER,
    department: 'Operações',
    petrobrasKey: 'MO4567',
    phone: '(21) 99999-5678'
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos.santos@petrobras.com.br',
    role: UserRole.INSPECTOR,
    department: 'Manutenção',
    petrobrasKey: 'CS1234',
    phone: '(21) 99999-9012'
  },
  {
    id: '4',
    name: 'Ana Pereira',
    email: 'ana.pereira@petrobras.com.br',
    role: UserRole.USER,
    department: 'Administrativo',
    petrobrasKey: 'AP5678',
    phone: '(21) 99999-3456'
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@petrobras.com.br',
    role: UserRole.INSPECTOR,
    department: 'Manutenção',
    petrobrasKey: 'RA9012',
    phone: '(21) 99999-7890'
  }
];

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.INSPECTOR,
    department: '',
    petrobrasKey: '',
    phone: ''
  });
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.petrobrasKey.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddUser = () => {
    const id = `${users.length + 1}`;
    setUsers([...users, { ...newUser, id }]);
    setNewUser({
      name: '',
      email: '',
      role: UserRole.INSPECTOR,
      department: '',
      petrobrasKey: '',
      phone: ''
    });
    setIsAddUserDialogOpen(false);
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 border-red-200';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case UserRole.INSPECTOR:
        return 'bg-green-100 text-green-800 border-green-200';
      case UserRole.USER:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.MANAGER:
        return 'Gerente';
      case UserRole.INSPECTOR:
        return 'Inspetor';
      case UserRole.USER:
        return 'Usuário';
      default:
        return 'Desconhecido';
    }
  };
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários e permissões do sistema
            </p>
          </div>
          
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="manager">Gerentes</SelectItem>
              <SelectItem value="inspector">Inspetores</SelectItem>
              <SelectItem value="user">Usuários</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Chave Petrobras</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.petrobrasKey}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2" />
                      <h3 className="font-medium text-lg">Nenhum usuário encontrado</h3>
                      <p>Tente ajustar os filtros ou adicione um novo usuário.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário. Todos os campos são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petrobrasKey">Chave Petrobras</Label>
                <Input
                  id="petrobrasKey"
                  value={newUser.petrobrasKey}
                  onChange={(e) => setNewUser({...newUser, petrobrasKey: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Gerente</SelectItem>
                    <SelectItem value={UserRole.INSPECTOR}>Inspetor</SelectItem>
                    <SelectItem value={UserRole.USER}>Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {newUser.role && (
                  <>
                    Este cargo tem acesso a: {RolePermissionMap[newUser.role].slice(0, 3).map(p => 
                      p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    ).join(', ')}
                    {RolePermissionMap[newUser.role].length > 3 && ` e mais ${RolePermissionMap[newUser.role].length - 3} permissões`}
                  </>
                )}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Adicionar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 text-red-700 rounded-full h-12 w-12 flex items-center justify-center">
                  <Trash className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default UsersPage;
