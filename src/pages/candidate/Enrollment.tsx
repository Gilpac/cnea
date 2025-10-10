import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Users, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Enrollment = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollmentReason, setEnrollmentReason] = useState("");

  const courses = [
    { 
      id: "ti", 
      name: "Tecnologia da Informação", 
      duration: "2 anos",
      vacancies: 15,
      description: "Formação técnica em desenvolvimento de software, redes e sistemas."
    },
    { 
      id: "admin", 
      name: "Gestão e Administração", 
      duration: "1.5 anos",
      vacancies: 20,
      description: "Prepare-se para gerir empresas e projetos com eficiência."
    },
    { 
      id: "saude", 
      name: "Saúde e Enfermagem", 
      duration: "2 anos",
      vacancies: 10,
      description: "Formação em cuidados de saúde e assistência médica."
    },
  ];

  const myEnrollments = [
    { 
      id: 1, 
      course: "Tecnologia da Informação", 
      status: "Em Análise",
      date: "15/03/2024"
    },
  ];

  const handleSubmit = () => {
    if (!selectedCourse || !enrollmentReason) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Inscrição enviada!",
      description: "Sua inscrição foi recebida e está sendo analisada.",
    });
    setSelectedCourse("");
    setEnrollmentReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inscrição</h2>
        <p className="text-muted-foreground">Candidate-se aos cursos disponíveis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Inscrição</CardTitle>
              <CardDescription>Escolha o curso e envie sua candidatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Curso Desejado</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCourse && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    {courses.find(c => c.id === selectedCourse) && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">
                          {courses.find(c => c.id === selectedCourse)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {courses.find(c => c.id === selectedCourse)?.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {courses.find(c => c.id === selectedCourse)?.duration}
                          </Badge>
                          <Badge variant="outline">
                            <Users className="mr-1 h-3 w-3" />
                            {courses.find(c => c.id === selectedCourse)?.vacancies} vagas
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Motivação</Label>
                <Textarea
                  id="reason"
                  placeholder="Conte-nos por que deseja fazer este curso..."
                  value={enrollmentReason}
                  onChange={(e) => setEnrollmentReason(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Documentos (opcional)</Label>
                <Input id="documents" type="file" multiple />
                <p className="text-xs text-muted-foreground">
                  Certificados, histórico escolar, etc.
                </p>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Enviar Inscrição
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Inscrições</CardTitle>
              <CardDescription>Acompanhe o status das suas candidaturas</CardDescription>
            </CardHeader>
            <CardContent>
              {myEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {myEnrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{enrollment.course}</h4>
                            <p className="text-sm text-muted-foreground">
                              Inscrito em {enrollment.date}
                            </p>
                          </div>
                          <Badge variant="secondary">{enrollment.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Você ainda não tem inscrições</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
