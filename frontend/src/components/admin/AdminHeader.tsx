import { Button } from "@/components/ui/button";
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader = ({ title = "Admin Dashboard" }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};