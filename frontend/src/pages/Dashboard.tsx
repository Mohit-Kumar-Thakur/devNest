import { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  Award,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logoImage from '@/assets/logo.png';
import '../styles/dashboard-styles.css';

const Dashboard = () => {
  const { user: authUser, logout, token, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !token) {
      navigate('/auth?redirect=/dashboard');
      return;
    }
    
    // Set loading false when auth is checked
    if (!loading) {
      setIsLoading(false);
    }
  }, [token, loading, navigate]);

  // Track mouse position for glow effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.stat-card, .content-card, .challenge-card, .welcome-avatar');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          (card as HTMLElement).style.setProperty('--x', `${x}`);
          (card as HTMLElement).style.setProperty('--y', `${y}`);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="dashboard-page-wrapper flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07eae6] mx-auto mb-4"></div>
          <p className="text-[rgba(255,255,255,0.7)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Use real user data from auth context
  const user = {
    name: authUser?.name || 'User',
    email: authUser?.email || 'user@example.com',
    avatar: null,
    joinDate: 'September 2024',
    points: 1250,
    level: 'Active Contributor',
    role: authUser?.role || 'user'
  };

  const stats = [
    { 
      label: 'Posts Created', 
      value: '24', 
      icon: MessageSquare, 
      color: '#07eae6'
    },
    { 
      label: 'Events Attended', 
      value: '8', 
      icon: Calendar, 
      color: '#07eae6'
    },
    { 
      label: 'Courses Following', 
      value: '12', 
      icon: BookOpen, 
      color: '#07eae6'
    },
    { 
      label: 'Badges Earned', 
      value: '6', 
      icon: Award, 
      color: '#07eae6'
    }
  ];

  const recentActivity = [
    { action: 'Posted in CS101 Discussion', time: '2 hours ago', type: 'post' },
    { action: 'Joined Tech Hackathon 2024', time: '1 day ago', type: 'event' },
    { action: 'Anonymous post received 15 likes', time: '2 days ago', type: 'achievement' },
    { action: 'Completed Data Structures Quiz', time: '3 days ago', type: 'course' }
  ];

  const quickActions = [
    { 
      label: 'Course Updates', 
      icon: BookOpen, 
      link: '/course-updates'
    },
    { 
      label: 'Anonymous Posts', 
      icon: MessageSquare, 
      link: '/anonymous-posts'
    },
    { 
      label: 'Events', 
      icon: Calendar, 
      link: '/events'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoutWithConfirmation = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      handleLogout();
    }
  };

  return (
    <div className="dashboard-page-wrapper min-h-screen">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={logoImage} 
                alt="devNest Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="header-logo">
              <span style={{ color: '#888b92' }}>dev</span>
              <span style={{ color: '#07eae6' }}>Ne</span>
              <span style={{ color: '#ff9800' }}>st</span>
            </h1>
          </Link>

          <div className="header-actions">
            <button 
              type="button"
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/70 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              type="button"
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/70 hover:text-white"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={handleLogoutWithConfirmation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#07eae6] to-[#05b8b5] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#07eae6]/50 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-avatar">
              <User className="w-10 h-10" style={{ color: '#07eae6' }} />
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user.name}!</h1>
              {user.role && (
                <div className="welcome-badge">
                  {user.role}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-white">Your Activity</h2>
              <div className="dashboard-grid">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-card"
                  >
                    <div className="stat-icon-wrapper">
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Card */}
            <div>
              <div className="content-card">
                <h2 className="content-card-title">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-time">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-6 text-white">Quick Actions</h2>
              
              {/* Explore devNest Card */}
              <div className="content-card mb-6">
                <h3 className="content-card-title text-base mb-4">Explore devNest</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="quick-action"
                      title={action.label}
                    >
                      <action.icon className="w-5 h-5" />
                      <span>{action.label}</span>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Daily Challenge Card */}
              <div className="challenge-card">
                <div className="challenge-title">🎯 Daily Challenge</div>
                <p className="challenge-description">
                  Join today's discussion in CS101 and earn bonus points!
                </p>
                <button 
                  type="button"
                  className="action-btn"
                  title="Join the daily challenge"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold mb-6 text-white">This Month's Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="content-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Top Contributor</h3>
                <TrendingUp className="w-5 h-5" style={{ color: '#07eae6' }} />
              </div>
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-[#07eae6] bg-clip-text mb-2">
                Top 5%
              </p>
              <p className="text-sm text-white/60">Among all active contributors</p>
            </div>

            <div className="content-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">This Week</h3>
                <Award className="w-5 h-5" style={{ color: '#07eae6' }} />
              </div>
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-[#07eae6] bg-clip-text mb-2">
                320 pts
              </p>
              <p className="text-sm text-white/60">Points earned this week</p>
            </div>

            <div className="content-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Streak</h3>
                <Calendar className="w-5 h-5" style={{ color: '#07eae6' }} />
              </div>
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-[#07eae6] bg-clip-text mb-2">
                15 days
              </p>
              <p className="text-sm text-white/60">Keep it going!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;