import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoCnea from "@/assets/logo-cnea.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    // Se não estiver na página inicial, navega primeiro
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-lg border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("inicio")}
            className="flex items-center space-x-3 hover:opacity-80 transition-smooth"
          >
            <img src={logoCnea} alt="Logo CNEA" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-foreground">CNEA</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Centro de Formação</span>
            </div>
          </button>

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
            <Button variant="ghost" onClick={() => navigate("/fundador")}>
              Fundador
            </Button>
            <ThemeToggle />
            <Button variant="default" onClick={() => navigate("/login")}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
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
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate("/fundador");
                setIsMenuOpen(false);
              }}
            >
              Fundador
            </Button>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Tema</span>
              <ThemeToggle />
            </div>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
