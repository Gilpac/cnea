// ...existing code...
import { useEffect, useState, useRef } from "react";
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
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import profilePhoto from "@/assets/profile-photo.png";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  full_name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo_url?: string | null;
  created_at?: string;
};

const Members = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // dialogs / forms
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [addForm, setAddForm] = useState({
    full_name: "",
    role: "",
    email: "",
    phone: "",
  });
  const [editForm, setEditForm] = useState({
    full_name: "",
    role: "",
    email: "",
    phone: "",
  });

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [editFileToUpload, setEditFileToUpload] = useState<File | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const [addPreviewUrl, setAddPreviewUrl] = useState<string | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
    // clean up previews on unmount
    return () => {
      if (addPreviewUrl) URL.revokeObjectURL(addPreviewUrl);
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setMembers((data as Member[]) || []);
  };

  const uploadAvatar = async (memberId: string, file: File | null) => {
    if (!file) return null;
    try {
      const path = `${memberId}/${Date.now()}-${file.name}`;
      // upload retorna { data, error }
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.warn("Storage upload error:", uploadError.message);
        return null;
      }

      // getPublicUrl retorna { data: { publicUrl }, error? }
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = (urlData && (urlData as any).publicUrl) || null;

      return publicUrl;
    } catch (err) {
      console.warn("uploadAvatar error:", err);
      return null;
    }
  };

  const handleAddMember = async () => {
    if (!addForm.full_name) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    setLoading(true);
    // inserir sem photo_url primeiro
    const { data, error } = await supabase
      .from("members")
      .insert({
        full_name: addForm.full_name,
        role: addForm.role || null,
        email: addForm.email || null,
        phone: addForm.phone || null,
      })
      .select()
      .single();

    if (error || !data) {
      setLoading(false);
      toast({ title: "Erro", description: error?.message || "Não foi possível adicionar membro", variant: "destructive" });
      return;
    }

    // se tiver ficheiro, faz upload e actualiza o membro com photo_url
    if (fileToUpload) {
      const publicUrl = await uploadAvatar((data as Member).id, fileToUpload);
      if (publicUrl) {
        await supabase.from("members").update({ photo_url: publicUrl }).eq("id", (data as Member).id);
      }
    }

    setLoading(false);
    setIsAddDialogOpen(false);
    setAddForm({ full_name: "", role: "", email: "", phone: "" });
    if (addPreviewUrl) {
      URL.revokeObjectURL(addPreviewUrl);
      setAddPreviewUrl(null);
    }
    setFileToUpload(null);
    toast({ title: "Membro adicionado!", description: "O novo membro foi adicionado com sucesso." });
    fetchMembers();
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      full_name: member.full_name || "",
      role: member.role || "",
      email: member.email || "",
      phone: member.phone || "",
    });
    setEditPreviewUrl(member.photo_url || null);
    setIsEditDialogOpen(true);
  };

  const handleEditMember = async () => {
    if (!editingMember) return;
    setLoading(true);
    const { error } = await supabase
      .from("members")
      .update({
        full_name: editForm.full_name,
        role: editForm.role || null,
        email: editForm.email || null,
        phone: editForm.phone || null,
      })
      .eq("id", editingMember.id);

    if (error) {
      setLoading(false);
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    if (editFileToUpload) {
      const publicUrl = await uploadAvatar(editingMember.id, editFileToUpload);
      if (publicUrl) {
        await supabase.from("members").update({ photo_url: publicUrl }).eq("id", editingMember.id);
      }
    }

    setLoading(false);
    setIsEditDialogOpen(false);
    setEditingMember(null);
    if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editPreviewUrl);
    }
    setEditFileToUpload(null);
    setEditPreviewUrl(null);
    toast({ title: "Membro atualizado!", description: "As informações do membro foram atualizadas." });
    fetchMembers();
  };

  const openDeleteDialog = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    setLoading(true);
    const { error } = await supabase.from("members").delete().eq("id", memberToDelete.id);
    setLoading(false);
    setIsDeleteDialogOpen(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Membro removido", description: "O membro foi removido com sucesso." });
    setMemberToDelete(null);
    fetchMembers();
  };

  const totalPages = Math.max(1, Math.ceil(members.length / itemsPerPage));
  const visibleMembers = members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membros da CNEA</h2>
          <p className="text-muted-foreground">Gerencie todos os membros da organização</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(v) => { setIsAddDialogOpen(v); if (!v) { if (addPreviewUrl) { URL.revokeObjectURL(addPreviewUrl); setAddPreviewUrl(null); } setFileToUpload(null); } }}>
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
                <Label htmlFor="photo">Foto de Perfil (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={addPreviewUrl || profilePhoto} />
                    <AvatarFallback>Foto</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFileToUpload(f);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          if (addPreviewUrl) URL.revokeObjectURL(addPreviewUrl);
                          setAddPreviewUrl(url);
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Carregar Foto
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" value={addForm.full_name} onChange={(e) => setAddForm({...addForm, full_name: e.target.value})} placeholder="Nome do membro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" value={addForm.role} onChange={(e) => setAddForm({...addForm, role: e.target.value})} placeholder="Cargo do membro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} placeholder="email@cnea.ao" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input id="phone" type="tel" value={addForm.phone} onChange={(e) => setAddForm({...addForm, phone: e.target.value})} placeholder="+244 000 000 000" />
              </div>

              <Button onClick={handleAddMember} className="w-full" disabled={loading}>
                {loading ? "A processar..." : "Adicionar Membro"}
              </Button>
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
              {visibleMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.photo_url || profilePhoto} alt={member.full_name} />
                        <AvatarFallback>{member.full_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{member.role || "—"}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{member.email || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(member)}>
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
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

      <Dialog open={isEditDialogOpen} onOpenChange={(v) => { setIsEditDialogOpen(v); if (!v) { setEditingMember(null); if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) { URL.revokeObjectURL(editPreviewUrl); setEditPreviewUrl(null); } setEditFileToUpload(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>Atualize os dados do membro</DialogDescription>
          </DialogHeader>

          {editingMember && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="edit-photo">Foto de Perfil (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editPreviewUrl || profilePhoto} />
                    <AvatarFallback>{editingMember.full_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setEditFileToUpload(f);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(editPreviewUrl);
                          setEditPreviewUrl(url);
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => editFileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Foto
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input id="edit-name" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Input id="edit-role" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Número de Telefone</Label>
                <Input id="edit-phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
              </div>

              <Button onClick={handleEditMember} className="w-full" disabled={loading}>
                {loading ? "A processar..." : "Salvar Alterações"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover{" "}
              <strong>{memberToDelete?.full_name || "este membro"}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={() => { setIsDeleteDialogOpen(false); setMemberToDelete(null); }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember} disabled={loading}>
              {loading ? "A processar..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
// ...existing code...