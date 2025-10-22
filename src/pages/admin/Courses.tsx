// ...existing code...
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

type Course = {
  id: string;
  name: string;
  category?: string | null;
  duration?: string | null;
  price?: number | null;
  students?: number | null;
  status?: string | null;
  created_at?: string | null;
};

const Courses = () => {
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [addForm, setAddForm] = useState({
    name: "",
    category: "",
    duration: "",
    price: "",
    students: "0",
    status: "Ativo",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    duration: "",
    price: "",
    students: "0",
    status: "Ativo",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setCourses((data as Course[]) || []);
  };

  const handleAddCourse = async () => {
    if (!addForm.name.trim()) {
      toast({ title: "Erro", description: "Nome do curso é obrigatório", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .insert([{
        name: addForm.name,
        category: addForm.category || null,
        duration: addForm.duration || null,
        price: addForm.price ? Number(addForm.price) : null,
        students: addForm.students ? Number(addForm.students) : 0,
        status: addForm.status || "Ativo",
      }])
      .select()
      .single();
    setLoading(false);

    if (error || !data) {
      toast({ title: "Erro", description: error?.message || "Não foi possível adicionar", variant: "destructive" });
      return;
    }

    toast({ title: "Curso adicionado!", description: "O novo curso foi adicionado com sucesso." });
    setIsAddDialogOpen(false);
    setAddForm({ name: "", category: "", duration: "", price: "", students: "0", status: "Ativo" });
    fetchCourses();
  };

  const openEditDialog = (c: Course) => {
    setEditingCourse(c);
    setEditForm({
      name: c.name || "",
      category: c.category || "",
      duration: c.duration || "",
      price: c.price ? String(c.price) : "",
      students: c.students ? String(c.students) : "0",
      status: c.status || "Ativo",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditCourse = async () => {
    if (!editingCourse) return;
    if (!editForm.name.trim()) {
      toast({ title: "Erro", description: "Nome do curso é obrigatório", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("courses")
      .update({
        name: editForm.name,
        category: editForm.category || null,
        duration: editForm.duration || null,
        price: editForm.price ? Number(editForm.price) : null,
        students: editForm.students ? Number(editForm.students) : 0,
        status: editForm.status || "Ativo",
      })
      .eq("id", editingCourse.id);
    setLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Curso atualizado!", description: "As informações do curso foram atualizadas." });
    setIsEditDialogOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Tem certeza que deseja remover este curso?")) return;
    setLoading(true);
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Curso removido", description: "Curso removido com sucesso." });
    fetchCourses();
  };

  const totalPages = Math.max(1, Math.ceil(courses.length / itemsPerPage));
  const visibleCourses = courses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">Gerencie todos os cursos oferecidos pela CNEA</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Curso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Nome do Curso</Label>
                <Input id="courseName" value={addForm.name} onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do curso" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" value={addForm.category} onChange={(e) => setAddForm(f => ({ ...f, category: e.target.value }))} placeholder="Ex: Curso Técnico" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Input id="duration" value={addForm.duration} onChange={(e) => setAddForm(f => ({ ...f, duration: e.target.value }))} placeholder="Ex: 2 anos" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Valor do Curso (Kz)</Label>
                  <Input id="price" type="number" value={addForm.price} onChange={(e) => setAddForm(f => ({ ...f, price: e.target.value }))} placeholder="Ex: 150000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Alunos</Label>
                  <Input id="students" type="number" value={addForm.students} onChange={(e) => setAddForm(f => ({ ...f, students: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={addForm.status} onChange={(e) => setAddForm(f => ({ ...f, status: e.target.value }))} />
              </div>
              <Button onClick={handleAddCourse} className="w-full" disabled={loading}>{loading ? "Salvando..." : "Adicionar Curso"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.filter(c => c.status === "Ativo").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.reduce((acc, c) => acc + (c.students || 0), 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.students || 0), 0) / courses.length) : 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
          <CardDescription>Visualize e gerencie todos os cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Curso</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{course.duration}</TableCell>
                  <TableCell className="font-medium">{(course.price || 0).toLocaleString('pt-AO')} Kz</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === "Ativo" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(course)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course.id)}>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(v) => { setIsEditDialogOpen(v); if (!v) setEditingCourse(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-courseName">Nome do Curso</Label>
                <Input id="edit-courseName" value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input id="edit-category" value={editForm.category} onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duração</Label>
                <Input id="edit-duration" value={editForm.duration} onChange={(e) => setEditForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Valor do Curso (Kz)</Label>
                  <Input id="edit-price" type="number" value={editForm.price} onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-students">Alunos</Label>
                  <Input id="edit-students" type="number" value={editForm.students} onChange={(e) => setEditForm(f => ({ ...f, students: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Input id="edit-status" value={editForm.status} onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))} />
              </div>
              <Button onClick={handleEditCourse} className="w-full" disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
// ...existing code...