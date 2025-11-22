import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Users, Shield, LogOut, Trash2, UserCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/styles/admin.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Spotlight Effect Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".admin-glass-card");
      
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const rect = htmlCard.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        htmlCard.style.setProperty("--x", x.toString());
        htmlCard.style.setProperty("--y", y.toString());
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [users, loading]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []); // Ensure array fallback
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-page-wrapper flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="admin-header">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl admin-title-gradient">Admin Portal</h1>
                <p className="text-xs text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              size="sm"
              className="btn-glass-danger bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="admin-glass-card p-6 flex items-center space-x-4">
            <div className="stat-icon-wrapper">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{users.length}</p>
              <p className="text-sm text-gray-400">Total Registered Users</p>
            </div>
          </div>

          {/* Regular Users Card */}
          <div className="admin-glass-card p-6 flex items-center space-x-4">
            <div className="stat-icon-wrapper">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'user').length}
              </p>
              <p className="text-sm text-gray-400">Active Students</p>
            </div>
          </div>

          {/* Admins Card */}
          <div className="admin-glass-card p-6 flex items-center space-x-4">
            <div className="stat-icon-wrapper">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-sm text-gray-400">Administrators</p>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="admin-glass-card p-0">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">User Management Database</h2>
            <p className="text-sm text-gray-400">Manage access and roles for all platform users</p>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>
                      <div className="font-medium text-white">{userItem.name}</div>
                    </td>
                    <td className="text-gray-400">{userItem.email}</td>
                    <td>
                      <span className={`admin-badge ${userItem.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {userItem.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-gray-400">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {userItem.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;