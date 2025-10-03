import { CheckCircle2, Shield, TrendingUp, Award, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import certificationImage from "@/assets/certification-ceremony.jpg";

const Benefits = () => {
  const internBenefits = [
    "Reconhecimento oficial como estagiário legalizado a nível nacional",
    "Acesso preferencial a vagas de estágio e programas de encaminhamento",
    "Participação em eventos, formações e workshops gratuitos ou com desconto",
    "Certificação do tempo de estágio válido para o mercado de trabalho",
    "Descontos em instituições e empresas parceiras da CNEA",
    "Integração numa base nacional de estagiários profissionais"
  ];

  const companyBenefits = [
    "Credibilidade institucional ao acolher estagiários legalizados",
    "Facilidade na organização e supervisão dos estagiários",
    "Participação em programas nacionais de valorização da juventude",
    "Parceria com a CNEA para receber estagiários qualificados",
    "Facilidade na emissão de certificados com suporte técnico da CNEA"
  ];

  return (
    <section id="beneficios" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Benefícios da Carteira Profissional</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A legalização através da Carteira Profissional de Estagiário da CNEA oferece 
            inúmeros benefícios tanto para estagiários quanto para instituições parceiras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Benefits for Interns */}
          <Card className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card animate-fade-in hover:-translate-y-2" style={{ animationDelay: "100ms" }}>
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-glow-red">
                <Users className="text-primary-foreground" size={32} />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-foreground">
                Para o Estagiário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {internBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits for Companies */}
          <Card className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card animate-fade-in hover:-translate-y-2" style={{ animationDelay: "250ms" }}>
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Briefcase className="text-secondary-foreground" size={32} />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-foreground">
                Para a Empresa/Instituição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {companyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="text-secondary flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Image Section */}
        <div className="mt-12 md:mt-16 mb-12 animate-fade-in rounded-2xl overflow-hidden shadow-xl relative">
          <img 
            src={certificationImage} 
            alt="Cerimónia de certificação de estagiários profissionais"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 md:mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="max-w-3xl mx-auto">
            <Shield className="mx-auto mb-6 text-accent" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">
              Certificação com Validade Nacional
            </h3>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              A CNEA, representando entidades como o INEP, AEPEA e CMPEA, atua para regular, 
              proteger e fortalecer o estágio em Angola como ferramenta de transição segura 
              e eficaz para o mercado de trabalho.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
