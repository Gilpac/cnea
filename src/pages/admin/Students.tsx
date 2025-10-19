import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, FileText, Search, Upload, Eye, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import profilePhoto from "@/assets/profile-photo.png";

const Students = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [viewingStudentDocuments, setViewingStudentDocuments] = useState<any>(null);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [certificateStudent, setCertificateStudent] = useState<any>(null);
  const itemsPerPage = 5;

  const availableCourses = [
    { id: 1, name: "Tecnologia da Informação", price: 150000 },
    { id: 2, name: "Gestão e Administração", price: 120000 },
    { id: 3, name: "Saúde e Enfermagem", price: 180000 },
    { id: 4, name: "Engenharia Civil", price: 200000 },
  ];
  const [students] = useState([
    { 
      id: 1, 
      name: "Kelson Silva", 
      email: "kelson@email.com", 
      course: "Tecnologia da Informação",
      finalGrade: 85,
      status: "Ativo",
      photo: profilePhoto,
      hasCertificate: true,
      documents: {
        idDocument: { name: "Bilhete_Identidade_Kelson.pdf", uploaded: true },
        certificate: { name: "Certificado_Ensino_Kelson.pdf", uploaded: true },
        cv: { name: "CV_Kelson.pdf", uploaded: true },
        passportPhoto: { name: "Foto_Kelson.jpg", uploaded: true },
        paymentProof: { name: "Comprovativo_Pagamento_Kelson.pdf", uploaded: true }
      }
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      email: "maria@email.com", 
      course: "Gestão e Administração",
      finalGrade: 92,
      status: "Concluído",
      photo: profilePhoto,
      hasCertificate: true,
      documents: {
        idDocument: { name: "Bilhete_Identidade_Maria.pdf", uploaded: true },
        certificate: { name: "Certificado_Ensino_Maria.pdf", uploaded: true },
        cv: { name: "CV_Maria.pdf", uploaded: true },
        passportPhoto: { name: "Foto_Maria.jpg", uploaded: true },
        paymentProof: { name: "Comprovativo_Pagamento_Maria.pdf", uploaded: true }
      }
    },
    { 
      id: 3, 
      name: "Pedro Costa", 
      email: "pedro@email.com", 
      course: "Saúde e Enfermagem",
      finalGrade: null,
      status: "Ativo",
      photo: profilePhoto,
      hasCertificate: false,
      documents: {
        idDocument: { name: "Bilhete_Identidade_Pedro.pdf", uploaded: true },
        certificate: { name: "Certificado_Ensino_Pedro.pdf", uploaded: true },
        cv: { name: "CV_Pedro.pdf", uploaded: true },
        passportPhoto: { name: "Foto_Pedro.jpg", uploaded: true },
        paymentProof: { name: "Comprovativo_Pagamento_Pedro.pdf", uploaded: true }
      }
    },
    { 
      id: 4, 
      name: "Ana Paula", 
      email: "ana@email.com", 
      course: "Tecnologia da Informação",
      finalGrade: 88,
      status: "Concluído",
      photo: profilePhoto,
      hasCertificate: true,
      documents: {
        idDocument: { name: "Bilhete_Identidade_Ana.pdf", uploaded: true },
        certificate: { name: "Certificado_Ensino_Ana.pdf", uploaded: true },
        cv: { name: "CV_Ana.pdf", uploaded: true },
        passportPhoto: { name: "Foto_Ana.jpg", uploaded: true },
        paymentProof: { name: "Comprovativo_Pagamento_Ana.pdf", uploaded: true }
      }
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

  const handleAttachCertificate = () => {
    toast({
      title: "Certificado anexado!",
      description: `Certificado anexado com sucesso para ${certificateStudent?.name}.`,
    });
    setIsCertificateDialogOpen(false);
    setCertificateStudent(null);
  };

  const handleViewDocuments = (student: any) => {
    setViewingStudentDocuments(student);
    setIsDocumentsDialogOpen(true);
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Formando</DialogTitle>
              <DialogDescription>Preencha os dados pessoais e académicos do formando</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Foto de Perfil */}
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

              {/* DADOS PESSOAIS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">1. Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input id="fullName" placeholder="Nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexo/Gênero *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">Nº do Bilhete de Identidade *</Label>
                    <Input id="idNumber" placeholder="000000000XX00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidade *</Label>
                    <Input id="nationality" placeholder="Ex: Angolana" defaultValue="Angolana" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contacto Telefónico *</Label>
                    <Input id="phone" type="tel" placeholder="+244 000 000 000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço Completo *</Label>
                    <Input id="address" placeholder="Rua, Nº, Bairro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality">Município *</Label>
                    <Input id="municipality" placeholder="Ex: Luanda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Província *</Label>
                    <Input id="province" placeholder="Ex: Luanda" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                </div>
              </div>

              {/* DADOS ACADÉMICOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">2. Dados Académicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Instituição de Ensino *</Label>
                    <Input id="institution" placeholder="Nome da instituição" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso *</Label>
                    <Select onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.name}>
                            {course.name} - {course.price.toLocaleString('pt-AO')} Kz
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCourse && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Valor do Curso</Label>
                      <div className="text-2xl font-bold text-primary">
                        {availableCourses.find(c => c.name === selectedCourse)?.price.toLocaleString('pt-AO')} Kz
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano de Frequência ou Conclusão *</Label>
                    <Input id="year" type="number" placeholder="2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">Turno *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="noite">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* DOCUMENTOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">3. Documentos</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idDocument">Cópia do Bilhete de Identidade *</Label>
                    <Input id="idDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificate">Declaração ou Certificado da Instituição de Ensino *</Label>
                    <Input id="certificate" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cv">Curriculum Vitae *</Label>
                    <Input id="cv" type="file" accept=".pdf,.doc,.docx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportPhoto">1 Fotografia tipo passe *</Label>
                    <Input id="passportPhoto" type="file" accept=".jpg,.jpeg,.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentProof">Comprovativo de pagamento *</Label>
                    <Input id="paymentProof" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </div>
              </div>

              <Button onClick={handleAddStudent} className="w-full">Adicionar Formando</Button>
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
                {filteredStudents
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((student) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Ver Documentos"
                          onClick={() => handleViewDocuments(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog 
                          open={isCertificateDialogOpen && certificateStudent?.id === student.id} 
                          onOpenChange={(open) => {
                            setIsCertificateDialogOpen(open);
                            if (!open) setCertificateStudent(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Anexar Certificado"
                              onClick={() => setCertificateStudent(student)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Anexar Certificado</DialogTitle>
                              <DialogDescription>
                                Anexe o certificado de conclusão para {student.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="certificate-file">Certificado (PDF) *</Label>
                                <Input id="certificate-file" type="file" accept=".pdf" />
                              </div>
                              <Button onClick={handleAttachCertificate} className="w-full">
                                Anexar Certificado
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(filteredStudents.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredStudents.length / itemsPerPage), p + 1))}
                    className={currentPage === Math.ceil(filteredStudents.length / itemsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para visualizar documentos */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Documentos de {viewingStudentDocuments?.name}</DialogTitle>
            <DialogDescription>Visualize todos os documentos enviados durante a inscrição</DialogDescription>
          </DialogHeader>
          {viewingStudentDocuments && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Cópia do Bilhete de Identidade</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingStudentDocuments.documents?.idDocument?.name || "Não enviado"}
                      </p>
                    </div>
                  </div>
                  {viewingStudentDocuments.documents?.idDocument?.uploaded && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Declaração ou Certificado da Instituição</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingStudentDocuments.documents?.certificate?.name || "Não enviado"}
                      </p>
                    </div>
                  </div>
                  {viewingStudentDocuments.documents?.certificate?.uploaded && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Curriculum Vitae</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingStudentDocuments.documents?.cv?.name || "Não enviado"}
                      </p>
                    </div>
                  </div>
                  {viewingStudentDocuments.documents?.cv?.uploaded && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Fotografia tipo passe</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingStudentDocuments.documents?.passportPhoto?.name || "Não enviado"}
                      </p>
                    </div>
                  </div>
                  {viewingStudentDocuments.documents?.passportPhoto?.uploaded && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Comprovativo de Pagamento</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingStudentDocuments.documents?.paymentProof?.name || "Não enviado"}
                      </p>
                    </div>
                  </div>
                  {viewingStudentDocuments.documents?.paymentProof?.uploaded && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Formando</DialogTitle>
            <DialogDescription>Atualize os dados pessoais e académicos do formando</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-6">
              {/* Foto de Perfil */}
              <div className="space-y-2">
                <Label htmlFor="edit-photo">Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editingStudent.photo} />
                    <AvatarFallback>{editingStudent.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                </div>
              </div>

              {/* DADOS PESSOAIS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">1. Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-fullName">Nome Completo *</Label>
                    <Input id="edit-fullName" defaultValue={editingStudent.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-birthDate">Data de Nascimento *</Label>
                    <Input id="edit-birthDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-gender">Sexo/Gênero *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-idNumber">Nº do Bilhete de Identidade *</Label>
                    <Input id="edit-idNumber" placeholder="000000000XX00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-nationality">Nacionalidade *</Label>
                    <Input id="edit-nationality" placeholder="Ex: Angolana" defaultValue="Angolana" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Contacto Telefónico *</Label>
                    <Input id="edit-phone" type="tel" placeholder="+244 000 000 000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-address">Endereço Completo *</Label>
                    <Input id="edit-address" placeholder="Rua, Nº, Bairro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-municipality">Município *</Label>
                    <Input id="edit-municipality" placeholder="Ex: Luanda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-province">Província *</Label>
                    <Input id="edit-province" placeholder="Ex: Luanda" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-email">E-mail *</Label>
                    <Input id="edit-email" type="email" defaultValue={editingStudent.email} />
                  </div>
                </div>
              </div>

              {/* DADOS ACADÉMICOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">2. Dados Académicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-institution">Instituição de Ensino *</Label>
                    <Input id="edit-institution" placeholder="Nome da instituição" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-course">Curso *</Label>
                    <Input id="edit-course" defaultValue={editingStudent.course} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Ano de Frequência ou Conclusão *</Label>
                    <Input id="edit-year" type="number" placeholder="2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-shift">Turno *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="noite">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-finalGrade">Nota Final</Label>
                    <Input id="edit-finalGrade" type="number" defaultValue={editingStudent.finalGrade || ""} />
                  </div>
                </div>
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
