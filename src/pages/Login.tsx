import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import logoCnea from "@/assets/logo-cnea.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login
    if (email === "cnea@gmail.com" && password === "123") {
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo, Administrador.",
      });
      navigate("/admin");
    } else if (email === "portal@gmail.com" && password === "123") {
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo ao portal do aluno.",
      });
      navigate("/portal");
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
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

              <Button type="submit" className="w-full" size="lg">
                Entrar
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
