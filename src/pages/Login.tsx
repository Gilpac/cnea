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

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Obtém id do user (pode vir em data.user)
    const userId = data?.user?.id;

    // Busca profile para saber o role
    let role = 'student';
    if (userId) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profileError && profiles?.role) {
        role = profiles.role;
      }
    }

    toast({
      title: "Login bem-sucedido!",
      description: "Sessão iniciada.",
    });

    if (role === 'admin') {
      navigate("/admin");
    } else {
      navigate("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoCnea} alt="Logo CNEA" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Bem-vindo ao CNEA</h1>
          <p className="text-muted-foreground mt-2">Faça login para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => navigate("/forgot-password")}
                >
                  Esqueceu a senha?
                </Button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "A processar..." : "Entrar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => navigate("/register")}
                >
                  Criar conta
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

export default Login;
// ...existing code...