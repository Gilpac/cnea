// ...existing code...
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
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

  // --- NEW: courses + selected courses (multiple) ---
  const [coursesOptions, setCoursesOptions] = useState<{ id: string; name: string; price?: number | null }[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("id, name, price").order("name", { ascending: true });
      if (error) {
        console.warn("fetchCourses:", error);
        return;
      }
      setCoursesOptions((data as any) || []);
    } catch (err) {
      console.warn("fetchCourses error:", err);
    }
  };
  // --- end new ---

  useEffect(() => {
    (async () => {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.warn("auth.getUser:", userErr.message);
        }
        const user = (userData as any)?.user;
        if (!user) {
          // no user: keep defaults
          return;
        }

        // fetch available courses (for multi-select)
        fetchCourses();

        // Try to find student record: prefer auth id if column exists, otherwise by email
        let studentRecord: any = null;

        // try auth id match (if your students table has auth_id)
        // Wrap in try/catch because the column might not exist in the DB schema
        try {
          const { data: byAuthId, error: errAuth } = await supabase
            .from("students")
            .select("*")
            .eq("auth_id", user.id)
            .maybeSingle();
          if (!errAuth && byAuthId) studentRecord = byAuthId;
        } catch (err) {
          // auth_id column likely doesn't exist -> skip and fallback to email lookup
          console.warn("auth_id lookup skipped (column may not exist):", err);
        }

        if (!studentRecord && user.email) {
          const { data: byEmail, error: errEmail } = await supabase
            .from("students")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();
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

          // NEW: load existing enrollments (course ids) for this student
          try {
            const { data: enrolls, error: enrollErr } = await supabase
              .from("enrollments")
              .select("course_id")
              .eq("student_id", studentRecord.id);
            if (!enrollErr && enrolls) {
              setSelectedCourses((enrolls as any).map((r: any) => r.course_id));
            }
          } catch (e) {
            console.warn("load enrollments error:", e);
          }
          // end NEW
        } else {
          // no student record: prefill from auth user
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

  const uploadAvatar = async (targetId: string) => {
    if (!photoFile) return null;
    try {
      const path = `profiles/${targetId}/avatar-${Date.now()}-${photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("student-docs").upload(path, photoFile, {
        cacheControl: "3600",
        upsert: true,
      });
      if (uploadError) {
        console.warn("avatar upload error:", uploadError);
        return null;
      }
      const { data: urlData } = supabase.storage.from("student-docs").getPublicUrl(path);
      return (urlData as any)?.publicUrl || null;
    } catch (err) {
      console.warn("uploadAvatar error:", err);
      return null;
    }
  };

  // ...existing code...
  // helper: check if students.auth_id column exists
  const authIdColumnExists = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("students").select("auth_id").limit(1);
      if (error) {
        // column likely doesn't exist or permission error
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // get auth user
      const { data: ud, error: ue } = await supabase.auth.getUser();
      const user = (ud as any)?.user;
      // Prepare payload
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
        // check if auth_id column exists and include it if present (prevents schema-cache error and satisfies owner RLS)
        const hasAuthId = await authIdColumnExists();

        const insertPayload = {
          ...payload,
          has_certificate: false,
          ...(hasAuthId ? { auth_id: user?.id || null } : {}),
        };

        const { data: insertData, error: insertErr } = await supabase
          .from("students")
          .insert(insertPayload)
          .select()
          .limit(1)
          .single();

        if (insertErr) {
          // common cause: RLS blocking insert — inform user via toast and log
          console.warn("insert student error:", insertErr);
          throw insertErr;
        }
        targetId = (insertData as any).id;
        setStudentId(targetId);
      } else {
        // update existing
        const { error: updateErr } = await supabase.from("students").update(payload).eq("id", targetId);
        if (updateErr) throw updateErr;
      }

      // upload avatar if selected
      if (photoFile && targetId) {
        const url = await uploadAvatar(targetId);
        if (url) {
          await supabase.from("students").update({ photo_url: url }).eq("id", targetId);
          setProfileData((p) => ({ ...p, photo: url }));
        }
      }

      // --- NEW: handle enrollments (delete old -> insert selected) ---
      if (targetId) {
        // delete existing enrollments for this student (idempotent)
        const { error: delErr } = await supabase.from("enrollments").delete().eq("student_id", targetId);
        if (delErr) {
          // non-fatal: log and continue
          console.warn("delete enrollments error:", delErr);
        }

        if (selectedCourses && selectedCourses.length > 0) {
          const rows = selectedCourses.map((course_id) => ({ student_id: targetId, course_id }));
          const { error: insertEnrollErr } = await supabase.from("enrollments").insert(rows);
          if (insertEnrollErr) {
            console.warn("insert enrollments error:", insertEnrollErr);
            // not throwing to avoid blocking profile save; show toast
            toast({ title: "Aviso", description: "Erro ao registar inscrições.", variant: "destructive" });
          }
        }
      }
      // --- end NEW ---

      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas com sucesso." });
    } catch (err: any) {
      // Show message; include hint for RLS problems
      const msg = err?.message || String(err);
      const hint = msg.includes("row-level security") ? " — RLS está a bloquear esta operação. Verifique policies/auth_id." : "";
      toast({ title: "Erro", description: msg + hint, variant: "destructive" });
      console.warn("save profile error:", err);
    } finally {
      setLoading(false);
    }
  };
  // ...existing code...

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
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
              <AvatarFallback className="text-3xl">
                {(profileData.name || "").split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                if (f) {
                  setPhotoFile(f);
                  // preview immediately
                  setProfileData((p) => ({ ...p, photo: URL.createObjectURL(f) }));
                }
              }}
            />

            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bi">Bilhete de Identidade</Label>
                <Input
                  id="bi"
                  value={profileData.bi}
                  onChange={(e) => setProfileData({ ...profileData, bi: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>
            </div>

            {/* additional fields for enrollment */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Input id="nationality" value={profileData.nationality} onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Município</Label>
                <Input id="municipality" value={profileData.municipality} onChange={(e) => setProfileData({ ...profileData, municipality: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Província</Label>
                <Input id="province" value={profileData.province} onChange={(e) => setProfileData({ ...profileData, province: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input id="institution" value={profileData.institution} onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })} />
              </div>

              {/* REPLACED: single course input -> multi-select checkboxes */}
              <div className="space-y-2">
                <Label>Inscrever-se em Cursos</Label>
                <div className="max-h-40 overflow-auto border rounded p-2">
                  {coursesOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum curso disponível</p>
                  ) : (
                    coursesOptions.map((c) => {
                      const checked = selectedCourses.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedCourses((s) => [...s, c.id]);
                              else setSelectedCourses((s) => s.filter((id) => id !== c.id));
                            }}
                          />
                          <span className="text-sm">{c.name}{c.price ? ` — ${Number(c.price).toLocaleString("pt-AO")} Kz` : ""}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input id="year" type="number" value={profileData.year} onChange={(e) => setProfileData({ ...profileData, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Input id="shift" value={profileData.shift} onChange={(e) => setProfileData({ ...profileData, shift: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="final_grade">Nota Final</Label>
                <Input id="final_grade" type="number" value={profileData.final_grade} onChange={(e) => setProfileData({ ...profileData, final_grade: e.target.value })} />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full sm:w-auto" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "A processar..." : "Salvar Alterações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
// ...existing code...