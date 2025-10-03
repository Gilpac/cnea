import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, UserCheck } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pre-inscricao");

  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    toast({
      title: "Inscrição enviada com sucesso!",
      description: `Sua ${type} foi registada. Em breve receberá um email de confirmação.`,
    });
    
    // Simular salvamento e redirecionar para o portal
    setTimeout(() => {
      navigate("/portal");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao início
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Inscrição de Candidato
            </h1>
            <p className="text-muted-foreground text-lg">
              Faça sua pré-inscrição ou inscrição nos programas do CNEA
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pre-inscricao" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pré-Inscrição
              </TabsTrigger>
              <TabsTrigger value="inscricao" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Inscrição
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pre-inscricao">
              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Pré-Inscrição</CardTitle>
                  <CardDescription>
                    Preencha os dados abaixo para manifestar interesse nos nossos programas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleSubmit(e, "pré-inscrição")} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input id="nome" placeholder="Seu nome completo" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input id="telefone" type="tel" placeholder="+244 900 000 000" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bi">Número do BI *</Label>
                        <Input id="bi" placeholder="000000000XX00" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="programa">Programa de Interesse *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o programa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnico">Curso Técnico</SelectItem>
                            <SelectItem value="medio">Ensino Médio</SelectItem>
                            <SelectItem value="profissional">Formação Profissional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Área de Interesse</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                            <SelectItem value="gestao">Gestão e Administração</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="engenharia">Engenharia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escolaridade">Nível de Escolaridade Atual *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                          <SelectItem value="medio-cursando">Ensino Médio (Cursando)</SelectItem>
                          <SelectItem value="medio-completo">Ensino Médio (Completo)</SelectItem>
                          <SelectItem value="superior">Ensino Superior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar Pré-Inscrição
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inscricao">
              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Inscrição</CardTitle>
                  <CardDescription>
                    Complete todos os campos para finalizar sua inscrição
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleSubmit(e, "inscrição")} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-insc">Nome Completo *</Label>
                        <Input id="nome-insc" placeholder="Seu nome completo" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-insc">Email *</Label>
                        <Input id="email-insc" type="email" placeholder="seu@email.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefone-insc">Telefone *</Label>
                        <Input id="telefone-insc" type="tel" placeholder="+244 900 000 000" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bi-insc">Número do BI *</Label>
                        <Input id="bi-insc" placeholder="000000000XX00" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nascimento">Data de Nascimento *</Label>
                        <Input id="nascimento" type="date" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="genero">Género *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="provincia">Província *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a província" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="luanda">Luanda</SelectItem>
                            <SelectItem value="benguela">Benguela</SelectItem>
                            <SelectItem value="huambo">Huambo</SelectItem>
                            <SelectItem value="cabinda">Cabinda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="municipio">Município *</Label>
                        <Input id="municipio" placeholder="Seu município" required />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="endereco">Endereço Completo *</Label>
                        <Input id="endereco" placeholder="Rua, número, bairro" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="programa-insc">Programa *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o programa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnico">Curso Técnico</SelectItem>
                            <SelectItem value="medio">Ensino Médio</SelectItem>
                            <SelectItem value="profissional">Formação Profissional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area-insc">Área/Especialidade *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                            <SelectItem value="gestao">Gestão e Administração</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="engenharia">Engenharia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="turno">Turno Preferencial *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manha">Manhã</SelectItem>
                            <SelectItem value="tarde">Tarde</SelectItem>
                            <SelectItem value="noite">Noite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ano-conclusao">Ano de Conclusão do Ensino Anterior *</Label>
                        <Input id="ano-conclusao" type="number" placeholder="2024" required />
                      </div>
                    </div>

                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold">Documentos Necessários</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Fotocópia do Bilhete de Identidade</li>
                        <li>Certificado de Habilitações</li>
                        <li>2 Fotografias tipo passe</li>
                        <li>Atestado Médico</li>
                      </ul>
                      <p className="text-xs text-muted-foreground">
                        * Os documentos deverão ser entregues presencialmente após aprovação da inscrição
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Finalizar Inscrição
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Registration;
