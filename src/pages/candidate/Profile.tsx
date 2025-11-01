// ...existing code...
"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const shiftOptions = ["Matutino", "Vespertino", "Noturno"];

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [profileData, setProfileData] = useState<any>({
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
    documents: {}, // will store { payment: url, passport: url, bi: url, cv: url, declaration: url }
  });

  // files for documents
  const [documentsFiles, setDocumentsFiles] = useState<Record<string, File | null>>({
    payment: null,
    passport: null,
    bi: null,
    cv: null,
    declaration: null,
  });

  const [coursesOptions, setCoursesOptions] = useState<{ id: string; name: string; price?: number | null }[]>([]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("id,name,price").order("name", { ascending: true });
      if (error) {
        console.warn("fetchCourses:", error.message);
        return;
      }
      setCoursesOptions((data as any) || []);
    } catch (err) {
      console.warn("fetchCourses error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();

    (async () => {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("auth.getUser:", userErr.message);
        const user = (userData as any)?.user;
        if (!user) return;

        // try to find student record by auth_id first (if present) then by email
        let studentRecord: any = null;
        try {
          const { data: byAuthId, error: errAuth } = await supabase
            .from("students")
            .select("*")
            .eq("auth_id", user.id)
            .maybeSingle();
          if (!errAuth && byAuthId) studentRecord = byAuthId;
        } catch (err) {
          console.warn("auth_id lookup skipped:", err);
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
            birthDate: studentRecord.birth_date ? String(studentRecord.birth_date).split("T")[0] : "",
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
            documents: studentRecord.documents || {},
          });
        } else {
          setProfileData((p: any) => ({
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

  const uploadToStorage = async (targetId: string, file: File, folder: string) => {
    const path = `${folder}/${targetId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("student-docs").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      // if file exists you can set upsert true or handle differently
      console.warn("upload error", error);
      return null;
    }
    const { data: urlData } = supabase.storage.from("student-docs").getPublicUrl(path);
    return (urlData as any)?.publicUrl || null;
  };

  const uploadAvatar = async (targetId: string) => {
    if (!photoFile) return null;
    return await uploadToStorage(targetId, photoFile, "profiles/avatar");
  };

  const uploadDocuments = async (targetId: string) => {
    const keys = Object.keys(documentsFiles) as (keyof typeof documentsFiles)[];
    const uploaded: Record<string, string> = {};
    for (const k of keys) {
      const f = documentsFiles[k];
      if (f) {
        const url = await uploadToStorage(targetId, f, "profiles/documents");
        if (url) uploaded[k] = url;
      }
    }
    return uploaded;
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
        documents: profileData.documents || {},
      };

      let targetId = studentId;

      if (!targetId) {
        // include auth_id so owner policies work
        const { data: insertData, error: insertErr } = await supabase
          .from("students")
          .insert({
            ...payload,
            has_certificate: false,
            auth_id: user?.id || null,
          })
          .select()
          .limit(1)
          .single();
        if (insertErr) throw insertErr;
        targetId = (insertData as any).id;
        setStudentId(targetId);
      } else {
        const { error: updateErr } = await supabase.from("students").update(payload).eq("id", targetId);
        if (updateErr) throw updateErr;
      }

      // upload avatar
      if (photoFile && targetId) {
        const url = await uploadAvatar(targetId);
        if (url) {
          await supabase.from("students").update({ photo_url: url }).eq("id", targetId);
          setProfileData((p: any) => ({ ...p, photo: url }));
        }
      }

      // upload documents and merge with existing documents JSON
      if (targetId) {
        const uploaded = await uploadDocuments(targetId);
        if (Object.keys(uploaded).length > 0) {
          const merged = { ...(profileData.documents || {}), ...uploaded };
          await supabase.from("students").update({ documents: merged }).eq("id", targetId);
          setProfileData((p: any) => ({ ...p, documents: merged }));
        }
      }

      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message || "Não foi possível salvar os dados", variant: "destructive" });
      console.warn("save profile error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                {(profileData.name || "").split(" ").filter(Boolean).map((n:any) => n[0]).join("")}
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
                  setProfileData((p:any) => ({ ...p, photo: URL.createObjectURL(f) }));
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
            {/* name / bi */}
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

            {/* email / phone */}
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

            {/* birth / address */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input id="birthDate" type="date" value={profileData.birthDate} onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
              </div>
            </div>

            {/* nationality / municipality / province */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Input id="nationality" value={profileData.nationality} onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Município</Label>
                <Input id="municipality" value={profileData.municipality} onChange={(e) => setProfileData({ ...profileData, municipality: e.target.value })} />
              </div>
            </div>

            {/* province / institution */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">Província</Label>
                <Input id="province" value={profileData.province} onChange={(e) => setProfileData({ ...profileData, province: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição (opcional)</Label>
                <Input id="institution" value={profileData.institution} onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })} />
              </div>
            </div>

            {/* course dropdown / shift dropdown */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <Select value={profileData.course || ""} onValueChange={(v) => setProfileData({ ...profileData, course: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesOptions.length === 0 ? (
                      <SelectItem value="">Sem cursos</SelectItem>
                    ) : (
                      coursesOptions.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}{c.price ? ` — ${Number(c.price).toLocaleString("pt-AO")} Kz` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select value={profileData.shift || ""} onValueChange={(v) => setProfileData({ ...profileData, shift: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* year / final_grade (both optional) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year">Ano (opcional)</Label>
                <Input id="year" type="number" value={profileData.year} onChange={(e) => setProfileData({ ...profileData, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="final_grade">Nota Final (opcional)</Label>
                <Input id="final_grade" type="number" value={profileData.final_grade} onChange={(e) => setProfileData({ ...profileData, final_grade: e.target.value })} />
              </div>
            </div>

            {/* Documents upload */}
            <div className="space-y-3">
              <Label>Documentos</Label>

              {[
                { key: "payment", label: "Comprovativo de Pagamento" },
                { key: "passport", label: "Foto tipo passe" },
                { key: "bi", label: "Bilhete de Identidade (scan)" },
                { key: "cv", label: "CV" },
                { key: "declaration", label: "Declaração / Certificado" },
              ].map((d) => (
                <div key={d.key} className="flex items-center gap-3">
                  <input
                    id={`file-${d.key}`}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setDocumentsFiles((prev) => ({ ...prev, [d.key]: f }));
                    }}
                  />
                  <label htmlFor={`file-${d.key}`} className="rounded-md border px-3 py-2 cursor-pointer bg-muted/5">
                    Escolher ficheiro — {profileData.documents?.[d.key] ? "🔗 Já enviado" : documentsFiles[d.key] ? documentsFiles[d.key]?.name : "nenhum"}
                  </label>
                </div>
              ))}
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