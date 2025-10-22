import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, FileText, Search, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import profilePhoto from "@/assets/profile-photo.png";
import { supabase } from "@/lib/supabase";

type Student = {
  id: string;
  full_name: string;
  email?: string | null;
  course?: string | null;
  final_grade?: number | null;
  status?: string | null;
  photo_url?: string | null;
  documents?: {
    id_document_url?: string | null;
    certificate_url?: string | null;
    cv_url?: string | null;
    passport_url?: string | null;
    payment_url?: string | null;
  } | null;
  has_certificate?: boolean | null;
  created_at?: string | null;
};

const Students = () => {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudentDocuments, setViewingStudentDocuments] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const availableCourses = [
    { id: 1, name: "Tecnologia da Informação", price: 150000 },
    { id: 2, name: "Gestão e Administração", price: 120000 },
    { id: 3, name: "Saúde e Enfermagem", price: 180000 },
    { id: 4, name: "Engenharia Civil", price: 200000 },
  ];

  const [loading, setLoading] = useState(false);

  // Add form state + file refs
  const [addForm, setAddForm] = useState({
    full_name: "",
    email: "",
    course: "",
    final_grade: "",
    status: "Ativo",
  });
  const addPhotoRef = useRef<HTMLInputElement | null>(null);
  const addIdDocRef = useRef<HTMLInputElement | null>(null);
  const addCertificateRef = useRef<HTMLInputElement | null>(null);
  const addCvRef = useRef<HTMLInputElement | null>(null);
  const addPassportRef = useRef<HTMLInputElement | null>(null);
  const addPaymentRef = useRef<HTMLInputElement | null>(null);
  const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);

  // Edit form state + file refs
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    course: "",
    final_grade: "",
    status: "",
  });
  const editPhotoRef = useRef<HTMLInputElement | null>(null);
  const editIdDocRef = useRef<HTMLInputElement | null>(null);
  const editCertificateRef = useRef<HTMLInputElement | null>(null);
  const editCvRef = useRef<HTMLInputElement | null>(null);
  const editPassportRef = useRef<HTMLInputElement | null>(null);
  const editPaymentRef = useRef<HTMLInputElement | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setStudents((data as Student[]) || []);
  };

  // helper: convert file -> dataURL fallback
  const fileToDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  // upload file to storage 'student-docs' or fallback to dataURL
  const uploadFile = async (studentId: string, file: File | null, folder: string) => {
    if (!file) return null;
    try {
      const path = `${studentId}/${folder}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("student-docs").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("student-docs").getPublicUrl(path);
        const publicUrl = (urlData as any)?.publicUrl || null;
        return publicUrl;
      }
      console.warn("Upload error:", uploadError);
      return await fileToDataUrl(file);
    } catch (err) {
      console.warn("uploadFile error:", err);
      try {
        return await fileToDataUrl(file);
      } catch {
        return null;
      }
    }
  };

  const handleAddStudent = async () => {
    if (!addForm.full_name) {
      toast({ title: "Erro", description: "Nome obrigatório", variant: "destructive" });
      return;
    }
    setLoading(true);
    // insert base student
    const { data, error } = await supabase
      .from("students")
      .insert({
        full_name: addForm.full_name,
        email: addForm.email || null,
        course: addForm.course || null,
        final_grade: addForm.final_grade ? Number(addForm.final_grade) : null,
        status: addForm.status || "Ativo",
        has_certificate: false,
      })
      .select()
      .single();

    if (error || !data) {
      setLoading(false);
      toast({ title: "Erro", description: error?.message || "Não foi possível adicionar aluno", variant: "destructive" });
      return;
    }

    const studentId = (data as Student).id;

    // upload photo and documents (if provided)
    if (addPhotoFile) {
      const url = await uploadFile(studentId, addPhotoFile, "photo");
      if (url) await supabase.from("students").update({ photo_url: url }).eq("id", studentId);
    }

    const idDocFile = addIdDocRef.current?.files?.[0] || null;
    if (idDocFile) {
      const url = await uploadFile(studentId, idDocFile, "id_document");
      if (url) await supabase.from("students").update({ "documents->>id_document_url": url }).eq("id", studentId);
      // better: update json field properly
      await supabase.from("students").update({
        documents: { ...(data as any).documents, id_document_url: url },
      }).eq("id", studentId);
    }

    const certificateFile = addCertificateRef.current?.files?.[0] || null;
    if (certificateFile) {
      const url = await uploadFile(studentId, certificateFile, "certificate");
      if (url) {
        await supabase.from("students").update({
          documents: { ...(data as any).documents, certificate_url: url },
          has_certificate: true,
        }).eq("id", studentId);
      }
    }

    const cvFile = addCvRef.current?.files?.[0] || null;
    if (cvFile) {
      const url = await uploadFile(studentId, cvFile, "cv");
      if (url) await supabase.from("students").update({ documents: { ...(data as any).documents, cv_url: url } }).eq("id", studentId);
    }

    const passportFile = addPassportRef.current?.files?.[0] || null;
    if (passportFile) {
      const url = await uploadFile(studentId, passportFile, "passport");
      if (url) await supabase.from("students").update({ documents: { ...(data as any).documents, passport_url: url } }).eq("id", studentId);
    }

    const paymentFile = addPaymentRef.current?.files?.[0] || null;
    if (paymentFile) {
      const url = await uploadFile(studentId, paymentFile, "payment");
      if (url) await supabase.from("students").update({ documents: { ...(data as any).documents, payment_url: url } }).eq("id", studentId);
    }

    setLoading(false);
    setIsAddDialogOpen(false);
    setAddForm({ full_name: "", email: "", course: "", final_grade: "", status: "Ativo" });
    setAddPhotoFile(null);
    toast({ title: "Aluno adicionado", description: "Formando criado com sucesso." });
    fetchStudents();
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      full_name: student.full_name || "",
      email: student.email || "",
      course: student.course || "",
      final_grade: student.final_grade ? String(student.final_grade) : "",
      status: student.status || "Ativo",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;
    setLoading(true);
    const { error } = await supabase
      .from("students")
      .update({
        full_name: editForm.full_name,
        email: editForm.email || null,
        course: editForm.course || null,
        final_grade: editForm.final_grade ? Number(editForm.final_grade) : null,
        status: editForm.status || null,
      })
      .eq("id", editingStudent.id);

    if (error) {
      setLoading(false);
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    if (editPhotoFile) {
      const url = await uploadFile(editingStudent.id, editPhotoFile, "photo");
      if (url) await supabase.from("students").update({ photo_url: url }).eq("id", editingStudent.id);
    }

    // other doc uploads if present
    const idDocFile = editIdDocRef.current?.files?.[0] || null;
    if (idDocFile) {
      const url = await uploadFile(editingStudent.id, idDocFile, "id_document");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, id_document_url: url } }).eq("id", editingStudent.id);
    }
    const certificateFile = editCertificateRef.current?.files?.[0] || null;
    if (certificateFile) {
      const url = await uploadFile(editingStudent.id, certificateFile, "certificate");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, certificate_url: url }, has_certificate: true }).eq("id", editingStudent.id);
    }
    const cvFile = editCvRef.current?.files?.[0] || null;
    if (cvFile) {
      const url = await uploadFile(editingStudent.id, cvFile, "cv");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, cv_url: url } }).eq("id", editingStudent.id);
    }
    const passportFile = editPassportRef.current?.files?.[0] || null;
    if (passportFile) {
      const url = await uploadFile(editingStudent.id, passportFile, "passport");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, passport_url: url } }).eq("id", editingStudent.id);
    }
    const paymentFile = editPaymentRef.current?.files?.[0] || null;
    if (paymentFile) {
      const url = await uploadFile(editingStudent.id, paymentFile, "payment");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, payment_url: url } }).eq("id", editingStudent.id);
    }

    setLoading(false);
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    setEditPhotoFile(null);
    toast({ title: "Aluno atualizado", description: "Informações atualizadas." });
    fetchStudents();
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Tem certeza que deseja remover este aluno?")) return;
    setLoading(true);
    const { error } = await supabase.from("students").delete().eq("id", studentId);
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Aluno removido", description: "Aluno removido com sucesso." });
    fetchStudents();
  };

  const handleViewDocuments = (student: Student) => {
    setViewingStudentDocuments(student);
    setIsDocumentsDialogOpen(true);
  };

  const handleAttachCertificate = async (student: Student | null, fileInput?: HTMLInputElement | null) => {
    if (!student || !fileInput) return;
    const file = fileInput.files?.[0];
    if (!file) {
      toast({ title: "Erro", description: "Selecione um ficheiro PDF", variant: "destructive" });
      return;
    }
    setLoading(true);
    const url = await uploadFile(student.id, file, "certificate");
    if (url) {
      await supabase.from("students").update({ documents: { ...(student as any).documents, certificate_url: url }, has_certificate: true }).eq("id", student.id);
      toast({ title: "Certificado anexado", description: "Certificado enviado com sucesso." });
      setIsCertificateDialogOpen(false);
      setCertificateStudent(null);
      fetchStudents();
    } else {
      toast({ title: "Erro", description: "Não foi possível anexar o certificado", variant: "destructive" });
    }
    setLoading(false);
  };

  const filteredStudents = students.filter((s) =>
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.course || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const visibleStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              {/* Foto */}
              <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={addPhotoFile ? URL.createObjectURL(addPhotoFile) : profilePhoto} />
                    <AvatarFallback>Foto</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <input ref={addPhotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setAddPhotoFile(e.target.files?.[0] || null)} />
                    <Button variant="outline" size="sm" onClick={() => addPhotoRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Carregar Foto
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dados essenciais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Curso</Label>
                  <Select onValueChange={(v) => setAddForm({ ...addForm, course: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o curso" /></SelectTrigger>
                    <SelectContent>
                      {availableCourses.map((c) => (<SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nota Final</Label>
                  <Input value={addForm.final_grade} onChange={(e) => setAddForm({ ...addForm, final_grade: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Documentos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Bilhete de Identidade</Label>
                      <input ref={addIdDocRef} type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                    <div>
                      <Label className="text-xs">Declaração / Certificado</Label>
                      <input ref={addCertificateRef} type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                    <div>
                      <Label className="text-xs">CV</Label>
                      <input ref={addCvRef} type="file" accept=".pdf,.doc,.docx" />
                    </div>
                    <div>
                      <Label className="text-xs">Fotografia tipo passe</Label>
                      <input ref={addPassportRef} type="file" accept=".jpg,.jpeg,.png" />
                    </div>
                    <div>
                      <Label className="text-xs">Comprovativo Pagamento</Label>
                      <input ref={addPaymentRef} type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleAddStudent} className="w-full" disabled={loading}>{loading ? "A processar..." : "Adicionar Formando"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total de Alunos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Alunos Ativos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.filter(s => s.status === "Ativo").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Concluídos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.filter(s => s.status === "Concluído").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Média Geral</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(students.filter(s => s.final_grade).reduce((acc, s) => acc + (s.final_grade || 0), 0) / Math.max(1, students.filter(s => s.final_grade).length))}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>Pesquise e gerencie informações dos alunos</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por nome, email ou curso..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
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
                {visibleStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src={student.photo_url || profilePhoto} alt={student.full_name} /><AvatarFallback>{(student.full_name || "").split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium">{student.full_name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{student.course}</Badge></TableCell>
                    <TableCell>{student.final_grade ?? <span className="text-muted-foreground">-</span>}</TableCell>
                    <TableCell><Badge variant={student.status === "Ativo" ? "default" : "secondary"}>{student.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Ver Documentos" onClick={() => handleViewDocuments(student)}><Eye className="h-4 w-4" /></Button>

                        <Dialog open={isCertificateDialogOpen && certificateStudent?.id === student.id} onOpenChange={(open) => { setIsCertificateDialogOpen(open); if (!open) setCertificateStudent(null); }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Anexar Certificado" onClick={() => setCertificateStudent(student)}><FileText className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Anexar Certificado</DialogTitle><DialogDescription>Anexe o certificado de conclusão para {student.full_name}</DialogDescription></DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2"><Label>Certificado (PDF)</Label><input id="cert-file" type="file" accept=".pdf" /></div>
                              <Button onClick={() => handleAttachCertificate(student, document.getElementById("cert-file") as HTMLInputElement | null)} className="w-full">Anexar Certificado</Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => { openEditDialog(student); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                <PaginationItem><PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} /></PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}><PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink></PaginationItem>
                ))}
                <PaginationItem><PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Documents dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Documentos de {viewingStudentDocuments?.full_name}</DialogTitle><DialogDescription>Visualize todos os documentos enviados durante a inscrição</DialogDescription></DialogHeader>
          {viewingStudentDocuments && (
            <div className="space-y-4">
              {[
                { key: "id_document_url", label: "Cópia do Bilhete de Identidade" },
                { key: "certificate_url", label: "Declaração / Certificado" },
                { key: "cv_url", label: "Curriculum Vitae" },
                { key: "passport_url", label: "Fotografia tipo passe" },
                { key: "payment_url", label: "Comprovativo de Pagamento" },
              ].map((doc) => {
                const url = (viewingStudentDocuments.documents as any)?.[doc.key];
                return (
                  <div key={doc.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.label}</p>
                        <p className="text-sm text-muted-foreground">{url ? url.split("/").pop() : "Não enviado"}</p>
                      </div>
                    </div>
                    {url ? (
                      <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
                        <Eye className="h-4 w-4 mr-2" /> Ver
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Formando</DialogTitle><DialogDescription>Atualize os dados pessoais e académicos do formando</DialogDescription></DialogHeader>
          {editingStudent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20"><AvatarImage src={editPhotoFile ? URL.createObjectURL(editPhotoFile) : (editingStudent.photo_url || profilePhoto)} /><AvatarFallback>{(editingStudent.full_name || "").split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex flex-col">
                    <input ref={editPhotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setEditPhotoFile(e.target.files?.[0] || null)} />
                    <Button variant="outline" size="sm" onClick={() => editPhotoRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Alterar Foto</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome</Label><Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Curso</Label><Input value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} /></div>
                <div className="space-y-2"><Label>Nota Final</Label><Input value={editForm.final_grade} onChange={(e) => setEditForm({ ...editForm, final_grade: e.target.value })} /></div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Documentos (opcional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><Label className="text-xs">Bilhete de Identidade</Label><input ref={editIdDocRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                    <div><Label className="text-xs">Declaração / Certificado</Label><input ref={editCertificateRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                    <div><Label className="text-xs">CV</Label><input ref={editCvRef} type="file" accept=".pdf,.doc,.docx" /></div>
                    <div><Label className="text-xs">Fotografia tipo passe</Label><input ref={editPassportRef} type="file" accept=".jpg,.jpeg,.png" /></div>
                    <div><Label className="text-xs">Comprovativo Pagamento</Label><input ref={editPaymentRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                  </div>
                </div>
              </div>

              <Button onClick={handleEditStudent} className="w-full" disabled={loading}>{loading ? "A processar..." : "Salvar Alterações"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;