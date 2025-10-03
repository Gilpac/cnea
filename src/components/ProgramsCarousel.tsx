import { GraduationCap, Briefcase, TrendingUp, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ProgramsCarousel = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Estágios Académicos",
      description: "Programas de estágio integrados ao currículo académico, permitindo aplicação prática dos conhecimentos.",
      duration: "3-6 meses",
      level: "Estudantes universitários",
      color: "primary"
    },
    {
      icon: Briefcase,
      title: "Estágios Profissionais",
      description: "Experiência profissional em empresas e instituições do setor público e privado.",
      duration: "6-12 meses",
      level: "Recém-formados",
      color: "secondary"
    },
    {
      icon: TrendingUp,
      title: "Programas de Capacitação",
      description: "Formações especializadas para desenvolvimento de competências técnicas e profissionais.",
      duration: "1-3 meses",
      level: "Estagiários ativos",
      color: "primary"
    },
    {
      icon: FileCheck,
      title: "Certificação Profissional",
      description: "Validação e certificação nacional do tempo de estágio com reconhecimento oficial.",
      duration: "Contínuo",
      level: "Todos os estagiários",
      color: "accent"
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

        <div className="relative px-12 mb-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {programs.map((program, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card 
                      className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in h-full"
                    >
                      <CardContent className="p-6 md:p-8 flex flex-col h-full">
                        <div className="flex flex-col h-full">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 transition-smooth ${
                            program.color === 'primary' 
                              ? 'bg-primary group-hover:shadow-glow-red' 
                              : program.color === 'secondary'
                              ? 'bg-secondary'
                              : 'bg-accent'
                          }`}>
                            <program.icon className={program.color === 'accent' ? 'text-accent-foreground' : 'text-white'} size={28} />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
                            {program.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                            {program.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-auto">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              program.color === 'primary'
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : program.color === 'secondary'
                                ? 'bg-secondary/10 text-secondary border-secondary/20'
                                : 'bg-accent/10 text-accent-foreground border-accent/20'
                            }`}>
                              {program.duration}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                              {program.level}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-2 border-border hover:bg-background hover:border-primary" />
            <CarouselNext className="bg-background/80 backdrop-blur-sm border-2 border-border hover:bg-background hover:border-primary" />
          </Carousel>
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

export default ProgramsCarousel;
