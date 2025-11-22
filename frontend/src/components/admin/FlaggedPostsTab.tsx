import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Flag, RefreshCw, Trash2, Ban } from 'lucide-react';
import { AuthorDetailsSidebar } from './AuthorDetailsSidebar';
import { useAdmin } from '@/hooks/useAdmin';

interface Post {
  id: string;
  content: string;
  author: string;
  authorHash: string;
  reported: boolean;
  reportedBy: string[];
  isHidden: boolean;
  createdAt: string;
  authorInfo?: any;
}

interface FlaggedPostsTabProps {
  onAuthorIdentify: (author: any) => void;
  selectedAuthor: any;
  onCloseAuthor: () => void;
}

export const FlaggedPostsTab = ({
  onAuthorIdentify,
  selectedAuthor,
  onCloseAuthor
}: FlaggedPostsTabProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [identifyingPost, setIdentifyingPost] = useState<string | null>(null);
  
  const { loading, error, fetchFlaggedPosts, identifyPostAuthor, banUser, deletePost } = useAdmin();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const postsData = await fetchFlaggedPosts();
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
    }
    setIdentifyingPost(null);
  };

  const handleBanUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    
    const success = await banUser(userId);
    if (success) {
      alert('User banned successfully');
      loadPosts();
      onCloseAuthor();
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    const success = await deletePost(postId);
    if (success) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      onCloseAuthor();
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.authorInfo && post.authorInfo.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Posts List */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Flagged Content</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search flagged posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button onClick={loadPosts} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Flag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No flagged posts found</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={post.reported ? "destructive" : "secondary"}>
                          {post.reported ? `Reported (${post.reportedBy?.length || 0})` : 'Hidden'}
                        </Badge>
                        <Badge variant="outline">
                          {post.author}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {post.authorInfo ? (
                          <div className="text-sm">
                            <p className="font-semibold text-green-600">
                              ✅ {post.authorInfo.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.authorInfo.email}
                            </p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIdentifyAuthor(post.id)}
                            disabled={identifyingPost === post.id || loading}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {identifyingPost === post.id ? 'Identifying...' : 'Identify Author'}
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {post.authorInfo && !post.authorInfo.isBanned && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBanUser(post.authorInfo.id)}
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Ban User
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Post
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Author Details Sidebar */}
      <AuthorDetailsSidebar 
        selectedAuthor={selectedAuthor}
        onClose={onCloseAuthor}
        showBanButton={true}
        onBanUser={handleBanUser}
      />
    </div>
  );
};