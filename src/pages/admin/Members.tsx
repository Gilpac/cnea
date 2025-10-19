import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import profilePhoto from "@/assets/profile-photo.png";

const Members = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [members] = useState([
    { 
      id: 1, 
      name: "Edvânio Monteiro", 
      role: "Fundador", 
      email: "edvanio@cnea.ao",
      photo: profilePhoto
    },
    { 
      id: 2, 
      name: "Ana Silva", 
      role: "Coordenadora Pedagógica", 
      email: "ana.silva@cnea.ao",
      photo: profilePhoto
    },
    { 
      id: 3, 
      name: "Carlos Mendes", 
      role: "Diretor Acadêmico", 
      email: "carlos.mendes@cnea.ao",
      photo: profilePhoto
    },
    { 
      id: 4, 
      name: "Maria Santos", 
      role: "Secretária", 
      email: "maria.santos@cnea.ao",
      photo: profilePhoto
    },
  ]);

  const handleAddMember = () => {
    toast({
      title: "Membro adicionado!",
      description: "O novo membro foi adicionado com sucesso.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditMember = () => {
    toast({
      title: "Membro atualizado!",
      description: "As informações do membro foram atualizadas.",
    });
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membros da CNEA</h2>
          <p className="text-muted-foreground">Gerencie todos os membros da organização</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Membro</DialogTitle>
              <DialogDescription>Preencha os dados do novo membro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="photo">Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profilePhoto} />
                    <AvatarFallback>Foto</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Carregar Foto
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Nome do membro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" placeholder="Cargo do membro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@cnea.ao" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input id="phone" type="tel" placeholder="+244 000 000 000" />
              </div>
              <Button onClick={handleAddMember} className="w-full">Adicionar Membro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>Total de {members.length} membros cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.photo} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingMember(member);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(members.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(members.length / itemsPerPage), p + 1))}
                    className={currentPage === Math.ceil(members.length / itemsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>Atualize os dados do membro</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="edit-photo">Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editingMember.photo} />
                    <AvatarFallback>{editingMember.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input id="edit-name" defaultValue={editingMember.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Input id="edit-role" defaultValue={editingMember.role} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={editingMember.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Número de Telefone</Label>
                <Input id="edit-phone" type="tel" placeholder="+244 000 000 000" />
              </div>
              <Button onClick={handleEditMember} className="w-full">Salvar Alterações</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
