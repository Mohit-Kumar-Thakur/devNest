import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MessageCircle, Calendar, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CountUp } from '@/components/ui/count-up'; // NEW IMPORT
import heroImage from '@/assets/landing-bg.jpg';
import Spline from '@splinetool/react-spline';

const stats = [
  { icon: Users, label: 'Active Students', value: 2500 },
  { icon: MessageCircle, label: 'Posts Today', value: 150 },
  { icon: Calendar, label: 'Upcoming Events', value: 12 },
];

export const HeroSection = () => {
  const { user, token } = useAuth();

  return (
    <section className="relative min-h-[600px] gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[4200px] h-[900px]">
          <Spline scene="https://prod.spline.design/KfiqpIbAsWzPAjUU/scene.splinecode" />
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          {/* Dynamic Heading based on authentication */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {token ? (
              <>
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  {user?.name}!
                </span>
              </>
            ) : (
              <>
                Your College{' '}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Community Hub
                </span>
              </>
            )}
          </h1>

          {/* Dynamic Subtitle based on authentication */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {token 
              ? `Ready to explore course updates, share your thoughts, and discover exciting events? Your community awaits!`
              : `Stay connected with course updates, share thoughts anonymously, discover events, and build lasting connections in your academic community.`
            }
          </p>

          {/* Dynamic Buttons based on authentication */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {token ? (
              <>
                <Button 
                  size="lg" 
                  className="gradient-primary text-primary-foreground shadow-hover transition-bounce group"
                  asChild
                >
                  <Link to="/dashboard">
                    Go to Dashboard
                    <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-smooth" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 hover:bg-primary/5"
                  asChild
                >
                  <Link to="/events">
                    Explore Events
                  </Link>
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Stats with CountUp Animation */}
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
                
                {/* CountUp Animation */}
                <div className="text-2xl font-bold text-foreground mb-1">
                  <CountUp
                    value={stat.value}
                    duration={2.5}
                    suffix={stat.label.includes('Events') ? '' : '+'}
                    separator=","
                    triggerOnView={true}
                    animationStyle="spring"
                    colorScheme="default"
                    className="text-2xl"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Welcome message for authenticated users */}
          {token && (
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20 max-w-md mx-auto">
              <p className="text-sm text-primary">
                <strong>Welcome back!</strong> You're all set to explore everything devNest has to offer.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};