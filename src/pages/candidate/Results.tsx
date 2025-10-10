import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Download, Trophy, FileText, Calendar } from "lucide-react";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const completedCourses = [
    {
      id: 1,
      name: "Tecnologia da Informação",
      completionDate: "Junho 2024",
      finalGrade: 85,
      status: "Concluído",
      hasCertificate: true,
      subjects: [
        { name: "Programação Web", grade: 90 },
        { name: "Banco de Dados", grade: 88 },
        { name: "Redes", grade: 82 },
        { name: "Sistemas Operacionais", grade: 85 },
      ]
    },
  ];

  const inProgressCourses = [
    {
      id: 2,
      name: "Gestão e Administração",
      startDate: "Março 2024",
      progress: 45,
      currentGrade: 78,
      status: "Em Andamento",
    }
  ];

  const filteredCourses = completedCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resultado Final</h2>
        <p className="text-muted-foreground">Consulte seus resultados e certificados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Cursos</CardTitle>
          <CardDescription>Encontre seus cursos concluídos</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome do curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Cursos Concluídos</h3>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold">{course.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        Concluído em {course.completionDate}
                      </p>
                    </div>
                    <Badge className="bg-success text-success-foreground">{course.status}</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Trophy className="h-12 w-12 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nota Final</p>
                            <p className="text-3xl font-bold">{course.finalGrade}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {course.hasCertificate && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <FileText className="h-12 w-12 text-primary" />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Certificado Disponível</p>
                              <Button size="sm" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Baixar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div>
                    <h5 className="font-semibold mb-3">Notas por Disciplina</h5>
                    <div className="space-y-2">
                      {course.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <Badge variant="outline" className="text-base">
                            {subject.grade}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum curso encontrado</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
