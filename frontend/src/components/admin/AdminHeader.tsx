import { Shield, LogOut } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader = ({ title = "Admin Portal" }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="max-w-7xl mx-auto p-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div style={{
              background: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              padding: '8px'
            }}>
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl admin-title-gradient">{title}</h1>
              <p className="text-xs text-gray-400">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-glass-danger"
            title="Logout from admin portal"
            aria-label="Logout"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px'
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};