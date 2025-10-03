import { GraduationCap, Briefcase, TrendingUp, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Estágios Académicos",
      description: "Programas de estágio integrados ao currículo académico, permitindo aplicação prática dos conhecimentos.",
      duration: "3-6 meses",
      level: "Estudantes universitários"
    },
    {
      icon: Briefcase,
      title: "Estágios Profissionais",
      description: "Experiência profissional em empresas e instituições do setor público e privado.",
      duration: "6-12 meses",
      level: "Recém-formados"
    },
    {
      icon: TrendingUp,
      title: "Programas de Capacitação",
      description: "Formações especializadas para desenvolvimento de competências técnicas e profissionais.",
      duration: "1-3 meses",
      level: "Estagiários ativos"
    },
    {
      icon: FileCheck,
      title: "Certificação Profissional",
      description: "Validação e certificação nacional do tempo de estágio com reconhecimento oficial.",
      duration: "Contínuo",
      level: "Todos os estagiários"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById("contatos");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="programas" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Programas de Estágio</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Oferecemos diversos programas adaptados às diferentes fases da jornada 
            académica e profissional dos estagiários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {programs.map((program, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-red transition-smooth">
                    <program.icon className="text-primary-foreground" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {program.duration}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground border border-accent/20">
                        {program.level}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <Button variant="default" size="lg" onClick={scrollToContact} className="hover:scale-105">
            Candidatar-se a um Programa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programs;
