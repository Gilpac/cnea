import { BookOpen, Video, FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Resources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Guias de Carreira",
      description: "Materiais completos sobre desenvolvimento profissional, elaboração de CV e preparação para entrevistas.",
      type: "PDF",
      items: "12 documentos"
    },
    {
      icon: Video,
      title: "Vídeos de Formação",
      description: "Tutoriais e webinars sobre competências profissionais, soft skills e ferramentas do mercado de trabalho.",
      type: "Vídeo",
      items: "24 vídeos"
    },
    {
      icon: FileText,
      title: "Artigos Especializados",
      description: "Conteúdos sobre tendências do mercado, direitos dos estagiários e boas práticas profissionais.",
      type: "Artigo",
      items: "36+ artigos"
    },
    {
      icon: Download,
      title: "Modelos e Templates",
      description: "Documentos prontos para uso: contratos de estágio, relatórios, avaliações e certificados.",
      type: "DOC",
      items: "8 templates"
    }
  ];

  return (
    <section id="recursos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Recursos para Estagiários</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Materiais de apoio, guias e ferramentas para o desenvolvimento profissional 
            dos estagiários em todas as fases da carreira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {resources.map((resource, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-red transition-smooth">
                  <resource.icon className="text-primary-foreground" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    {resource.type}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {resource.items}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
          <p className="text-muted-foreground mb-4">
            Precisa de ajuda para encontrar recursos específicos?
          </p>
          <Button variant="default" size="lg" className="hover:scale-105">
            Fale com Nossa Equipa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Resources;
