import React, { useEffect } from 'react';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';
import '@/styles/landing.css';

const stats = [
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Student Engagement',
    description: 'Active participation rate',
    iconColorClass: 'icon-accent'
  },
  {
    icon: Award,
    value: '500+',
    label: 'Achievements Earned',
    description: 'Badges and certifications',
    iconColorClass: 'icon-warning'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Platform Availability',
    description: 'Always accessible',
    iconColorClass: 'icon-primary'
  },
  {
    icon: Target,
    value: '15+',
    label: 'Active Courses',
    description: 'Different departments',
    iconColorClass: 'icon-destructive'
  }
];

export const StatsSection: React.FC = () => {
  
  // Mouse tracking logic for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".landing-glass-card");
      
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const rect = htmlCard.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        htmlCard.style.setProperty("--x", x.toString());
        htmlCard.style.setProperty("--y", y.toString());
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    // No background color class here, letting the pure black body show through
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 landing-title-gradient z-10 p-2">
            Platform Impact
          </h2>
          <p className="landing-text-muted max-w-2xl mx-auto text-lg">
            See how devNest is transforming student engagement and academic collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="landing-glass-card stat-card group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="landing-icon-glow">
                <stat.icon className={`w-8 h-8 ${stat.iconColorClass}`} />
              </div>
              
              <div className="stat-value-gradient">
                {stat.value}
              </div>
              
              <div className="font-semibold text-white mb-1 text-lg">
                {stat.label}
              </div>
              
              <div className="text-sm landing-text-muted">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};