import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  posts?: Array<{
    title: string;
    author?: string;
    time: string;
    content: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  posts,
  className,
  style,
  href = "/course-updates"
}: FeatureCardProps) => {
  return (
    <Card className={`group hover:shadow-hover transition-smooth ${className}`} style={style}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">{description}</p>

        {posts && (
          <div className="space-y-3 mb-6">
            {posts.map((post, index) => (
              <div 
                key={index}
                className="p-3 bg-secondary/50 rounded-lg border border-border/50 hover:bg-secondary/70 transition-smooth"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{post.title}</h4>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                {post.author && (
                  <p className="text-xs text-muted-foreground mb-1">by {post.author}</p>
                )}
                <p className="text-sm text-muted-foreground">{post.content}</p>
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full gradient-primary text-primary-foreground shadow-card group-hover:shadow-hover transition-smooth"
          asChild
        >
          <Link to={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};