import { ArrowRight, Users, MessageCircle, Calendar, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CountUp } from '@/components/ui/count-up';
import heroImage from '@/assets/landing-bg.jpg';
import '@/styles/hero-styles.css';

const stats = [
  { icon: Users, label: 'Active Students', value: 2500 },
  { icon: MessageCircle, label: 'Posts Today', value: 150 },
  { icon: Calendar, label: 'Upcoming Events', value: 12 },
];

export const HeroSection = () => {
  const { user, token } = useAuth();

  return (
    <section className="hero-section">
      {/* Background */}
      <div className="hero-bg-wrapper">
        <div
          className="hero-bg-image"
          style={{ backgroundImage: `url(${heroImage})` }}
          role="img"
          aria-label="College community background"
        />
        <div className="hero-bg-overlay" />
        
        {/* Animated Glow Spots */}
        <div className="hero-glow-spot hero-glow-spot-1" aria-hidden="true" />
        <div className="hero-glow-spot hero-glow-spot-2" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="hero-content hero-animate-fade-in">
        {/* Title */}
        <h1 className="hero-title">
          {token ? (
            <>
              <span className="hero-title-white">Welcome back, </span>
              <span className="hero-title-accent">{user?.name}!</span>
            </>
          ) : (
            <>
              <span className="hero-title-white">Your College </span>
              <span className="hero-title-accent">Community Hub</span>
            </>
          )}
        </h1>

        {/* Description */}
        <p className="hero-description">
          {token
            ? `Ready to explore course updates, share your thoughts, and discover exciting events? Your community awaits!`
            : `Stay connected with course updates, share thoughts anonymously, discover events, and build lasting connections in your academic community.`}
        </p>

        {/* Buttons */}
        <div className="hero-buttons-group">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="hero-btn-primary"
                title="Go to your dashboard"
              >
                <span>Go to Dashboard</span>
                <Rocket className="hero-btn-icon w-5 h-5" />
              </Link>
              <Link
                to="/events"
                className="hero-btn-secondary"
                title="Explore upcoming events"
              >
                <span>Explore Events</span>
                <ArrowRight className="hero-btn-icon w-5 h-5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hero-btn-primary"
                title="Create an account or login"
              >
                <span>Get Started</span>
                <ArrowRight className="hero-btn-icon w-5 h-5" />
              </Link>
              <button
                className="hero-btn-secondary"
                onClick={() => {
                  const element = document.querySelector('[data-section="features"]');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                title="Learn more about devNest"
              >
                <span>Learn More</span>
              </button>
            </>
          )}
        </div>

        {/* Stats Grid */}
        <div className="hero-stats-grid hero-animate-slide-up">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="hero-stat-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="hero-stat-icon">
                <stat.icon className="w-6 h-6" />
              </div>

              <div className="hero-stat-value">
                <CountUp
                  value={stat.value}
                  duration={2.5}
                  suffix={stat.label.includes('Events') ? '' : '+'}
                  separator=","
                  triggerOnView
                  animationStyle="spring"
                  colorScheme="default"
                  className="text-2xl"
                />
              </div>

              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Welcome Message */}
        {token && (
          <div className="hero-welcome-card">
            <p className="hero-welcome-text">
              <strong>Welcome back!</strong> You're all set to explore everything devNest has to offer.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};