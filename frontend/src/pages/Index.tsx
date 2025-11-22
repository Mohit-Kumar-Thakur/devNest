import React, { useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { StatsSection } from '@/components/ui/stats-section';
import { CardsCarousel } from '@/components/ui/cards-carousel';
import { BookOpen, MessageSquare, Calendar, Users, Zap, Shield } from 'lucide-react';
import footerLogoImage from '@/assets/devnest-footer-logo.png';
import FloatingChatbot from "@/chatbot/FloatingChatbot";

// Import the new CSS file
import "../styles/landing.css";

const Index: React.FC = () => {
  
  // --- MOUSE TRACKING EFFECT (The "Spotlight" Logic) ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Select all glass cards
      const cards = document.querySelectorAll(".landing-glass-card");
      
      cards.forEach((card) => {
        // TypeScript requires casting to HTMLElement to access .style
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

  // --- Data Definitions ---

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

  const cardsData = [
    {
      id: 1,
      title: "Course Updates",
      description: "Get the latest announcements, schedule changes, and important notices from your professors in real-time.",
      icon: BookOpen,
      buttonText: "View All Updates",
      posts: courseUpdates,
      href: "/course-updates"
    },
    {
      id: 2,
      title: "Anonymous Posts",
      description: "Share thoughts, ask questions, or give feedback anonymously in a safe and moderated environment.",
      icon: MessageSquare,
      buttonText: "Browse Posts",
      posts: anonymousPosts,
      href: "/anonymous-posts"
    },
    {
      id: 3,
      title: "Events & Opportunities",
      description: "Discover hackathons, career fairs, workshops, and other exciting opportunities on campus.",
      icon: Calendar,
      buttonText: "Explore Events",
      posts: upcomingEvents,
      href: "/events"
    }
  ];

  return (
    <div className="landing-page-wrapper">
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>
      
      {/* Main Features */}
      <section className="py-16 relative z-10" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 landing-title-gradient z-10 p-10">Everything You Need</h2>
            <p className="landing-text-muted max-w-2xl mx-auto text-lg">
              From course updates to anonymous discussions, discover all the tools to enhance your college experience
            </p>
          </div>

          {/* 3D Carousel */}
          <CardsCarousel cards={cardsData} />

          {/* Additional Features - GLOSSY AND ANIMATED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            
            {/* Feature 1: Student Clubs */}
            <div className="landing-glass-card text-center group cursor-pointer">
              <div className="landing-icon-glow">
                <Users className="w-8 h-8 icon-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Student Clubs</h3>
              <p className="landing-text-muted text-sm">Connect with clubs and societies that match your interests</p>
            </div>

            {/* Feature 2: Gamification */}
            <div className="landing-glass-card text-center group cursor-pointer">
              <div className="landing-icon-glow">
                <Zap className="w-8 h-8 icon-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gamification</h3>
              <p className="landing-text-muted text-sm">Earn points, badges, and climb leaderboards for engagement</p>
            </div>

            {/* Feature 3: Safe Environment */}
            <div className="landing-glass-card text-center group cursor-pointer">
              <div className="landing-icon-glow">
                <Shield className="w-8 h-8 icon-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Safe Environment</h3>
              <p className="landing-text-muted text-sm">Moderated content ensures a respectful community space</p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="relative z-10">
        <StatsSection />
      </div>

      {/* Footer */}
      <footer className="landing-footer py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={footerLogoImage} 
              alt="devNest Logo" 
              className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="landing-text-muted mb-6">Building stronger college communities, one connection at a time.</p>
          <p className="text-sm text-gray-500">© 2025 devNest. Made with ❤️ for students.</p>
        </div>
      </footer>
      
      <FloatingChatbot/>
    </div>
  );
};

export default Index;