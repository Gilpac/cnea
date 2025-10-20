// ...existing code...
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import logoCnea from "@/assets/logo-cnea.png";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Se o user object estiver disponível, cria o perfil
    try {
      const userId = data?.user?.id;
      if (userId) {
        await supabase.from('profiles').insert({
          id: userId,
          full_name: formData.name,
          role: 'student',
        });
      }
    } catch (err) {
      // Não bloquear o fluxo se inserção falhar — apenas regista no console
      console.warn('Não foi possível inserir profile:', err);
    }

    setLoading(false);

    toast({
      title: "Conta criada com sucesso!",
      description: "",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoCnea} alt="Logo CNEA" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground mt-2">Registe-se como aluno do CNEA</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Aluno</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "A processar..." : "Criar Conta"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => navigate("/login")}
                >
                  Fazer login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
// ...existing code...