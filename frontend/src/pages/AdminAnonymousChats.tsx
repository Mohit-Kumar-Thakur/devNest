import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  Shield, 
  LogOut, 
  Search, 
  RefreshCw, 
  Eye, 
  User, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/styles/admin.css';

// Mock Data based on your screenshot
const MOCK_CHATS = [
  {
    id: 1,
    author: "Mystic Learner",
    status: "Identified",
    date: "22/11/2025, 7:49:36 pm",
    content: "hello",
    hash: "44f4a3dbb84c48e4d5b0c4bd4391bc4d",
    identified: true
  },
  {
    id: 2,
    author: "Mohit Kumar Thakur",
    status: "Identified",
    date: "21/11/2025, 11:56:23 pm",
    content: "hiii",
    hash: "44f4a3dbb84c48e4d5b0c4bd4391bc4d",
    identified: true
  },
  {
    id: 3,
    author: "Mystic Learner",
    status: "Identified",
    date: "21/11/2025, 11:56:10 pm",
    content: "hiii",
    hash: "44f4a3dbb84c48e4d5b0c4bd4391bc4d",
    identified: true
  }
];

const AdminAnonymousChats = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Spotlight Effect
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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-page-wrapper">
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
                <p className="text-xs text-gray-400">Welcome, {user?.name || "Admin"}</p>
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
        
        {/* Navigation Tabs (Simulated) */}
        <div className="mb-8">
          <div className="admin-glass-card p-1 inline-flex rounded-lg">
            <button className="px-6 py-2 bg-blue-500/20 text-blue-400 rounded-md text-sm font-medium border border-blue-500/30">
              <MessageSquare className="w-4 h-4 inline-block mr-2" />
              All Anonymous Chats
            </button>
          </div>
        </div>

        <div className="admin-grid-layout">
          {/* Left Column: Chat List */}
          <div className="space-y-6">
            
            {/* Search Bar Panel */}
            <div className="admin-glass-card p-6 flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-bold text-white whitespace-nowrap">All Anonymous Chats</h2>
              
              <div className="flex gap-2 flex-1 min-w-[200px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search chats..." 
                    className="chat-search-bar pl-10"
                  />
                </div>
                <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chats List */}
            <div className="space-y-4">
              {MOCK_CHATS.map((chat) => (
                <div key={chat.id} className="admin-glass-card p-6 transition-transform hover:translate-x-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2 items-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {chat.author}
                      </span>
                      {chat.identified && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {chat.status}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{chat.date}</span>
                  </div>

                  <p className="text-white mb-6 text-lg">{chat.content}</p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Author Hash</span>
                      <code className="author-hash">{chat.hash}</code>
                    </div>
                    <Button 
                      onClick={() => setSelectedChat(chat.id)}
                      size="sm"
                      className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Author
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Author Info Panel */}
          <div className="admin-glass-card p-6 sticky top-24 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Author Information</h3>
            </div>

            {selectedChat ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {/* This would be populated with real user details */}
                 <div className="flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold mb-4">
                      {MOCK_CHATS.find(c => c.id === selectedChat)?.author[0]}
                    </div>
                    <h4 className="text-xl font-bold mb-1">{MOCK_CHATS.find(c => c.id === selectedChat)?.author}</h4>
                    <p className="text-sm text-gray-400 mb-6">Student • ECE Dept</p>
                    
                    <div className="w-full space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Reported</span>
                        <span className="text-white">0 times</span>
                      </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="reveal-overlay">
                <Eye className="w-12 h-12 opacity-50" />
                <div>
                  <p className="font-medium text-white/70">Select a chat to view details</p>
                  <p className="text-xs mt-2 text-white/40">Click "View Author" to reveal identity</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnonymousChats;