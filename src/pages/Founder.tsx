import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import edvanioPhoto from "@/assets/edvanio-monteiro.jpg";
import logoInep from "@/assets/logo-inep.png";
import logoCmpea from "@/assets/logo-cmpea.png";
import logoAepea from "@/assets/logo-aepea.png";

const Founder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
                  <img
                    src={edvanioPhoto}
                    alt="Edvânio Ausónio Caldeira Monteiro"
                    className="relative rounded-2xl shadow-2xl w-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="order-1 lg:order-2">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                  <span className="text-sm font-semibold text-primary">Fundador & Presidente</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Edvânio Ausónio Caldeira Monteiro
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Presidente e Fundador da Comissão Nacional dos Estagiários de Angola (CNEA)
                </p>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇦🇴</span>
                    <span className="font-medium">Angola</span>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <span className="font-medium">23 anos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8">Biografia</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Jovem empreendedor social, visionário e comprometido com o desenvolvimento da juventude angolana, 
                Edvânio Monteiro é o atual Presidente da Comissão Nacional dos Estagiários de Angola 🇦🇴 uma iniciativa 
                que visa promover oportunidades de estágio, integração profissional e capacitação de estudantes e 
                recém-formados em todo o território nacional.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Com forte senso de responsabilidade social e liderança ativa, fundou a CNEA com o objetivo de criar 
                uma ponte entre o meio académico e o mercado de trabalho, contribuindo para a redução do desemprego 
                juvenil e valorização do talento nacional.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                É responsável pela articulação com empresas, instituições públicas e privadas, além de coordenar 
                programas de orientação e acompanhamento de estagiários. A sua missão é clara: garantir que cada 
                jovem tenha a oportunidade de desenvolver competências profissionais em ambientes reais de trabalho.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Atualmente, lidera projetos em parceria com diversas entidades, como o INEP-Instituto de Estágio 
                Profissional de Angola 🇦🇴 Associação dos Estudantes e Profissionais Estagiários de Angola 🇦🇴 e 
                Coorporativa Multissetorial dos Estudantes e Profissionais Estagiários de Angola 🇦🇴 mantém um 
                compromisso firme com a ética, transparência e impacto social.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Founder;
