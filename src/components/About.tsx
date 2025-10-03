import { Target, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import studentsImage from "@/assets/students-collaboration.jpg";

const About = () => {
  const objectives = [
    {
      icon: Target,
      title: "Acesso Justo",
      description: "Promover o acesso justo e transparente ao estágio profissional para todos os estudantes angolanos."
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Assegurar padrões mínimos de qualidade nas experiências de estágio e certificar com validade nacional."
    },
    {
      icon: Users,
      title: "Parcerias Estratégicas",
      description: "Facilitar parcerias entre centros de formação, empresas e representar os interesses dos estagiários."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Sobre a CNEA</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            A CNEA é um órgão de coordenação e representação nacional que visa organizar, 
            acompanhar, certificar e promover estágios profissionais em Angola. Atuamos como 
            plataforma central de articulação entre estagiários, instituições de ensino, 
            centros de formação e o setor público/privado.
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-12 md:mb-16 animate-fade-in rounded-2xl overflow-hidden shadow-xl relative">
          <img 
            src={studentsImage} 
            alt="Estagiários colaborando em ambiente profissional"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {objectives.map((objective, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:shadow-glow-red transition-smooth">
                  <objective.icon className="text-primary-foreground" size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">
                  {objective.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {objective.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
