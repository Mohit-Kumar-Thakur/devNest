import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  MapPin,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Tag,
  Clock,
  User,
  Briefcase,
  Trophy,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logoImage from '@/assets/logo.png';

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'college_event' | 'opportunity' | 'hackathon';
  event_date: string | null;
  location: string | null;
  registration_link: string | null;
  image_url: string | null;
  tags: string[] | null;
  organizer: string | null;
  deadline: string | null;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'college_event' as const,
    event_date: '',
    location: '',
    registration_link: '',
    organizer: '',
    deadline: '',
    tags: ''
  });

  useEffect(() => {
    checkAuth();
    fetchEvents();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);

    // Check if user is admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const hasAdminRole = roles?.some(r => r.role === 'admin' || r.role === 'moderator');
    setIsAdmin(hasAdminRole || false);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
      return;
    }

    setEvents(data || []);
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and description",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('events')
      .insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        event_date: formData.event_date || null,
        location: formData.location || null,
        registration_link: formData.registration_link || null,
        organizer: formData.organizer || null,
        deadline: formData.deadline || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
        created_by: user?.id
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Event created successfully"
    });

    setShowCreateDialog(false);
    setFormData({
      title: '',
      description: '',
      category: 'college_event',
      event_date: '',
      location: '',
      registration_link: '',
      organizer: '',
      deadline: '',
      tags: ''
    });
    fetchEvents();
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Deleted",
      description: "Event deleted successfully"
    });
    fetchEvents();
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filteredCategory === 'all' || event.category === filteredCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college_event': return <Calendar className="w-4 h-4" />;
      case 'opportunity': return <Briefcase className="w-4 h-4" />;
      case 'hackathon': return <Trophy className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'college_event': return 'bg-primary/10 text-primary';
      case 'opportunity': return 'bg-accent/10 text-accent';
      case 'hackathon': return 'bg-logo-orange/10 text-logo-orange';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
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
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/anonymous-posts">Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Events & Opportunities 🎯</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with latest college events, opportunities, and hackathons
          </p>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'college_event', label: 'Events' },
              { id: 'opportunity', label: 'Opportunities' },
              { id: 'hackathon', label: 'Hackathons' }
            ].map(cat => (
              <Button
                key={cat.id}
                variant={filteredCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilteredCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {isAdmin && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gradient-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <Card 
              key={event.id} 
              className="animate-scale-in hover:shadow-hover transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {getCategoryIcon(event.category)}
                    <span className="ml-1 capitalize">{event.category.replace('_', ' ')}</span>
                  </Badge>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>
                
                {event.event_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                )}
                
                {event.organizer && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    {event.organizer}
                  </div>
                )}
                
                {event.deadline && (
                  <div className="flex items-center text-sm text-destructive">
                    <Clock className="w-4 h-4 mr-2" />
                    Deadline: {new Date(event.deadline).toLocaleDateString()}
                  </div>
                )}
                
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {event.registration_link && (
                  <Button
                    asChild
                    className="w-full"
                  >
                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Register Now
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground text-lg">No events found</p>
          </div>
        )}
      </div>

      {/* Create Event Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Event</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <Input
                  placeholder="Event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea
                  placeholder="Event description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-24"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category *</label>
                <div className="flex gap-2">
                  {[
                    { id: 'college_event', label: 'College Event' },
                    { id: 'opportunity', label: 'Opportunity' },
                    { id: 'hackathon', label: 'Hackathon' }
                  ].map(cat => (
                    <Button
                      key={cat.id}
                      variant={formData.category === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, category: cat.id as any })}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Event Date</label>
                  <Input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Deadline</label>
                  <Input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Event location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Organizer</label>
                <Input
                  placeholder="Organizer name"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Registration Link</label>
                <Input
                  placeholder="https://..."
                  value={formData.registration_link}
                  onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                <Input
                  placeholder="AI, ML, Workshop"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="gradient-primary text-primary-foreground"
                >
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Events;
