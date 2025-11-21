import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo.png';

export const AnonymousHeader = () => {
  return (
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
              <Link to="/course-updates">Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};