import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/college-hero.jpg';

const stats = [
  { icon: Users, label: 'Active Students', value: '2,500+' },
  { icon: MessageCircle, label: 'Posts Today', value: '150+' },
  { icon: Calendar, label: 'Upcoming Events', value: '12' },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] gradient-hero overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your College{' '}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Community Hub
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Stay connected with course updates, share thoughts anonymously, discover events, 
            and build lasting connections in your academic community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="gradient-primary text-primary-foreground shadow-hover transition-bounce group"
              asChild
            >
              <Link to="/auth">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/5"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideUp">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3 group-hover:bg-primary/20 transition-smooth">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};