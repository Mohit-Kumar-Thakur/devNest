import { Navigation } from '@/components/ui/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { FeatureCard } from '@/components/ui/feature-card';
import { StatsSection } from '@/components/ui/stats-section';
import { BookOpen, MessageSquare, Calendar, Users, Zap, Shield } from 'lucide-react';
import logoImage from '@/assets/logo.png';
import footerLogoImage from '@/assets/devnest-footer-logo.png';

const Index = () => {
  const courseUpdates = [
    {
      title: "Physics Lab Schedule Change",
      author: "Dr. Smith",
      time: "2h ago",
      content: "Lab session moved to Thursday 2PM"
    },
    {
      title: "Assignment Deadline Extended",
      author: "Prof. Johnson",
      time: "4h ago", 
      content: "Database project due date extended to next Friday"
    }
  ];

  const anonymousPosts = [
    {
      title: "Study Group for Finals?",
      time: "1h ago",
      content: "Anyone interested in forming a study group for calculus finals?"
    },
    {
      title: "Library Feedback",
      time: "3h ago",
      content: "The new study rooms are amazing! Great job campus facilities."
    }
  ];

  const upcomingEvents = [
    {
      title: "Tech Hackathon 2024",
      time: "Dec 15",
      content: "48-hour coding competition with prizes worth $10,000"
    },
    {
      title: "Career Fair",
      time: "Dec 20",
      content: "Meet recruiters from top tech companies"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Main Features */}
      <section className="py-16" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From course updates to anonymous discussions, discover all the tools to enhance your college experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              title="Course Updates"
              description="Get the latest announcements, schedule changes, and important notices from your professors in real-time."
              icon={BookOpen}
              buttonText="View All Updates"
              posts={courseUpdates}
              className="animate-slideUp"
            />

            <FeatureCard
              title="Anonymous Posts"
              description="Share thoughts, ask questions, or give feedback anonymously in a safe and moderated environment."
              icon={MessageSquare}
              buttonText="Browse Posts"
              posts={anonymousPosts}
              className="animate-slideUp"
              style={{ animationDelay: '0.2s' }}
              href="/anonymous-posts"
            />

            <FeatureCard
              title="Events & Opportunities"
              description="Discover hackathons, career fairs, workshops, and other exciting opportunities on campus."
              icon={Calendar}
              buttonText="Explore Events"
              posts={upcomingEvents}
              className="animate-slideUp"
              style={{ animationDelay: '0.4s' }}
              href="/events"
            />
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-smooth">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Clubs</h3>
              <p className="text-muted-foreground">Connect with clubs and societies that match your interests</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-xl mb-4 group-hover:bg-accent/20 transition-smooth">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamification</h3>
              <p className="text-muted-foreground">Earn points, badges, and climb leaderboards for engagement</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-xl mb-4 group-hover:bg-warning/20 transition-smooth">
                <Shield className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe Environment</h3>
              <p className="text-muted-foreground">Moderated content ensures a respectful community space</p>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={footerLogoImage} 
              alt="devNest Logo" 
              className="h-24 w-auto"
            />
          </div>
          <p className="text-muted-foreground mb-6">Building stronger college communities, one connection at a time.</p>
          <p className="text-sm text-muted-foreground">© 2024 devNest. Made with ❤️ for students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
