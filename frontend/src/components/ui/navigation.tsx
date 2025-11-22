import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, Calendar, Users, Bell, Search, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logoImage from '@/assets/logo.png';

const navigationItems = [
  { name: 'Course Updates', icon: MessageSquare, href: '/course-updates', protected: true },
  { name: 'Community', icon: MessageSquare, href: '/anonymous-posts', protected: true },
  { name: 'Events', icon: Calendar, href: '/events', protected: true }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleLogoutWithConfirmation = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      handleLogout();
    }
  };

  const handleProtectedNavigation = (href: string, isProtected: boolean) => {
    if (isProtected && !token) {
      navigate(`/auth?redirect=${href}`);
      setIsOpen(false);
    } else {
      navigate(href);
      setIsOpen(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .glossy-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(7, 234, 230, 0.15);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        .nav-content {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .nav-logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-logo-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(7, 234, 230, 0.3);
          box-shadow: 0 0 15px rgba(7, 234, 230, 0.2);
        }
        .nav-logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .nav-logo-gray { color: #9ca3af; }
        .nav-logo-primary {
          background: linear-gradient(135deg, #07eae6 0%, #05b8b5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-logo-orange { color: #ff9800; }

        .nav-items { display: none; align-items: center; gap: 8px; }
        @media (min-width: 768px) { .nav-items { display: flex; } }

        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .nav-item-btn:hover {
          background: rgba(7,234,230,0.15);
          border-color: rgba(7,234,230,0.3);
          color: #07eae6;
          transform: translateY(-2px);
        }

        .nav-actions { display: none; align-items: center; gap: 12px; }
        @media (min-width: 768px) { .nav-actions { display: flex; } }

        .nav-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .nav-icon-btn:hover {
          background: rgba(7,234,230,0.1);
          border-color: rgba(7,234,230,0.3);
          color: #07eae6;
        }

        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #ff9800;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,152,0,0.5);
        }

        .glossy-signin-btn {
          padding: 10px 24px;
          border-radius: 10px;
          border: 1px solid rgba(7,234,230,0.5);
          background: linear-gradient(135deg,rgba(7,234,230,1),rgba(5,184,181,1));
          color: #000;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        .glossy-logout-btn {
          padding: 5px 10px;
          border-radius: 10px;
          border: 0px solid rgba(244,67,54,0.5);
          background: linear-gradient(135deg,rgba(7, 234, 230, 0.55),rgba(5,184,181,1));
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(7,234,230,0.3);
          color: #07eae6;
        }
        @media (min-width: 768px) { .mobile-menu-btn { display: none; } }

        .mobile-menu { display: block; }
        @media (min-width: 768px) { .mobile-menu { display: none; } }

        .mobile-menu-content {
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
        }
      `}} />

      <nav className="glossy-nav">
        <div className="nav-content">

          <div className="nav-logo-section">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div className="nav-logo-image">
                <img
                  src={logoImage}
                  alt="devNest Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h1 className="nav-logo-text">
                <span className="nav-logo-gray">dev</span>
                <span className="nav-logo-primary">Ne</span>
                <span className="nav-logo-orange">st</span>
              </h1>
            </Link>
          </div>

          <div className="nav-items">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                title={item.name}
                onClick={() => handleProtectedNavigation(item.href, item.protected)}
                className="nav-item-btn"
              >
                <item.icon style={{ width: '16px', height: '16px' }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className="nav-actions">
            {token && (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  title="Notifications"
                  className="nav-icon-btn"
                >
                  <Bell style={{ width: '18px', height: '18px' }} />
                  <span className="notification-dot"></span>
                </button>

                <button
                  type="button"
                  aria-label="Search"
                  title="Search"
                  className="nav-icon-btn"
                >
                  <Search style={{ width: '18px', height: '18px' }} />
                </button>
              </>
            )}

            {!token && (
              <button
                type="button"
                aria-label="Search"
                title="Search"
                className="nav-icon-btn"
              >
                <Search style={{ width: '18px', height: '18px' }} />
              </button>
            )}

            {token ? (
              <button
                type="button"
                aria-label="Logout"
                title="Logout"
                onClick={handleLogoutWithConfirmation}
                className="glossy-logout-btn"
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Logout
              </button>
            ) : (
              <Link to="/auth" className="glossy-signin-btn">
                Sign In
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle Menu"
            title="Toggle Menu"
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ?
              <X style={{ width: '20px', height: '20px' }} /> :
              <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">

              {navigationItems.map((item) => (
                <button
                  type="button"
                  aria-label={item.name}
                  title={item.name}
                  key={item.name}
                  onClick={() => handleProtectedNavigation(item.href, item.protected)}
                  className="mobile-nav-item"
                >
                  <item.icon style={{ width: '18px', height: '18px' }} />
                  <span>{item.name}</span>
                </button>
              ))}

              <div className="mobile-auth-section">
                {token ? (
                  <>
                    <div className="mobile-user-info">
                      <User style={{ width: '18px', height: '18px', color: '#07eae6' }} />
                      <div style={{ flex: 1 }}>
                        <p className="mobile-user-name">{user?.name}</p>
                        <p className="mobile-user-email">{user?.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Logout"
                      title="Logout"
                      className="glossy-logout-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleLogoutWithConfirmation}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="glossy-signin-btn"
                    style={{ width: '100%', textAlign: 'center' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}

      </nav>
    </>
  );
};
