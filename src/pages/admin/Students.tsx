import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import profilePhoto from "@/assets/profile-photo.png";

const Students = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [students] = useState([
    { 
      id: 1, 
      name: "Kelson Silva", 
      email: "kelson@email.com", 
      course: "Tecnologia da Informação",
      finalGrade: 85,
      status: "Ativo",
      photo: profilePhoto,
      hasCertificate: true
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      email: "maria@email.com", 
      course: "Gestão e Administração",
      finalGrade: 92,
      status: "Concluído",
      photo: profilePhoto,
      hasCertificate: true
    },
    { 
      id: 3, 
      name: "Pedro Costa", 
      email: "pedro@email.com", 
      course: "Saúde e Enfermagem",
      finalGrade: null,
      status: "Ativo",
      photo: profilePhoto,
      hasCertificate: false
    },
    { 
      id: 4, 
      name: "Ana Paula", 
      email: "ana@email.com", 
      course: "Tecnologia da Informação",
      finalGrade: 88,
      status: "Concluído",
      photo: profilePhoto,
      hasCertificate: true
    },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    toast({
      title: "Aluno adicionado!",
      description: "O novo aluno foi adicionado com sucesso.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = () => {
    toast({
      title: "Aluno atualizado!",
      description: "As informações do aluno foram atualizadas.",
    });
    setIsEditDialogOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Formandos</h2>
          <p className="text-muted-foreground">Gerencie todos os alunos cadastrados</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Aluno</DialogTitle>
              <DialogDescription>Preencha os dados do novo aluno</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nome Completo</Label>
                <Input id="studentName" placeholder="Nome do aluno" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input id="studentEmail" type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentCourse">Curso</Label>
                <Input id="studentCourse" placeholder="Nome do curso" />
              </div>
              <Button onClick={handleAddStudent} className="w-full">Adicionar Aluno</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.status === "Ativo").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.status === "Concluído").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.filter(s => s.finalGrade).reduce((acc, s) => acc + s.finalGrade!, 0) / students.filter(s => s.finalGrade).length)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>Pesquise e gerencie informações dos alunos</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nota Final</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.photo} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.course}</Badge>
                    </TableCell>
                    <TableCell>
                      {student.finalGrade ? (
                        <span className="font-medium">{student.finalGrade}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Ativo" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Anexar Certificado">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingStudent(student);
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
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>Atualize os dados do aluno</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-studentName">Nome Completo</Label>
                <Input id="edit-studentName" defaultValue={editingStudent.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-studentEmail">Email</Label>
                <Input id="edit-studentEmail" type="email" defaultValue={editingStudent.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-studentCourse">Curso</Label>
                <Input id="edit-studentCourse" defaultValue={editingStudent.course} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-finalGrade">Nota Final</Label>
                <Input id="edit-finalGrade" type="number" defaultValue={editingStudent.finalGrade || ""} />
              </div>
              <Button onClick={handleEditStudent} className="w-full">Salvar Alterações</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
