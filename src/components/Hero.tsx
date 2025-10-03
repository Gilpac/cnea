import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cnea.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: heroImage,
      title: "Comissão Nacional dos Estagiários",
      subtitle: "Certificação e promoção de estágios profissionais em Angola",
      cta: "Explorar Programas",
      ctaAction: "programas"
    },
    {
      image: heroImage,
      title: "Oportunidades de Carreira",
      subtitle: "Construindo pontes entre formação e mercado de trabalho",
      cta: "Ver Benefícios",
      ctaAction: "beneficios"
    },
    {
      image: heroImage,
      title: "Certificação Nacional",
      subtitle: "Reconhecimento oficial do seu estágio profissional",
      cta: "Saber Mais",
      ctaAction: "entidades"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-16 md:pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slides[currentSlide].image}
          alt="Estagiários profissionais em formação"
          className="w-full h-full object-cover transition-smooth"
        />
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
      </div>


      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl text-left text-white">
          <h1 className="mb-6 animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed animate-fade-in max-w-2xl">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start animate-fade-in">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => scrollToSection(slides[currentSlide].ctaAction)}
            >
              {slides[currentSlide].cta}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-2 border-white bg-background/10 text-white hover:bg-white hover:text-foreground backdrop-blur-sm"
              onClick={() => scrollToSection("contatos")}
            >
              Fale Connosco
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-12 bg-white' 
                    : 'w-8 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
