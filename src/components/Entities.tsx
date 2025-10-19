import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import meetingImage from "@/assets/professional-meeting.jpg";
import logoInep from "@/assets/logo-inep.png";
import logoCmpea from "@/assets/logo-cmpea.png";
import logoAepea from "@/assets/logo-aepea.png";
import logoCnea from "@/assets/logo-cnea.png";

const Entities = () => {
  const entities = [
    {
      logo: logoInep,
      acronym: "INEP",
      name: "Instituto de Estágios Profissionais de Angola",
      description: "Órgão técnico e estratégico voltado para a regulação, monitoramento e desenvolvimento do sistema nacional de estágios profissionais.",
      functions: [
        "Desenvolver políticas públicas de estágio",
        "Supervisionar o cumprimento das normas legais",
        "Emitir diretrizes e normas técnicas",
        "Apoiar a inserção de jovens no mercado de trabalho"
      ]
    },
    {
      logo: logoAepea,
      acronym: "AEPEA",
      name: "Associação dos Estudantes e Profissionais Estagiários de Angola",
      description: "Associação de caráter representativo e participativo, voltada para a defesa dos direitos, formação e empregabilidade dos estagiários.",
      functions: [
        "Promover capacitações e eventos",
        "Apoiar estagiários em conflitos institucionais",
        "Representar estudantes em espaços políticos",
        "Fomentar cultura de mérito e responsabilidade"
      ]
    },
    {
      logo: logoCmpea,
      acronym: "CMPEA",
      name: "Corporativa Multissetorial de Estudantes e Profissionais Estagiários de Angola",
      description: "Entidade corporativa com enfoque setorial e técnico, reunindo estagiários de diversas áreas para promoção da qualificação.",
      functions: [
        "Estabelecer redes de cooperação entre setores",
        "Dinamizar programas focados no setor produtivo",
        "Apoiar a transição do estágio para o emprego",
        "Criar banco de talentos nacionais"
      ]
    }
  ];

  return (
    <section id="entidades" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Entidades Representadas</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A CNEA representa três entidades fundamentais que atuam de forma integrada 
            para fortalecer o estágio em Angola.
          </p>
        </div>

        {/* Image Section */}
        <div className="mb-12 md:mb-16 animate-fade-in rounded-2xl overflow-hidden shadow-xl relative">
          <img 
            src={meetingImage} 
            alt="Reunião profissional sobre programas de estágio"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {entities.map((entity, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="w-32 h-32 flex items-center justify-center mb-4 group-hover:shadow-glow-red transition-smooth">
                  <img src={entity.logo} alt={`Logo ${entity.acronym}`} className="w-full h-full object-contain" />
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-primary mb-2">{entity.acronym}</div>
                  <CardTitle className="text-lg leading-tight text-foreground">
                    {entity.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {entity.description}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                    Finalidades:
                  </h4>
                  <ul className="space-y-2">
                    {entity.functions.map((func, idx) => (
                      <li key={idx} className="flex items-start text-sm text-muted-foreground">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>{func}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Entities;
