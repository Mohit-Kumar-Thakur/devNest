import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  Award,
  TrendingUp 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

const Dashboard = () => {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    avatar: null,
    joinDate: 'September 2024',
    points: 1250,
    level: 'Active Contributor'
  });

  const stats = [
    { label: 'Posts Created', value: '24', icon: MessageSquare, color: 'text-primary' },
    { label: 'Events Attended', value: '8', icon: Calendar, color: 'text-accent' },
    { label: 'Courses Following', value: '12', icon: BookOpen, color: 'text-warning' },
    { label: 'Badges Earned', value: '6', icon: Award, color: 'text-destructive' }
  ];

  const recentActivity = [
    { action: 'Posted in CS101 Discussion', time: '2 hours ago', type: 'post' },
    { action: 'Joined Tech Hackathon 2024', time: '1 day ago', type: 'event' },
    { action: 'Anonymous post received 15 likes', time: '2 days ago', type: 'achievement' },
    { action: 'Completed Data Structures Quiz', time: '3 days ago', type: 'course' }
  ];

  const handleLogout = () => {
    // TODO: Implement Supabase logout
    alert('Logout functionality requires Supabase integration!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="devNest Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold">
                <span className="text-logo-gray">dev</span>
                <span className="text-primary">Ne</span>
                <span className="text-logo-orange">st</span>
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}! 👋</h1>
              <p className="text-muted-foreground">
                Member since {user.joinDate} • {user.points} points earned
              </p>
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {user.level}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-2 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Explore devNest</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/#courses">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Course Updates
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/#anonymous">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Anonymous Posts
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/#events">
                        <Calendar className="w-4 h-4 mr-2" />
                        Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">🎯 Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Join today's discussion in CS101!
                  </p>
                  <Button size="sm" className="gradient-primary text-primary-foreground">
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Note about Supabase */}
        <div className="mt-8 p-4 bg-card/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> This dashboard shows demo data. Connect to Supabase to display real user information, 
            authentication state, and dynamic content based on user activity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;