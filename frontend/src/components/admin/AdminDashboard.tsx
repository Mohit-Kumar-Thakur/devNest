import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Eye, Search, Trash2, Flag, User, MessageSquare, TrendingUp } from 'lucide-react';
import '@/styles/admin.css';

// Types
type AdminTab = 'anonymous' | 'flagged' | 'analytics';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  status: 'identified' | 'pending';
  authorHash: string;
  flag?: {
    level: 'high' | 'medium' | 'low';
    reason: string;
  };
}

interface Author {
  id: string;
  name: string;
  email: string;
  hash: string;
  postCount: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

// AdminHeader Component
const AdminHeader: React.FC = () => {
  const handleLogout = () => {
    // Add logout logic
    console.log('Logging out...');
  };

  return (
    <header className="admin-header">
      <div className="max-w-7xl mx-auto p-0 " >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div style={{
              background: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(37, 99, 235, 0.2)'
            }}>
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl admin-title-gradient">Admin Portal</h1>
              <p className="text-xs text-gray-400">Welcome back, Administrator</p>
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

// AdminTabs Component
interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'anonymous', label: 'Anonymous Posts', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'flagged', label: 'Flagged Content', icon: <Flag className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="admin-tabs-container">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// AnonymousPostsTab Component
interface AnonymousPostsTabProps {
  onAuthorIdentify: (author: Author) => void;
  selectedAuthor: Author | null;
  onCloseAuthor: () => void;
}

const AnonymousPostsTab: React.FC<AnonymousPostsTabProps> = ({
  onAuthorIdentify,
  selectedAuthor,
  onCloseAuthor
}) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Mystic Learner',
      content: 'hello',
      timestamp: '22/11/2025, 7:49:36 pm',
      status: 'identified',
      authorHash: '44f4a3dbb84c48e4d5b0c4bd4391bc4d'
    },
    {
      id: '2',
      author: 'Mohit Kumar Thakur',
      content: 'hiii',
      timestamp: '21/11/2025, 11:56:23 pm',
      status: 'identified',
      authorHash: '44f4a3dbb84c48e4d5b0c4bd4391bc4d'
    },
    {
      id: '3',
      author: 'Mystic Learner',
      content: 'hiii',
      timestamp: '21/11/2025, 11:56:10 pm',
      status: 'identified',
      authorHash: '44f4a3dbb84c48e4d5b0c4bd4391bc4d'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post =>
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAuthor = (post: Post) => {
    setSelectedPostId(post.id);
    const author: Author = {
      id: post.authorHash,
      name: post.author,
      email: `${post.author.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      hash: post.authorHash,
      postCount: posts.filter(p => p.authorHash === post.authorHash).length,
      joinDate: '2024-11-15',
      status: 'active'
    };
    onAuthorIdentify(author);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
      if (selectedPostId === postId) {
        onCloseAuthor();
      }
    }
  };

  return (
    <div className="admin-posts-grid">
      {/* Posts List */}
      <div>
        <div className="admin-glass-card" style={{ overflow: 'visible' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
              All Anonymous Posts
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Search and manage anonymous messages
            </p>
          </div>

          {/* Search */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              gap: '8px'
            }}>
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  flex: 1,
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Posts List */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="admin-post-item"
                  style={{
                    cursor: 'pointer',
                    margin: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: selectedPostId === post.id ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: selectedPostId === post.id ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div className="admin-post-header">
                    <div className="admin-post-author">
                      <span className="admin-badge status-identified">
                        ✓ {post.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="admin-post-timestamp">{post.timestamp}</span>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: 'rgba(147, 51, 234, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    marginBottom: '8px'
                  }}>
                    {post.author}
                  </span>
                  <p className="admin-post-content">
                    {post.content}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Hash: {post.authorHash.slice(0, 16)}...
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleViewAuthor(post)}
                        className="btn-glass-primary"
                        title="View author information"
                        aria-label="View author details"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          fontSize: '0.75rem'
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn-glass-danger"
                        title="Delete this post"
                        aria-label="Delete post"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          fontSize: '0.75rem'
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                No posts found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author Info Panel */}
      <div className="admin-glass-card">
        {selectedAuthor ? (
          <div className="admin-author-info">
            <div className="admin-author-header">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                Author Details
              </h3>
              <button
                onClick={onCloseAuthor}
                className="admin-author-close"
                title="Close author panel"
                aria-label="Close author information panel"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(96, 165, 250, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                  Name
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: '#ffffff' }}>
                  {selectedAuthor.name}
                </p>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(96, 165, 250, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                  Email
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: '#93c5fd' }}>
                  {selectedAuthor.email}
                </p>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(96, 165, 250, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                  Author Hash
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0, color: '#93c5fd', wordBreak: 'break-all' }}>
                  {selectedAuthor.hash}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                    Total Posts
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#86efac' }}>
                    {selectedAuthor.postCount}
                  </p>
                </div>

                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                    Status
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: '#86efac' }}>
                    {selectedAuthor.status.charAt(0).toUpperCase() + selectedAuthor.status.slice(1)}
                  </p>
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(96, 165, 250, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, marginBottom: '4px' }}>
                  Join Date
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: '#93c5fd' }}>
                  {new Date(selectedAuthor.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-author-panel empty">
            <Eye className="w-16 h-16 text-gray-600 mb-4" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
              Author Information
            </h3>
            <p style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
              Select a post to view author details
            </p>
            <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '8px' }}>
              Click "View" button to reveal anonymous author information
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// FlaggedPostsTab Component
interface FlaggedPostsTabProps {
  onAuthorIdentify: (author: Author) => void;
  selectedAuthor: Author | null;
  onCloseAuthor: () => void;
}

const FlaggedPostsTab: React.FC<FlaggedPostsTabProps> = ({
  onAuthorIdentify,
  selectedAuthor,
  onCloseAuthor
}) => {
  const [flaggedPosts] = useState<Post[]>([
    {
      id: '4',
      author: 'Unknown User',
      content: 'Inappropriate content example',
      timestamp: '20/11/2025, 3:15:45 pm',
      status: 'pending',
      authorHash: 'abc123def456',
      flag: {
        level: 'high',
        reason: 'Harassment'
      }
    },
    {
      id: '5',
      author: 'Another User',
      content: 'Spam message',
      timestamp: '19/11/2025, 10:30:20 am',
      status: 'identified',
      authorHash: 'xyz789uvw123',
      flag: {
        level: 'medium',
        reason: 'Spam'
      }
    }
  ]);

  return (
    <div className="admin-posts-grid">
      <div>
        <div className="admin-glass-card">
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
              Flagged Content
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Review and manage flagged posts
            </p>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {flaggedPosts.map(post => (
              <div
                key={post.id}
                className="admin-post-item"
                style={{
                  margin: '12px',
                  padding: '16px',
                  borderRadius: '8px'
                }}
              >
                <div className="admin-post-header">
                  <div className="admin-post-author">
                    <span className="admin-badge status-pending">
                      ⚠ {post.status?.toUpperCase() || 'PENDING'}
                    </span>
                    {post.flag && (
                      <span className={`admin-badge flag-${post.flag.level}`}>
                        {post.flag.reason}
                      </span>
                    )}
                  </div>
                  <span className="admin-post-timestamp">{post.timestamp}</span>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  marginBottom: '8px'
                }}>
                  {post.author}
                </span>
                <p className="admin-post-content">
                  {post.content}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Hash: {post.authorHash.slice(0, 16)}...
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-glass-success" 
                      title="Approve this flagged post"
                      aria-label="Approve flagged content"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-glass-danger" 
                      title="Delete this flagged post"
                      aria-label="Delete flagged content"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-glass-card">
        <div className="admin-author-panel empty">
          <Flag className="w-16 h-16 text-gray-600 mb-4" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            Flagged Content Details
          </h3>
          <p style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
            Select a flagged post to view details
          </p>
        </div>
      </div>
    </div>
  );
};

// AnalyticsTab Component
const AnalyticsTab: React.FC = () => {
  const stats = [
    { label: 'Total Posts', value: '1,234', icon: <MessageSquare className="w-6 h-6 text-blue-400" /> },
    { label: 'Flagged Posts', value: '42', icon: <Flag className="w-6 h-6 text-red-400" /> },
    { label: 'Active Users', value: '892', icon: <User className="w-6 h-6 text-green-400" /> }
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="admin-glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0 0' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px', margin: 0 }}>
          Recent Activity
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {[
            { action: 'New post created', time: '5 minutes ago', author: 'User #1234' },
            { action: 'Content flagged', time: '15 minutes ago', author: 'User #5678' },
            { action: 'User registered', time: '1 hour ago', author: 'New User' }
          ].map((activity, idx) => (
            <div key={idx} style={{
              padding: '12px',
              borderBottom: idx !== 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontWeight: '500' }}>{activity.action}</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {activity.time}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', margin: '4px 0 0 0' }}>
                {activity.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('anonymous');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  // Spotlight effect
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
  }, []);

  const handleAuthorIdentify = (author: Author) => {
    setSelectedAuthor(author);
  };

  const handleCloseAuthor = () => {
    setSelectedAuthor(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'anonymous':
        return (
          <AnonymousPostsTab
            onAuthorIdentify={handleAuthorIdentify}
            selectedAuthor={selectedAuthor}
            onCloseAuthor={handleCloseAuthor}
          />
        );
      case 'flagged':
        return (
          <FlaggedPostsTab
            onAuthorIdentify={handleAuthorIdentify}
            selectedAuthor={selectedAuthor}
            onCloseAuthor={handleCloseAuthor}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-page-wrapper">
      <AdminHeader />

      <div className="max-w-7xl mx-auto p-0" style={{ position: 'relative', zIndex: 0 }}>
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;