import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";
import logoCnea from "@/assets/logo-cnea.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    });
    
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoCnea} alt="Logo CNEA" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Recuperar Senha</h1>
          <p className="text-muted-foreground mt-2">Insira seu email para redefinir a senha</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Esqueceu a senha?</CardTitle>
            <CardDescription>
              Enviaremos instruções para o seu email
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button type="submit" className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar instruções
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Lembrou a senha? </span>
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
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email enviado!</h3>
                  <p className="text-muted-foreground text-sm">
                    Verifique sua caixa de entrada em <strong>{email}</strong> para instruções de redefinição de senha.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Voltar ao login
                </Button>
              </div>
            )}
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

export default ForgotPassword;
