import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  BookOpen,
  Trophy,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const CandidatePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dados simulados do candidato
  const candidateData = {
    name: "Kelson",
    email: "joao.silva@email.com",
    bi: "006543210LA041",
    program: "Curso Técnico em Tecnologia da Informação",
    status: "Matriculado",
    enrollmentDate: "15/03/2024",
    overallGrade: 85,
    ranking: 12,
    totalStudents: 145,
  };

  const subjects = [
    { name: "Programação Web", grade: 90, progress: 75, status: "Em Curso" },
    { name: "Banco de Dados", grade: 88, progress: 80, status: "Em Curso" },
    { name: "Redes de Computadores", grade: 82, progress: 65, status: "Em Curso" },
    { name: "Sistemas Operacionais", grade: 85, progress: 70, status: "Em Curso" },
    { name: "Inglês Técnico", grade: 78, progress: 60, status: "Em Curso" },
  ];

  const documents = [
    { name: "Certificado de Matrícula", date: "15/03/2024", status: "Disponível" },
    { name: "Histórico Escolar", date: "20/05/2024", status: "Disponível" },
    { name: "Declaração de Frequência", date: "10/06/2024", status: "Disponível" },
  ];

  const schedule = [
    { day: "Segunda-feira", time: "08:00 - 10:00", subject: "Programação Web", room: "Lab 201" },
    { day: "Segunda-feira", time: "10:30 - 12:30", subject: "Banco de Dados", room: "Lab 203" },
    { day: "Terça-feira", time: "08:00 - 10:00", subject: "Redes de Computadores", room: "Sala 105" },
    { day: "Terça-feira", time: "14:00 - 16:00", subject: "Sistemas Operacionais", room: "Lab 202" },
    { day: "Quarta-feira", time: "08:00 - 10:00", subject: "Inglês Técnico", room: "Sala 302" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao início
        </Button>

        <div className="max-w-7xl mx-auto">
          {/* Header do Portal */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={candidateData.name} />
                  <AvatarFallback className="text-2xl">
                    {candidateData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{candidateData.name}</h1>
                  <p className="text-muted-foreground mb-3">{candidateData.program}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {candidateData.status}
                    </Badge>
                    <Badge variant="outline">BI: {candidateData.bi}</Badge>
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      Matrícula: {candidateData.enrollmentDate}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Navegação */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">
                <TrendingUp className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="disciplinas">
                <BookOpen className="mr-2 h-4 w-4" />
                Disciplinas
              </TabsTrigger>
              <TabsTrigger value="classificacao">
                <Trophy className="mr-2 h-4 w-4" />
                Classificação
              </TabsTrigger>
              <TabsTrigger value="horario">
                <Calendar className="mr-2 h-4 w-4" />
                Horário
              </TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {candidateData.overallGrade}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Em 100 pontos possíveis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Classificação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {candidateData.ranking}º
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      De {candidateData.totalStudents} alunos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Progresso do Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">70%</div>
                    <Progress value={70} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Disciplina</CardTitle>
                  <CardDescription>Suas notas e progresso em cada disciplina</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Nota: {subject.grade} | Progresso: {subject.progress}%
                            </p>
                          </div>
                          <Badge variant="outline">{subject.status}</Badge>
                        </div>
                        <Progress value={subject.progress} />
                        {index < subjects.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos Disponíveis</CardTitle>
                  <CardDescription>Certificados e declarações para download</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">Emitido em {doc.date}</p>
                          </div>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Disciplinas */}
            <TabsContent value="disciplinas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{subject.name}</CardTitle>
                          <CardDescription className="mt-2">{subject.status}</CardDescription>
                        </div>
                        <Badge
                          variant={subject.grade >= 80 ? "default" : "secondary"}
                          className="text-lg px-3 py-1"
                        >
                          {subject.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Avaliações</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">1ª Prova</span>
                              <span className="font-medium">88</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">2ª Prova</span>
                              <span className="font-medium">92</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Trabalhos</span>
                              <span className="font-medium">85</span>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Classificação */}
            <TabsContent value="classificacao">
              <Card>
                <CardHeader>
                  <CardTitle>Ranking da Turma</CardTitle>
                  <CardDescription>
                    Sua posição em relação aos outros alunos do curso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                      <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-4xl font-bold mb-2">
                        {candidateData.ranking}º Lugar
                      </h3>
                      <p className="text-muted-foreground">
                        Entre {candidateData.totalStudents} alunos
                      </p>
                      <p className="text-lg font-semibold mt-4">
                        Média: {candidateData.overallGrade} pontos
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Top 5 da Turma</h4>
                      <div className="space-y-3">
                        {[
                          { position: 1, name: "Maria Santos", grade: 94 },
                          { position: 2, name: "Carlos Mendes", grade: 92 },
                          { position: 3, name: "Ana Paula", grade: 89 },
                          { position: 4, name: "Pedro Costa", grade: 87 },
                          { position: 5, name: "Sofia Lima", grade: 86 },
                        ].map((student) => (
                          <div
                            key={student.position}
                            className="flex items-center justify-between p-4 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold">
                                {student.position}
                              </div>
                              <span className="font-medium">{student.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-base">
                              {student.grade}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Como melhorar sua classificação</p>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Mantenha frequência regular às aulas</li>
                            <li>Participe ativamente das atividades</li>
                            <li>Entregue trabalhos dentro do prazo</li>
                            <li>Busque apoio pedagógico quando necessário</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Horário */}
            <TabsContent value="horario">
              <Card>
                <CardHeader>
                  <CardTitle>Horário de Aulas</CardTitle>
                  <CardDescription>Seu cronograma semanal de disciplinas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedule.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-semibold">{item.day}</span>
                            </div>
                            <p className="text-lg font-medium mb-1">{item.subject}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.time}
                              </span>
                              <span>{item.room}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Material
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Observações
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Chegue com 10 minutos de antecedência</li>
                      <li>Traga sempre seu material de estudo</li>
                      <li>Em caso de falta, justifique na secretaria</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;
