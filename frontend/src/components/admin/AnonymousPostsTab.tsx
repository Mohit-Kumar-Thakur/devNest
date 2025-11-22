import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, User, RefreshCw } from 'lucide-react';
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
  
  const { loading, error, fetchAnonymousPosts, identifyPostAuthor } = useAdmin();

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
      
      // Update local posts state
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, authorInfo: author } : p
      ));
    }
    setIdentifyingPost(null);
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
              <CardTitle>All Anonymous Chats</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
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
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No chats found</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          {post.author}
                        </Badge>
                        {post.authorInfo && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            ✅ Identified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Author Hash: <code className="text-xs">{post.authorHash}</code>
                      </div>
                      
                      <div className="flex space-x-2">
                        {post.authorInfo ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAuthorIdentify({
                              ...post.authorInfo,
                              postContent: post.content,
                              postCreatedAt: post.createdAt
                            })}
                            className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Author
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIdentifyAuthor(post.id)}
                            disabled={identifyingPost === post.id || loading}
                            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {identifyingPost === post.id ? 'Identifying...' : 'Reveal Author'}
                          </Button>
                        )}
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
      />
    </div>
  );
};