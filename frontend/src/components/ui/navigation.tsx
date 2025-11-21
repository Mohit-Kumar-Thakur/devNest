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

  // Handle navigation click for protected routes
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
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="devNest Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-logo-gray">dev</span>
                <span className="text-primary">Ne</span>
                <span className="text-logo-orange">st</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Show ALL items */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleProtectedNavigation(item.href, item.protected)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {token && (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {!token && (
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            )}

            {/* User/Login Section */}
            {token ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogoutWithConfirmation}
                  className="gradient-primary text-primary-foreground shadow-soft"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="gradient-primary text-primary-foreground shadow-soft" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation - Show ALL items */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {/* Navigation Items - Show ALL */}
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleProtectedNavigation(item.href, item.protected)}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-smooth"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}

              {/* Auth Section */}
              <div className="px-4 pt-4 border-t border-border space-y-3">
                {token ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-2 py-2 bg-secondary rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      onClick={handleLogoutWithConfirmation}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="w-full gradient-primary text-primary-foreground" 
                    onClick={() => handleProtectedNavigation('/auth', false)}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};