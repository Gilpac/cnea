import { Facebook, Phone, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">CNEA</h3>
              </div>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              Comissão Nacional dos Estagiários de Angola - Organização, certificação e 
              promoção de estágios profissionais.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("inicio")}
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("entidades")}
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  Entidades
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("programas")}
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  Programas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("beneficios")}
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  Benefícios
                </button>
              </li>
            </ul>
          </div>

          {/* Entities */}
          <div>
            <h4 className="font-bold text-lg mb-4">Entidades</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>INEP - Instituto Nacional de Estágios Profissionais</li>
              <li>AEPEA - Associação dos Estudantes Estagiários</li>
              <li>CMPEA - Corporativa Multissetorial</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://wa.me/244932787330" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  <Phone size={16} />
                  <span>+244 932 787 330</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/Reivindicamos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  <Facebook size={16} />
                  <span>Reivindicamos</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@cnea-angola.ao"
                  className="flex items-center space-x-2 text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth text-sm"
                >
                  <Mail size={16} />
                  <span>info@cnea-angola.ao</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm text-center md:text-left">
              © {currentYear} CNEA - Comissão Nacional dos Estagiários de Angola. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-secondary-foreground/60">
              <a href="#" className="hover:text-secondary-foreground transition-smooth">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-secondary-foreground transition-smooth">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
