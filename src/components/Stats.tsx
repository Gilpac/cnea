import { TrendingUp, Award, Users } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const Stats = () => {
  const [counters, setCounters] = useState({ stat0: 0, stat1: 0, stat2: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: Users,
      value: 3,
      suffix: "",
      label: "Entidades Representadas",
      color: "text-primary"
    },
    {
      icon: Award,
      value: 100,
      suffix: "%",
      label: "Certificação Nacional",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      value: 1000,
      suffix: "+",
      prefix: "",
      label: "Estagiários Apoiados",
      color: "text-primary"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          stats.forEach((stat, index) => {
            const duration = 2000;
            const steps = 60;
            const stepValue = stat.value / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
              currentStep++;
              if (currentStep <= steps) {
                setCounters(prev => ({
                  ...prev,
                  [`stat${index}`]: Math.floor(stepValue * currentStep)
                }));
              } else {
                clearInterval(timer);
              }
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-8 animate-fade-in">
          <h2 className="mb-3 md:mb-4 text-foreground text-3xl md:text-4xl">Números que Fazem a Diferença</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            A nossa missão é apoiar e certificar estagiários em todo o país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-card rounded-xl p-6 border-2 border-border hover:border-primary transition-smooth hover:shadow-xl animate-fade-in hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stat.color === 'text-primary' ? 'bg-primary/10' : 'bg-accent/10'} group-hover:scale-110 transition-smooth`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                {counters[`stat${index}` as keyof typeof counters]}{stat.suffix}
              </div>
              <div className="text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
