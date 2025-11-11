import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, Calendar, Users, Bell, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

const navigationItems = [
  { name: 'Course Updates', icon: MessageSquare, href: '/course-updates' },
  { name: 'Community', icon: MessageSquare, href: '/anonymous-posts' },
  { name: 'Events', icon: Calendar, href: '/events' },
  { name: 'Clubs', icon: Users, href: '#clubs' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button className="gradient-primary text-primary-foreground shadow-soft" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
              <div className="px-4 pt-4 border-t border-border">
                <Button className="w-full gradient-primary text-primary-foreground" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};