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

  // courses dropdown (name + price) loaded from DB
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
    // load courses regardless of auth state
    fetchCourses();

    (async () => {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.warn("auth.getUser:", userErr.message);
        }
        const user = (userData as any)?.user;
        if (!user) return;

        // Try to find student record: prefer auth_id if present, otherwise by email
        let studentRecord: any = null;

        try {
          const { data: byAuthId, error: errAuth } = await supabase
            .from("students")
            .select("*")
            .eq("auth_id", user.id)
            .maybeSingle();
          if (!errAuth && byAuthId) studentRecord = byAuthId;
        } catch (err) {
          // ignore (column may not exist)
          console.warn("auth_id query skipped or failed:", err);
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
            birthDate: studentRecord.birth_date ? student_record_to_date(studentRecord.birth_date) : "",
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

  // small helper to normalize date string from DB
  const student_record_to_date = (d: any) => {
    try {
      return String(d).split("T")[0];
    } catch {
      return "";
    }
  };

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

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: ud } = await supabase.auth.getUser();
      const user = (ud as any)?.user;

      // Prepare payload (keep enrollment-only fields optional; institution/year/shift/final_grade are not shown in UI)
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
        // course remains — stored as course name (from dropdown)
        course: profileData.course || null,
        status: profileData.status || "Ativo",
      };

      let targetId = studentId;

      if (!targetId) {
        // insert new student — do NOT include auth_id by default to avoid schema cache errors
        const { data: insertData, error: insertErr } = await supabase
          .from("students")
          .insert({
            ...payload,
            has_certificate: false,
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

      // upload avatar if selected
      if (photoFile && targetId) {
        const url = await uploadAvatar(targetId);
        if (url) {
          await supabase.from("students").update({ photo_url: url }).eq("id", targetId);
          setProfileData((p) => ({ ...p, photo: url }));
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
                {(profileData.name || "").split(" ").filter(Boolean).map(n => n[0]).join("")}
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

            {/* visible fields for personal info */}
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

              {/* course dropdown populated from courses table */}
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
                          {c.name}
                          {c.price ? ` — ${Number(c.price).toLocaleString("pt-AO")} Kz` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* institution, year, shift, final_grade are enrollment-specific — not shown on profile page */}

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