import { Phone, Facebook, MapPin, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "WhatsApp",
      content: "+244 932 787 330",
      link: "https://wa.me/244932787330",
      action: "Enviar Mensagem"
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "Reivindicamos",
      link: "https://www.facebook.com/Reivindicamos",
      action: "Visitar Página"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@cnea-angola.ao",
      link: "mailto:info@cnea-angola.ao",
      action: "Enviar Email"
    },
    {
      icon: MapPin,
      title: "Localização",
      content: "Luanda, Angola",
      link: "#",
      action: "Ver Mapa"
    }
  ];

  return (
    <section id="contatos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="mb-4 md:mb-6 text-foreground">Entre em Contacto</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Tem alguma dúvida ou precisa de mais informações? 
            Nossa equipa está pronta para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {contactInfo.map((contact, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary transition-smooth hover:shadow-xl gradient-card group animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow-red transition-smooth">
                  <contact.icon className="text-primary-foreground" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {contact.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {contact.content}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <a 
                    href={contact.link} 
                    target={contact.link.startsWith('http') ? '_blank' : undefined}
                    rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {contact.action}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="max-w-3xl mx-auto">
            <MessageCircle className="mx-auto mb-6 text-accent" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground">
              Pronto para Iniciar Sua Jornada Profissional?
            </h3>
            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              Entre em contacto connosco através do WhatsApp para obter mais informações 
              sobre programas de estágio e a Carteira Profissional CNEA.
            </p>
            <Button 
              variant="accent" 
              size="xl"
              className="hover:scale-105"
              asChild
            >
              <a 
                href="https://wa.me/244932787330" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Phone className="mr-2" size={20} />
                Contactar via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
