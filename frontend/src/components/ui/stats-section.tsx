import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Student Engagement',
    description: 'Active participation rate',
    color: 'text-accent'
  },
  {
    icon: Award,
    value: '500+',
    label: 'Achievements Earned',
    description: 'Badges and certifications',
    color: 'text-warning'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Platform Availability',
    description: 'Always accessible',
    color: 'text-primary'
  },
  {
    icon: Target,
    value: '15+',
    label: 'Active Courses',
    description: 'Different departments',
    color: 'text-destructive'
  }
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how devNest is transforming student engagement and academic collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="group hover:shadow-hover transition-smooth animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-xl mb-4 group-hover:scale-110 transition-bounce">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};