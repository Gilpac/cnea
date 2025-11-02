// ...existing code...
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Eye, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import profilePhoto from "@/assets/profile-photo.png";
import { supabase } from "@/lib/supabase";
// ...existing code...

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bi: "",
    address: "",
    birthDate: "",
    photo: profilePhoto,
    nationality: "",
    municipality: "",
    province: "",
    institution: "",
    course: "",
    year: "",
    shift: "",
    final_grade: "",
    status: "Ativo",
  });

  // --- new: document uploads state (5 documentos) ---
  type DocKey = "cv" | "bi_doc" | "passport_photo" | "payment" | "declaration";
  const docKeys: { key: DocKey; label: string }[] = [
    { key: "cv", label: "CV" },
    { key: "bi_doc", label: "Bilhete de Identidade" },
    { key: "passport_photo", label: "Fotografia tipo passe" },
    { key: "payment", label: "Comprovativo de Pagamento" },
    { key: "declaration", label: "Declaração / Certificado" },
  ];

  const [docFiles, setDocFiles] = useState<Record<DocKey, File | null>>({
    cv: null,
    bi_doc: null,
    passport_photo: null,
    payment: null,
    declaration: null,
  });

  const [docUrls, setDocUrls] = useState<Record<DocKey, string | null>>({
    cv: null,
    bi_doc: null,
    passport_photo: null,
    payment: null,
    declaration: null,
  });
  // --- end new ---

  // --- courses + enrollments UI state ---
  const [coursesOptions, setCoursesOptions] = useState<{ id: string; name: string; price?: number | null }[]>([]);
  const [enrollments, setEnrollments] = useState<{ id: string; course_id: string; created_at?: string }[]>([]);
  const [newCourseId, setNewCourseId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("id,name,price").order("name", { ascending: true });
      if (error) {
        console.warn("fetchCourses:", error);
        return;
      }
      setCoursesOptions((data as any) || []);
    } catch (err) {
      console.warn("fetchCourses error:", err);
    }
  };

  const fetchEnrollments = async (sid: string | null) => {
    if (!sid) return;
    try {
      const { data, error } = await supabase.from("enrollments").select("id,course_id,created_at").eq("student_id", sid).order("created_at", { ascending: false });
      if (error) {
        console.warn("fetchEnrollments:", error);
        return;
      }
      setEnrollments((data as any) || []);
    } catch (err) {
      console.warn("fetchEnrollments error:", err);
    }
  };
  // --- end state ---

  useEffect(() => {
    (async () => {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("auth.getUser:", userErr.message);
        const user = (userData as any)?.user;
        if (!user) return;

        fetchCourses();

        let studentRecord: any = null;
        try {
          const { data: byAuthId, error: errAuth } = await supabase.from("students").select("*").eq("auth_id", user.id).maybeSingle();
          if (!errAuth && byAuthId) studentRecord = byAuthId;
        } catch (err) {
          console.warn("auth_id lookup skipped (column may not exist):", err);
        }

        if (!studentRecord && user.email) {
          const { data: byEmail, error: errEmail } = await supabase.from("students").select("*").eq("email", user.email).maybeSingle();
          if (!errEmail && byEmail) studentRecord = byEmail;
        }

        if (studentRecord) {
          setStudentId(studentRecord.id);
          setProfileData({
            name: studentRecord.full_name || user.user_metadata?.full_name || user?.raw_user_meta_data?.full_name || "",
            email: studentRecord.email || user.email || "",
            phone: studentRecord.phone || "",
            bi: studentRecord.id_number || "",
            address: studentRecord.address || "",
            birthDate: studentRecord.birth_date ? studentRecord.birth_date.split("T")[0] : "",
            photo: studentRecord.photo_url || profilePhoto,
            nationality: studentRecord.nationality || "",
            municipality: studentRecord.municipality || "",
            province: studentRecord.province || "",
            institution: studentRecord.institution || "",
            course: studentRecord.course || "",
            year: studentRecord.year ? String(studentRecord.year) : "",
            shift: studentRecord.shift || "",
            final_grade: studentRecord.final_grade ? String(studentRecord.final_grade) : "",
            status: studentRecord.status || "Ativo",
          });

          // populate docUrls from student record if present
          setDocUrls({
            cv: studentRecord.doc_cv_url || null,
            bi_doc: studentRecord.doc_bi_url || null,
            passport_photo: studentRecord.doc_passport_photo_url || null,
            payment: studentRecord.doc_payment_url || null,
            declaration: studentRecord.doc_declaration_url || null,
          });

          fetchEnrollments(studentRecord.id);
        } else {
          setProfileData((p) => ({
            ...p,
            name: user.user_metadata?.full_name || user.raw_user_meta_data?.full_name || p.name,
            email: user.email || p.email,
          }));
        }
      } catch (err) {
        console.warn("Profile load error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (studentId) fetchEnrollments(studentId);
  }, [studentId]);


  // ...existing code...
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return (data as any)?.user || null;
};

  // ...existing code...
const uploadAvatar = async (targetId: string) => {
  if (!photoFile) return null;
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated - cannot upload avatar");

  try {
    const path = `profiles/${targetId}/avatar-${Date.now()}-${photoFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from("student-docs").upload(path, photoFile, {
      cacheControl: "3600",
      upsert: true,
    });
    if (uploadError) {
      console.warn("avatar upload error:", uploadError);
      throw uploadError;
    }
    const { data: urlData } = supabase.storage.from("student-docs").getPublicUrl(path);
    return (urlData as any)?.publicUrl || null;
  } catch (err) {
    console.warn("uploadAvatar error:", err);
    throw err;
  }
};

  // --- new: upload a single document and return public url ---
  // ...existing code...
const uploadDocument = async (targetId: string, key: DocKey, file: File | null) => {
  if (!file) return null;
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated - cannot upload document");

  try {
    const path = `profiles/${targetId}/docs/${key}-${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from("student-docs").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (uploadError) {
      console.warn("uploadDocument error:", uploadError);
      throw uploadError;
    }
    const { data: urlData } = supabase.storage.from("student-docs").getPublicUrl(path);
    return (urlData as any)?.publicUrl || null;
  } catch (err) {
    console.warn("uploadDocument exception:", err);
    throw err;
  }
};
// ...existing code...
  // --- end new ---

  // helper: check if students.auth_id column exists
  const authIdColumnExists = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("students").select("auth_id").limit(1);
      if (error) return false;
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: ud } = await supabase.auth.getUser();
      const user = (ud as any)?.user;
      const payload: any = {
        full_name: profileData.name || null,
        email: profileData.email || null,
        phone: profileData.phone || null,
        id_number: profileData.bi || null,
        address: profileData.address || null,
        birth_date: profileData.birthDate || null,
        nationality: profileData.nationality || null,
        municipality: profileData.municipality || null,
        province: profileData.province || null,
        institution: profileData.institution || null,
        course: profileData.course || null,
        year: profileData.year ? Number(profileData.year) : null,
        shift: profileData.shift || null,
        final_grade: profileData.final_grade ? Number(profileData.final_grade) : null,
        status: profileData.status || "Ativo",
      };

      let targetId = studentId;

      if (!targetId) {
        const hasAuthId = await authIdColumnExists();
        const insertPayload = { ...payload, has_certificate: false, ...(hasAuthId ? { auth_id: user?.id || null } : {}) };
        const { data: insertData, error: insertErr } = await supabase.from("students").insert(insertPayload).select().limit(1).single();
        if (insertErr) {
          console.warn("insert student error:", insertErr);
          throw insertErr;
        }
        targetId = (insertData as any).id;
        setStudentId(targetId);
      } else {
        const { error: updateErr } = await supabase.from("students").update(payload).eq("id", targetId);
        if (updateErr) throw updateErr;
      }

      if (photoFile && targetId) {
        const url = await uploadAvatar(targetId);
        if (url) {
          await supabase.from("students").update({ photo_url: url }).eq("id", targetId);
          setProfileData((p) => ({ ...p, photo: url }));
        }
      }

      // --- new: upload documents if any selected and save URLs on student row ---
      if (targetId) {
        const updates: Record<string, any> = {};

        for (const { key } of docKeys) {
          const file = docFiles[key];
          if (file) {
            const url = await uploadDocument(targetId, key, file);
            if (url) {
              // map keys to student columns
              if (key === "cv") updates["doc_cv_url"] = url;
              if (key === "bi_doc") updates["doc_bi_url"] = url;
              if (key === "passport_photo") updates["doc_passport_photo_url"] = url;
              if (key === "payment") updates["doc_payment_url"] = url;
              if (key === "declaration") updates["doc_declaration_url"] = url;
              // update local state
              setDocUrls((d) => ({ ...d, [key]: url }));
            }
          }
        }

        if (Object.keys(updates).length > 0) {
          const { error: docUpdateErr } = await supabase.from("students").update(updates).eq("id", targetId);
          if (docUpdateErr) {
            console.warn("error saving doc urls to student row:", docUpdateErr);
            // not fatal: show toast and continue
            toast({ title: "Aviso", description: "Documentos carregados mas erro ao salvar referências.", variant: "destructive" });
          }
        }
      }
      // --- end new ---

      if (targetId) await fetchEnrollments(targetId);

      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas com sucesso." });
    } catch (err: any) {
      const msg = err?.message || String(err);
      const hint = msg.includes("row-level security") ? " — RLS está a bloquear esta operação. Verifique policies/auth_id." : "";
      toast({ title: "Erro", description: msg + hint, variant: "destructive" });
      console.warn("save profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  // enrollment operations
  const handleAddEnrollment = async () => {
    if (!studentId) {
      toast({ title: "Guardar primeiro", description: "Guarde o perfil antes de registar inscrições.", variant: "destructive" });
      return;
    }
    if (!newCourseId) {
      toast({ title: "Selecione um curso", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("enrollments").insert({ student_id: studentId, course_id: newCourseId });
      if (error) throw error;
      await fetchEnrollments(studentId);
      setNewCourseId("");
      toast({ title: "Inscrição adicionada", description: "A sua inscrição foi registada." });
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message || "Não foi possível adicionar a inscrição", variant: "destructive" });
      console.warn("add enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (id: string, course_id: string) => {
    setEditingId(id);
    setEditingCourseId(course_id);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("enrollments").update({ course_id: editingCourseId }).eq("id", editingId);
      if (error) throw error;
      if (studentId) await fetchEnrollments(studentId);
      setEditingId(null);
      setEditingCourseId("");
      toast({ title: "Inscrição atualizada" });
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message || "Não foi possível editar", variant: "destructive" });
      console.warn("edit enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (id: string) => {
    // remove confirm() and perform deletion directly; show toast on success/failure
    setLoading(true);
    try {
      const { error } = await supabase.from("enrollments").delete().eq("id", id);
      if (error) throw error;
      if (studentId) await fetchEnrollments(studentId);
      toast({ title: "Inscrição eliminada", description: "A sua inscrição foi removida com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message || "Não foi possível eliminar", variant: "destructive" });
      console.warn("delete enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- new: view / download helpers ---
  const handleViewDocument = (url: string | null) => {
    if (!url) {
      toast({ title: "Nenhum documento", description: "Nenhum documento disponível para visualização.", variant: "destructive" });
      return;
    }
    window.open(url, "_blank");
  };

  const handleDownloadDocument = (url: string | null, filename?: string) => {
    if (!url) {
      toast({ title: "Nenhum documento", description: "Nenhum documento disponível para download.", variant: "destructive" });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    if (filename) a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  // --- end new ---

  // derived / UI helpers
  const enrichedEnrollments = useMemo(() => {
    return enrollments.map((e) => {
      const course = coursesOptions.find((c) => c.id === e.course_id);
      return { ...e, courseName: course?.name || e.course_id, price: course?.price || null };
    });
  }, [enrollments, coursesOptions]);

  const filtered = enrichedEnrollments.filter((e) => {
    if (!query) return true;
    return e.courseName.toLowerCase().includes(query.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e inscrições</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Atualize sua foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profileData.photo || profilePhoto} alt={profileData.name} />
              <AvatarFallback className="text-3xl">{(profileData.name || "").split(" ").map((n) => n?.[0]).join("")}</AvatarFallback>
            </Avatar>

            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files?.[0] || null;
              if (f) {
                setPhotoFile(f);
                setProfileData((p) => ({ ...p, photo: URL.createObjectURL(f) }));
              }
            }} />

            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" /> Alterar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* basic fields (kept) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bi">Bilhete de Identidade</Label>
                <Input id="bi" value={profileData.bi} onChange={(e) => setProfileData({ ...profileData, bi: e.target.value })} />
              </div>
            </div>

            {/* second row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
            </div>

            {/* academic small inputs */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição (opcional)</Label>
                <Input id="institution" value={profileData.institution} onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Ano (opcional)</Label>
                <Input id="year" type="number" value={profileData.year} onChange={(e) => setProfileData({ ...profileData, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Input id="shift" value={profileData.shift} onChange={(e) => setProfileData({ ...profileData, shift: e.target.value })} />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Button onClick={handleSave} disabled={loading}><Save className="mr-2 h-4 w-4" />{loading ? "A processar..." : "Salvar Alterações"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DOCUMENTS CARD (new) */}
      
      {/* DOCUMENTS CARD (responsive) */}

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>
            Carregue até 5 documentos: CV, BI, Fotografia tipo passe, Comprovativo de pagamento, Declaração/Certificado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {docKeys.map(({ key, label }) => {
              const file = docFiles[key];
              const url = docUrls[key];
              const displayName = file
                ? file.name
                : url
                ? decodeURIComponent(String(url).split("/").pop() || "")
                : "Nenhum ficheiro";
              return (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-md bg-muted/5">
                  <div className="flex-1 min-w-0">
                    <Label className="mb-1 block">{label}</Label>
                    <div className="text-sm text-muted-foreground truncate">{displayName}</div>
                    {file && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Pronto a enviar · {(file.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    
                    
                    <label
                      className="inline-flex items-center rounded border px-3 py-1 text-sm cursor-pointer bg-white/90 dark:bg-white/5 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 border-slate-200 dark:border-slate-700"
                      aria-label={`Substituir ${label}`}
                    >
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          if (f) {
                            setDocFiles((d) => ({ ...d, [key]: f }));
                            try {
                              const tmp = URL.createObjectURL(f);
                              setDocUrls((d) => ({ ...d, [key]: tmp }));
                            } catch {}
                          }
                        }}
                      />
                      Substituir
                    </label>

                    <Button className="whitespace-nowrap" variant="outline" onClick={() => handleViewDocument(url)}>
                      Visualizar
                    </Button>
                    <Button
                      className="whitespace-nowrap"
                      variant="ghost"
                      onClick={() =>
                        handleDownloadDocument(
                          url,
                          `${(profileData.name || "documento").replace(/\s+/g, "_")}-${key}`
                        )
                      }
                    >
                      Descarregar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <div className="text-sm text-muted-foreground">
              Nota: guarde o perfil para enviar os ficheiros. Os ficheiros são armazenados no bucket <code>student-docs</code>.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments / Admin-like listing */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Minhas Inscrições</h3>
          <div className="flex gap-3">
            <Input placeholder="Pesquisar curso..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4 mb-4">
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total Inscrições</div>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Cursos Disponíveis</div>
              <div className="text-2xl font-bold">{coursesOptions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Nota Final</div>
              <div className="text-2xl font-bold">{profileData.final_grade || "-"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-2xl font-bold">{profileData.status}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className="mb-4 grid sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <Label>Adicionar nova inscrição</Label>
                <select className="w-full rounded border px-3 py-2" value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)}>
                  <option value="">-- selecione curso --</option>
                  {coursesOptions.map((c) => <option key={c.id} value={c.id}>{c.name}{c.price ? ` — ${Number(c.price).toLocaleString("pt-AO")} Kz` : ""}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEnrollment} disabled={loading}><Plus className="mr-2 h-4 w-4" />Adicionar</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="py-2">Curso</th>
                    <th className="py-2">Preço</th>
                    <th className="py-2">Inscrito Em</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-sm text-muted-foreground">Nenhuma inscrição encontrada</td></tr>
                  ) : pageItems.map((enr) => (
                    <tr key={enr.id} className="border-t">
                      <td className="py-3">{enr.courseName}</td>
                      <td className="py-3">{enr.price ? `${Number(enr.price).toLocaleString("pt-AO")} Kz` : "-"}</td>
                      <td className="py-3">{enr.created_at ? new Date(enr.created_at).toLocaleString() : "-"}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => handleViewDocument(docUrls["cv"])}><Eye /></Button>
                          <Button variant="destructive" onClick={() => handleDeleteEnrollment(enr.id)}><Trash2 /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filtered.length)} de {filtered.length}</div>
              <div className="flex gap-2">
                <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <div className="px-3 py-2 border rounded">{page} / {totalPages}</div>
                <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
// ...existing code...