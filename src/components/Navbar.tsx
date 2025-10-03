import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-lg border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl md:text-2xl">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-foreground">CNEA</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Centro de Formação</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" onClick={() => scrollToSection("inicio")}>
              Início
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("entidades")}>
              Entidades
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("programas")}>
              Programas
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("beneficios")}>
              Benefícios
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("recursos")}>
              Recursos
            </Button>
            <Button variant="outline" onClick={() => navigate("/portal")}>
              <LogIn className="mr-2 h-4 w-4" />
              Portal do Candidato
            </Button>
            <Button variant="default" onClick={() => navigate("/inscricao")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inscrever-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("inicio")}
            >
              Início
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("entidades")}
            >
              Entidades
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("programas")}
            >
              Programas
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("beneficios")}
            >
              Benefícios
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection("recursos")}
            >
              Recursos
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                navigate("/portal");
                setIsMenuOpen(false);
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Portal do Candidato
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                navigate("/inscricao");
                setIsMenuOpen(false);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Inscrever-se
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
