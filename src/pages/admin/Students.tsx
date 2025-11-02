// ...existing code...
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import profilePhoto from "@/assets/profile-photo.png";
import { supabase } from "@/lib/supabase";

type Student = {
  id: string;
  full_name: string;
  birth_date?: string | null;
  gender?: string | null;
  id_number?: string | null;
  nationality?: string | null;
  phone?: string | null;
  address?: string | null;
  municipality?: string | null;
  province?: string | null;
  email?: string | null;
  institution?: string | null;
  course?: string | null;
  year?: number | null;
  shift?: string | null;
  final_grade?: number | null;
  status?: string | null;
  photo_url?: string | null;
  documents?: Record<string, any> | null;
  has_certificate?: boolean | null;
  created_at?: string | null;

  // --- new: support student-level doc_* columns added by Profile page
  doc_cv_url?: string | null;
  doc_bi_url?: string | null;
  doc_passport_photo_url?: string | null;
  doc_payment_url?: string | null;
  doc_declaration_url?: string | null;
};

const Students = () => {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  // map studentId -> array of enrolled courses (name + id)
  const [enrollmentsByStudent, setEnrollmentsByStudent] = useState<Record<string, { course_id: string; courseName: string }[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);

  // --- ADDED: delete confirmation state ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null);
  // --- end added ---

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudentDocuments, setViewingStudentDocuments] = useState<Student | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const certificateFileRef = useRef<HTMLInputElement | null>(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const availableCourses = [
    { id: 1, name: "Tecnologia da Informação", price: 150000 },
    { id: 2, name: "Gestão e Administração", price: 120000 },
    { id: 3, name: "Saúde e Enfermagem", price: 180000 },
    { id: 4, name: "Engenharia Civil", price: 200000 },
  ];

  // --- ADDED: courses options loaded from DB for add-form dropdown ---
  const [coursesOptions, setCoursesOptions] = useState<{ id: string; name: string; price?: number | null }[]>([]);
  // --- end added ---

  const [loading, setLoading] = useState(false);

  // Add form + refs
  const [addForm, setAddForm] = useState({
    full_name: "",
    birth_date: "",
    gender: "",
    id_number: "",
    nationality: "Angolana",
    phone: "",
    address: "",
    municipality: "",
    province: "",
    email: "",
    institution: "",
    course: "",
    year: "",
    shift: "",
    final_grade: "",
    status: "Ativo",
  });
  const addPhotoRef = useRef<HTMLInputElement | null>(null);
  const addIdRef = useRef<HTMLInputElement | null>(null);
  const addCertificateRef = useRef<HTMLInputElement | null>(null);
  const addCvRef = useRef<HTMLInputElement | null>(null);
  const addPassportRef = useRef<HTMLInputElement | null>(null);
  const addPaymentRef = useRef<HTMLInputElement | null>(null);
  const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);

  // Edit form + refs
  const [editForm, setEditForm] = useState({
    full_name: "",
    birth_date: "",
    gender: "",
    id_number: "",
    nationality: "",
    phone: "",
    address: "",
    municipality: "",
    province: "",
    email: "",
    institution: "",
    course: "",
    year: "",
    shift: "",
    final_grade: "",
    status: "",
  });
  const editPhotoRef = useRef<HTMLInputElement | null>(null);
  const editIdRef = useRef<HTMLInputElement | null>(null);
  const editCertificateRef = useRef<HTMLInputElement | null>(null);
  const editCvRef = useRef<HTMLInputElement | null>(null);
  const editPassportRef = useRef<HTMLInputElement | null>(null);
  const editPaymentRef = useRef<HTMLInputElement | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchCoursesOptions(); // load courses for dropdown
    fetchEnrollmentsMap(); // load enrollments so admin sees what students subscribed to
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    // request also the doc_* columns (if present)
    const { data, error } = await supabase
      .from("students")
      .select("*, doc_cv_url, doc_bi_url, doc_passport_photo_url, doc_payment_url, doc_declaration_url")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setStudents((data as Student[]) || []);
  };

  // --- ADDED: fetch courses for course dropdown ---
  const fetchCoursesOptions = async () => {
    const { data, error } = await supabase.from("courses").select("id,name,price").order("name", { ascending: true });
    if (error) {
      console.warn("fetchCoursesOptions:", error.message);
      return;
    }
    setCoursesOptions((data as any) || []);
  };
  // --- end added ---

  // fetch enrollments and build map studentId => [courses]
  const fetchEnrollmentsMap = async () => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select("student_id,course_id,created_at,courses(name)")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("fetchEnrollmentsMap error:", error);
        return;
      }
      const map: Record<string, { course_id: string; courseName: string }[]> = {};
      (data || []).forEach((row: any) => {
        const sid = row.student_id;
        const cname = row.courses?.name || row.course_id;
        map[sid] = map[sid] || [];
        map[sid].push({ course_id: row.course_id, courseName: cname });
      });
      setEnrollmentsByStudent(map);
    } catch (err) {
      console.warn("fetchEnrollmentsMap exception:", err);
    }
  };

  // helper: file -> dataURL fallback
  const fileToDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  // upload helper (bucket "student-docs")
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
        return (urlData as any)?.publicUrl || null;
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
    const { data, error } = await supabase
      .from("students")
      .insert({
        full_name: addForm.full_name,
        birth_date: addForm.birth_date || null,
        gender: addForm.gender || null,
        id_number: addForm.id_number || null,
        nationality: addForm.nationality || null,
        phone: addForm.phone || null,
        address: addForm.address || null,
        municipality: addForm.municipality || null,
        province: addForm.province || null,
        email: addForm.email || null,
        institution: addForm.institution || null,
        course: addForm.course || null,
        year: addForm.year ? Number(addForm.year) : null,
        shift: addForm.shift || null,
        final_grade: addForm.final_grade ? Number(addForm.final_grade) : null,
        status: addForm.status || "Ativo",
        has_certificate: false,
      })
      .select()
      .single();

    if (error || !data) {
      setLoading(false);
      toast({ title: "Erro", description: error?.message || "Não foi possível adicionar estagiário", variant: "destructive" });
      return;
    }

    const studentId = (data as Student).id;

    // upload photo
    if (addPhotoFile) {
      const url = await uploadFile(studentId, addPhotoFile, "photo");
      if (url) await supabase.from("students").update({ photo_url: url }).eq("id", studentId);
    }

    // upload documents
    const idFile = addIdRef.current?.files?.[0] || null;
    if (idFile) {
      const url = await uploadFile(studentId, idFile, "id_document");
      if (url) await supabase.from("students").update({ documents: { ...(data as any).documents, id_document_url: url } }).eq("id", studentId);
    }
    const certFile = addCertificateRef.current?.files?.[0] || null;
    if (certFile) {
      const url = await uploadFile(studentId, certFile, "certificate");
      if (url) await supabase.from("students").update({ documents: { ...(data as any).documents, certificate_url: url }, has_certificate: true }).eq("id", studentId);
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
    setAddForm({
      full_name: "",
      birth_date: "",
      gender: "",
      id_number: "",
      nationality: "Angolana",
      phone: "",
      address: "",
      municipality: "",
      province: "",
      email: "",
      institution: "",
      course: "",
      year: "",
      shift: "",
      final_grade: "",
      status: "Ativo",
    });
    setAddPhotoFile(null);
    toast({ title: "Estagiário adicionado", description: "Estagiário criado com sucesso." });
    fetchStudents();
    fetchEnrollmentsMap();
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      full_name: student.full_name || "",
      birth_date: student.birth_date || "",
      gender: student.gender || "",
      id_number: student.id_number || "",
      nationality: student.nationality || "",
      phone: student.phone || "",
      address: student.address || "",
      municipality: student.municipality || "",
      province: student.province || "",
      email: student.email || "",
      institution: student.institution || "",
      course: student.course || "",
      year: student.year ? String(student.year) : "",
      shift: student.shift || "",
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
        birth_date: editForm.birth_date || null,
        gender: editForm.gender || null,
        id_number: editForm.id_number || null,
        nationality: editForm.nationality || null,
        phone: editForm.phone || null,
        address: editForm.address || null,
        municipality: editForm.municipality || null,
        province: editForm.province || null,
        email: editForm.email || null,
        institution: editForm.institution || null,
        course: editForm.course || null,
        year: editForm.year ? Number(editForm.year) : null,
        shift: editForm.shift || null,
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

    const idFile = editIdRef.current?.files?.[0] || null;
    if (idFile) {
      const url = await uploadFile(editingStudent.id, idFile, "id_document");
      if (url) await supabase.from("students").update({ documents: { ...(editingStudent as any).documents, id_document_url: url } }).eq("id", editingStudent.id);
    }
    const certFile = editCertificateRef.current?.files?.[0] || null;
    if (certFile) {
      const url = await uploadFile(editingStudent.id, certFile, "certificate");
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
    toast({ title: "Estagiário atualizado", description: "Informações atualizadas." });
    fetchStudents();
    fetchEnrollmentsMap();
  };

  // REPLACED: open delete dialog instead of using browser confirm
  const handleDeleteStudent = (studentId: string) => {
    setStudentToDeleteId(studentId);
    setIsDeleteDialogOpen(true);
  };

  // --- ADDED: perform actual deletion after user confirms in dialog ---
  const performDeleteStudent = async () => {
    if (!studentToDeleteId) return;
    setLoading(true);
    const { error } = await supabase.from("students").delete().eq("id", studentToDeleteId);
    setLoading(false);
    setIsDeleteDialogOpen(false);
    setStudentToDeleteId(null);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Estagiário removido", description: "Estagiário removido com sucesso." });
    fetchStudents();
    fetchEnrollmentsMap();
  };
  // --- end added ---

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

  const getDocumentUrl = (s: Student | null, key: string) => {
    if (!s) return null;
    // first prefer explicit doc_* columns created by candidate Profile
    const docColumnMap: Record<string, string> = {
      id_document_url: "doc_bi_url",
      certificate_url: "doc_declaration_url",
      cv_url: "doc_cv_url",
      passport_url: "doc_passport_photo_url",
      payment_url: "doc_payment_url",
    };
    const col = docColumnMap[key];
    if (col && (s as any)[col]) return (s as any)[col];

    // then support documents JSON (admin older flow)
    if (s.documents) {
      const docs = s.documents as any;
      // direct keys used by admin flows
      if (docs[key]) {
        if (typeof docs[key] === "string") return docs[key];
        if (docs[key].url) return docs[key].url;
      }
      // legacy alt names
      const altMap: Record<string, string> = {
        id_document_url: "idDocument",
        certificate_url: "certificate",
        cv_url: "cv",
        passport_url: "passportPhoto",
        payment_url: "paymentProof",
      };
      const legacyKey = altMap[key];
      if (legacyKey && docs[legacyKey]) {
        if (typeof docs[legacyKey] === "string") return docs[legacyKey];
        if (docs[legacyKey].url) return docs[legacyKey].url;
      }
    }
    return null;
  };

  const getDocumentName = (s: Student | null, key: string) => {
    if (!s) return null;
    // prefer doc_* columns
    const docColumnMap: Record<string, string> = {
      id_document_url: "doc_bi_url",
      certificate_url: "doc_declaration_url",
      cv_url: "doc_cv_url",
      passport_url: "doc_passport_photo_url",
      payment_url: "doc_payment_url",
    };
    const col = docColumnMap[key];
    const maybeUrl = col ? (s as any)[col] : null;
    if (maybeUrl) {
      try {
        if ((maybeUrl as string).startsWith("data:")) return "Ficheiro enviado";
        return decodeURIComponent(String(maybeUrl).split("/").pop() || String(maybeUrl));
      } catch {
        return String(maybeUrl);
      }
    }

    if (s.documents) {
      const docs = s.documents as any;
      if (docs[key]) {
        try {
          const url = docs[key] as string;
          if (url.startsWith("data:")) return "Ficheiro enviado";
          return decodeURIComponent(url.split("/").pop() || url);
        } catch {
          return String(docs[key]);
        }
      }
      const altMap: Record<string, string> = {
        id_document_url: "idDocument",
        certificate_url: "certificate",
        cv_url: "cv",
        passport_url: "passportPhoto",
        payment_url: "paymentProof",
      };
      const legacyKey = altMap[key];
      if (legacyKey && docs[legacyKey]) {
        const entry = docs[legacyKey];
        if (typeof entry === "string") return entry;
        if (entry.name) return entry.name;
      }
    }
    return null;
  };

  const filteredStudents = students.filter((s) =>
    (s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <p className="text-muted-foreground">Gerencie todos os estagiários cadastrados</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(v) => setIsAddDialogOpen(v)}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar estagiário
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Estagiário</DialogTitle>
              <DialogDescription>Preencha os dados pessoais e académicos do estagiário</DialogDescription>
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

              {/* Dados pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">1. Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nome Completo *</Label><Input value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Data de Nascimento</Label><Input type="date" value={addForm.birth_date} onChange={(e) => setAddForm({ ...addForm, birth_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Sexo/Gênero</Label><Select onValueChange={(v) => setAddForm({ ...addForm, gender: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Nº do Bilhete</Label><Input value={addForm.id_number} onChange={(e) => setAddForm({ ...addForm, id_number: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Nacionalidade</Label><Input value={addForm.nationality} onChange={(e) => setAddForm({ ...addForm, nationality: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Contacto</Label><Input type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Endereço</Label><Input value={addForm.address} onChange={(e) => setAddForm({ ...addForm, address: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Município</Label><Input value={addForm.municipality} onChange={(e) => setAddForm({ ...addForm, municipality: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Província</Label><Input value={addForm.province} onChange={(e) => setAddForm({ ...addForm, province: e.target.value })} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Email</Label><Input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} /></div>
                </div>
              </div>

              {/* Dados académicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">2. Dados Académicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Instituição</Label><Input value={addForm.institution} onChange={(e) => setAddForm({ ...addForm, institution: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Estágio</Label>
                    <Select onValueChange={(v) => setAddForm({ ...addForm, course: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o estágio" /></SelectTrigger>
                      <SelectContent>
                        {coursesOptions.length === 0 ? (
                          availableCourses.map(c => <SelectItem key={c.id} value={c.name}>{c.name}{c.price ? ` — ${Number(c.price).toLocaleString('pt-AO')} Kz` : ""}</SelectItem>)
                        ) : (
                          coursesOptions.map(c => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}{c.price ? ` — ${Number(c.price).toLocaleString('pt-AO')} Kz` : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Ano</Label><Input type="number" value={addForm.year} onChange={(e) => setAddForm({ ...addForm, year: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Turno</Label><Select onValueChange={(v) => setAddForm({ ...addForm, shift: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="manha">Manhã</SelectItem><SelectItem value="tarde">Tarde</SelectItem><SelectItem value="noite">Noite</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Nota Final</Label><Input type="number" value={addForm.final_grade} onChange={(e) => setAddForm({ ...addForm, final_grade: e.target.value })} /></div>
                </div>
              </div>

              {/* Documentos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">3. Documentos</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div><Label>Bilhete de Identidade</Label><input ref={addIdRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                  <div><Label>Declaração / Certificado</Label><input ref={addCertificateRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                  <div><Label>CV</Label><input ref={addCvRef} type="file" accept=".pdf,.doc,.docx" /></div>
                  <div><Label>Fotografia tipo passe</Label><input ref={addPassportRef} type="file" accept=".jpg,.jpeg,.png" /></div>
                  <div><Label>Comprovativo de pagamento</Label><input ref={addPaymentRef} type="file" accept=".pdf,.jpg,.jpeg,.png" /></div>
                </div>
              </div>

              <Button onClick={handleAddStudent} className="w-full" disabled={loading}>{loading ? "A processar..." : "Adicionar Formando"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* estatísticas e lista (mantém resto do layout) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total de estagiários</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Estagiários Ativos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.filter(s => s.status === "Ativo").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Concluídos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.filter(s => s.status === "Concluído").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Média Geral</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(students.filter(s => s.final_grade).reduce((acc, s) => acc + (s.final_grade || 0), 0) / Math.max(1, students.filter(s => s.final_grade).length))}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estagiários</CardTitle>
          <CardDescription>Pesquise e gerencie informações dos estagiários</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por nome, email ou estágio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Estagiário</TableHead><TableHead>Estágio</TableHead><TableHead>Nota Final</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {visibleStudents.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src={s.photo_url || profilePhoto} alt={s.full_name} /><AvatarFallback>{(s.full_name || "").split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <div><div className="font-medium">{s.full_name}</div><div className="text-sm text-muted-foreground">{s.email}</div></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.course}</Badge>
                      {enrollmentsByStudent[s.id] ? (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {enrollmentsByStudent[s.id].map(e => e.courseName).join(", ")}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{s.final_grade ?? <span className="text-muted-foreground">-</span>}</TableCell>
                    <TableCell><Badge variant={s.status === "Ativo" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Ver Documentos" onClick={() => handleViewDocuments(s)}><Eye className="h-4 w-4" /></Button>

                        <Dialog open={isCertificateDialogOpen && certificateStudent?.id === s.id} onOpenChange={(open) => { setIsCertificateDialogOpen(open); if (!open) setCertificateStudent(null); }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Anexar Certificado" onClick={() => { setCertificateStudent(s); setIsCertificateDialogOpen(true); }}><FileText className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Anexar Certificado</DialogTitle><DialogDescription>Anexe o certificado de conclusão para {s.full_name}</DialogDescription></DialogHeader>
                            <div className="space-y-4">
                              <div><Label>Certificado (PDF)</Label><input ref={certificateFileRef} type="file" accept=".pdf" /></div>
                              <Button onClick={() => handleAttachCertificate(certificateStudent, certificateFileRef.current)} className="w-full">Anexar Certificado</Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<PaginationItem key={page}><PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink></PaginationItem>))}
                <PaginationItem><PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Documents dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Documentos de {viewingStudentDocuments?.full_name}</DialogTitle><DialogDescription>Visualize os documentos enviados</DialogDescription></DialogHeader>
          {viewingStudentDocuments && (
            <div className="space-y-4">
              {[
                { key: "id_document_url", label: "Cópia do Bilhete de Identidade" },
                { key: "certificate_url", label: "Declaração / Certificado" },
                { key: "cv_url", label: "Curriculum Vitae" },
                { key: "passport_url", label: "Fotografia tipo passe" },
                { key: "payment_url", label: "Comprovativo de Pagamento" },
              ].map(doc => {
                const url = getDocumentUrl(viewingStudentDocuments, doc.key);
                const name = getDocumentName(viewingStudentDocuments, doc.key) || "Não enviado";
                return (
                  <div key={doc.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" /><div><p className="font-medium">{doc.label}</p><p className="text-sm text-muted-foreground">{name}</p></div></div>
                    {url ? <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}><Eye className="h-4 w-4 mr-2" /> Ver</Button> : <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog (fields populated and documentos mostrados) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Formando</DialogTitle><DialogDescription>Atualize os dados</DialogDescription></DialogHeader>
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
                <div className="space-y-2"><Label>Data de Nascimento</Label><Input type="date" value={editForm.birth_date} onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })} /></div>
                <div className="space-y-2"><Label>Sexo/Gênero</Label><Select onValueChange={(v) => setEditForm({ ...editForm, gender: v })}><SelectTrigger><SelectValue placeholder={editForm.gender || "Selecione"} /></SelectTrigger><SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Nº do Bilhete</Label><Input value={editForm.id_number} onChange={(e) => setEditForm({ ...editForm, id_number: e.target.value })} /></div>
                <div className="space-y-2"><Label>Nacionalidade</Label><Input value={editForm.nationality} onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })} /></div>
                <div className="space-y-2"><Label>Contacto</Label><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Instituição</Label><Input value={editForm.institution} onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })} /></div>
                <div className="space-y-2"><Label>Estágio</Label><Input value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ano</Label><Input type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} /></div>
                <div className="space-y-2"><Label>Turno</Label><Select onValueChange={(v) => setEditForm({ ...editForm, shift: v })}><SelectTrigger><SelectValue placeholder={editForm.shift || "Selecione"} /></SelectTrigger><SelectContent><SelectItem value="manha">Manhã</SelectItem><SelectItem value="tarde">Tarde</SelectItem><SelectItem value="noite">Noite</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Nota Final</Label><Input type="number" value={editForm.final_grade} onChange={(e) => setEditForm({ ...editForm, final_grade: e.target.value })} /></div>
                <div className="space-y-2"><Label>Status</Label><Select onValueChange={(v) => setEditForm({ ...editForm, status: v })}><SelectTrigger><SelectValue placeholder={editForm.status || "Selecione"} /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Concluído">Concluído</SelectItem><SelectItem value="Inativo">Inativo</SelectItem></SelectContent></Select></div>
              </div>

              <div>
                <Label className="text-sm">Documentos existentes</Label>
                <div className="grid gap-2 mt-2">
                  {[
                    { key: "id_document_url", label: "Bilhete de Identidade" },
                    { key: "certificate_url", label: "Declaração / Certificado" },
                    { key: "cv_url", label: "Curriculum Vitae" },
                    { key: "passport_url", label: "Fotografia tipo passe" },
                    { key: "payment_url", label: "Comprovativo de Pagamento" },
                  ].map(d => {
                    const url = getDocumentUrl(editingStudent, d.key);
                    const name = getDocumentName(editingStudent, d.key) || "Não enviado";
                    return (
                      <div key={d.key} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{d.label}</div>
                          <div className="text-sm text-muted-foreground">{name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {url && <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}><Eye className="h-4 w-4 mr-2" />Ver</Button>}
                          {/* file input to replace document */}
                          <input ref={d.key === "id_document_url" ? editIdRef : d.key === "certificate_url" ? editCertificateRef : d.key === "cv_url" ? editCvRef : d.key === "passport_url" ? editPassportRef : editPaymentRef} type="file" className="hidden" id={`edit-file-${d.key}`} />
                          <Button variant="ghost" size="sm" onClick={() => {
                            const el = document.getElementById(`edit-file-${d.key}`) as HTMLInputElement | null;
                            el?.click();
                          }}><Upload className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button onClick={handleEditStudent} className="w-full" disabled={loading}>{loading ? "A processar..." : "Salvar Alterações"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- ADDED: Delete confirmation dialog --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(v) => { setIsDeleteDialogOpen(v); if (!v) setStudentToDeleteId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminação</DialogTitle>
            <DialogDescription>Tem certeza que deseja remover este estagiário? Esta ação é irreversível.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="destructive" className="w-full" onClick={performDeleteStudent} disabled={loading}>
              {loading ? "A processar..." : "Eliminar"}
            </Button>
            <Button className="w-full" onClick={() => { setIsDeleteDialogOpen(false); setStudentToDeleteId(null); }}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* --- end added --- */}
    </div>
  );
};

export default Students;
// ...existing code...