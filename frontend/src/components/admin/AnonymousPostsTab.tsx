import { useState, useEffect } from 'react';
import { Search, Eye, User, RefreshCw, MessageSquare, Trash2 } from 'lucide-react';
import { AuthorDetailsSidebar } from './AuthorDetailsSidebar';
import { useAdmin } from '@/hooks/useAdmin';

interface Post {
  id: string;
  content: string;
  author: string;
  authorHash: string;
  isAnonymous: boolean;
  createdAt: string;
  authorInfo?: any;
}

interface AnonymousPostsTabProps {
  onAuthorIdentify: (author: any) => void;
  selectedAuthor: any;
  onCloseAuthor: () => void;
}

export const AnonymousPostsTab = ({
  onAuthorIdentify,
  selectedAuthor,
  onCloseAuthor
}: AnonymousPostsTabProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [identifyingPost, setIdentifyingPost] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  const { loading, error, fetchAnonymousPosts, identifyPostAuthor, deletePost } = useAdmin();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const postsData = await fetchAnonymousPosts();
    setPosts(postsData);
  };

  const handleIdentifyAuthor = async (postId: string) => {
    setIdentifyingPost(postId);
    const author = await identifyPostAuthor(postId);
    if (author) {
      const post = posts.find(p => p.id === postId);
      onAuthorIdentify({
        ...author,
        postContent: post?.content,
        postCreatedAt: post?.createdAt
      });
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, authorInfo: author } : p
      ));
      setSelectedPostId(postId);
    }
    setIdentifyingPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    const success = await deletePost(postId);
    if (success) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      if (selectedPostId === postId) {
        onCloseAuthor();
      }
      alert('Post deleted successfully');
    } else {
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.authorInfo && post.authorInfo.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-posts-grid">
      {/* Posts List */}
      <div>
        <div className="admin-glass-card" style={{ overflow: 'visible' }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                All Anonymous Posts
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                {posts.length} posts found • Real-time data
              </p>
            </div>
            <button
              onClick={loadPosts}
              className="btn-glass-primary"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px'
              }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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

          {/* Error Display */}
          {error && (
            <div style={{
              margin: '16px 24px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Posts List */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
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
                      <span className={`admin-badge ${post.authorInfo ? 'status-identified' : 'status-pending'}`}>
                        {post.authorInfo ? '✓ IDENTIFIED' : '⏳ ANONYMOUS'}
                      </span>
                    </div>
                    <span className="admin-post-timestamp">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
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
                    <div className="text-sm text-gray-600">
                      {post.isAnonymous ? 'Posted Anonymously' : 'Regular Post'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {post.authorInfo ? (
                        <button
                          onClick={() => {
                            setSelectedPostId(post.id);
                            onAuthorIdentify({
                              ...post.authorInfo,
                              postContent: post.content,
                              postCreatedAt: post.createdAt
                            });
                          }}
                          className="btn-glass-success"
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
                      ) : (
                        <button
                          onClick={() => handleIdentifyAuthor(post.id)}
                          disabled={identifyingPost === post.id || loading}
                          className="btn-glass-primary"
                          title="Identify anonymous author"
                          aria-label="Identify author"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <Eye className="w-3 h-3" />
                          {identifyingPost === post.id ? 'Identifying...' : 'Identify'}
                        </button>
                      )}
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
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No anonymous posts found.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                  {searchTerm ? 'Try a different search term' : 'Anonymous posts will appear here when users post them'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author Details Sidebar */}
      <AuthorDetailsSidebar 
        selectedAuthor={selectedAuthor}
        onClose={onCloseAuthor}
      />
    </div>
  );
};