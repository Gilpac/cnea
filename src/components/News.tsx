import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const News = () => {
  const news = [
    {
      date: "15 Set 2024",
      category: "Programa",
      title: "Novo Programa de Estágios em Tecnologia",
      excerpt: "CNEA lança programa especializado em tecnologia e inovação digital com parceiros do setor privado.",
      readTime: "3 min"
    },
    {
      date: "08 Set 2024",
      category: "Evento",
      title: "Workshop de Preparação para Mercado de Trabalho",
      excerpt: "Inscrições abertas para workshop gratuito sobre elaboração de CV, entrevistas e networking profissional.",
      readTime: "2 min"
    },
    {
      date: "01 Set 2024",
      category: "Certificação",
      title: "Novas Diretrizes para Certificação de Estágios",
      excerpt: "INEP apresenta atualizações nos processos de certificação para garantir maior qualidade e reconhecimento.",
      readTime: "4 min"
    }
  ];

  return (
    <section id="noticias" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="mb-4 md:mb-6 text-foreground">Notícias e Atualizações</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Fique por dentro das últimas novidades, eventos e comunicados da CNEA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {news.map((item, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{item.readTime}</span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-smooth">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-smooth">
                  Ler mais
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Ver Todas as Notícias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default News;
