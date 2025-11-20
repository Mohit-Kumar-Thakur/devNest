import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  Flag, 
  TrendingUp,
  Plus,
  Send,
  Eye,
  EyeOff,
  Hash,
  Clock,
  Flame,
  ThumbsUp,
  MoreHorizontal,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  Upload,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

// API Service
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  getPosts: async (tab: string = 'recent', page: number = 1) => {
    const response = await fetch(`${API_BASE_URL}/posts?tab=${tab}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  createPost: async (postData: any) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  votePost: async (postId: string, voteType: 'up' | 'down') => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType })
    });
    if (!response.ok) throw new Error('Failed to vote');
    return response.json();
  },

  votePoll: async (postId: string, optionId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/poll/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId })
    });
    if (!response.ok) throw new Error('Failed to vote on poll');
    return response.json();
  },

  reportPost: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to report post');
    return response.json();
  },

  createComment: async (commentData: any) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  }
};

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  endsAt: string;
  userVotes?: Array<{ userHash: string; optionId: string }>;
}

interface Post {
  _id?: string;
  id: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  reposts: number;
  isRepost?: boolean;
  originalPost?: Post;
  repostThoughts?: string;
  tags: string[];
  reported: boolean;
  userVote?: 'up' | 'down' | null;
  trending: boolean;
  images?: string[];
  videos?: string[];
  pdfs?: { name: string; url: string }[];
  poll?: Poll;
  userVotes?: Array<{ userHash: string; voteType: 'up' | 'down' }>;
  reportedBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}

const AnonymousPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'trending' | 'top'>('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showRepostDialog, setShowRepostDialog] = useState<string | null>(null);
  const [repostThoughts, setRepostThoughts] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadedPdfs, setUploadedPdfs] = useState<{ name: string; url: string }[]>([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getPosts(activeTab);
      // Transform backend data to match frontend interface
      const transformedPosts = data.posts.map((post: any) => ({
        ...post,
        id: post._id || post.id,
        // Ensure all required fields are present
        tags: post.tags || [],
        reported: post.reported || false,
        trending: post.trending || false,
        comments: post.comments || 0,
        reposts: post.reposts || 0,
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        timestamp: formatTimestamp(post.createdAt || post.timestamp)
      }));
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return 'Just now';
    
    if (timestamp.includes('ago') || timestamp.includes('now')) {
      return timestamp;
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'pdf') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      
      if (type === 'image') {
        setUploadedImages(prev => [...prev, url]);
      } else if (type === 'video') {
        setUploadedVideos(prev => [...prev, url]);
      } else if (type === 'pdf') {
        setUploadedPdfs(prev => [...prev, { name: file.name, url }]);
      }
    });

    toast({
      title: "File uploaded!",
      description: `${type} added to your post.`,
    });
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) {
      toast({
        title: "Invalid poll",
        description: "Please add a question and at least 2 options.",
        variant: "destructive"
      });
      return null;
    }
    return {
      question: pollQuestion,
      options: pollOptions.filter(o => o.trim()).map((text, i) => ({
        id: `opt-${i}-${Date.now()}`,
        text,
        votes: 0
      })),
      totalVotes: 0,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator) return;

    const poll = showPollCreator ? handleCreatePoll() : undefined;
    if (showPollCreator && !poll) return;

    try {
      setCreatingPost(true);

      const postData = {
        content: newPostContent,
        isAnonymous,
        images: uploadedImages,
        videos: uploadedVideos,
        pdfs: uploadedPdfs,
        poll
      };

      const newPost = await api.createPost(postData);
      
      // Transform the new post to match our interface
      const transformedPost: Post = {
        ...newPost,
        id: newPost._id || newPost.id,
        tags: newPost.tags || [],
        reported: newPost.reported || false,
        trending: newPost.trending || false,
        comments: newPost.comments || 0,
        reposts: newPost.reposts || 0,
        upvotes: newPost.upvotes || 0,
        downvotes: newPost.downvotes || 0,
        timestamp: 'Just now',
        userVote: null
      };

      setPosts([transformedPost, ...posts]);
      
      // Reset form
      setNewPostContent('');
      setUploadedImages([]);
      setUploadedVideos([]);
      setUploadedPdfs([]);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setShowCreatePost(false);
      
      toast({
        title: "Post created!",
        description: "Your anonymous post has been shared with the community.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreatingPost(false);
    }
  };

  const handlePollVote = async (postId: string, optionId: string) => {
    try {
      const result = await api.votePoll(postId, optionId);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, poll: result } : post
      ));
    } catch (error) {
      console.error('Error voting on poll:', error);
      toast({
        title: "Error",
        description: "Failed to vote on poll. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      setVotingPosts(prev => new Set(prev).add(postId));
      const result = await api.votePost(postId, voteType);
      setPosts(posts.map(post => 
        post.id === postId ? { 
          ...post, 
          upvotes: result.upvotes, 
          downvotes: result.downvotes,
          userVote: result.userVote 
        } : post
      ));
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVotingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleRepost = async (postId: string, thoughts?: string) => {
    try {
      const originalPost = posts.find(p => p.id === postId);
      if (!originalPost) return;

      const repostData = {
        content: originalPost.content,
        isAnonymous,
        isRepost: true,
        originalPostId: postId,
        repostThoughts: thoughts
      };

      const newRepost = await api.createPost(repostData);
      
      const transformedRepost: Post = {
        ...newRepost,
        id: newRepost._id || newRepost.id,
        tags: newRepost.tags || [],
        reported: newRepost.reported || false,
        trending: newRepost.trending || false,
        comments: newRepost.comments || 0,
        reposts: newRepost.reposts || 0,
        upvotes: newRepost.upvotes || 0,
        downvotes: newRepost.downvotes || 0,
        timestamp: 'Just now',
        userVote: null,
        originalPost: originalPost
      };

      setPosts([transformedRepost, ...posts]);
      
      // Update original post repost count locally
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, reposts: (p.reposts || 0) + 1 } : p
      ));

      setShowRepostDialog(null);
      setRepostThoughts('');
      
      toast({
        title: "Reposted!",
        description: thoughts ? "Post shared with your thoughts." : "Post shared to your feed.",
      });
    } catch (error) {
      console.error('Error reposting:', error);
      toast({
        title: "Error",
        description: "Failed to repost. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReport = async (postId: string) => {
    try {
      const result = await api.reportPost(postId);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, reported: result.reported } : post
      ));
      
      toast({
        title: "Post reported",
        description: result.reported 
          ? "Thank you for helping keep our community safe. The post has been flagged for review."
          : "Post reported. It will be reviewed after more reports.",
      });
    } catch (error) {
      console.error('Error reporting post:', error);
      toast({
        title: "Error",
        description: "Failed to report post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Anonymous Community 🎭</h1>
          <p className="text-muted-foreground text-lg">
            Share thoughts, ask questions, and connect with your peers anonymously
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-6 p-1 bg-secondary rounded-lg w-fit">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'top', label: 'Top', icon: ThumbsUp }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 ${
                activeTab === tab.id ? 'bg-card shadow-sm' : ''
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Create Post Button */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-4">
            {!showCreatePost ? (
              <Button
                onClick={() => setShowCreatePost(true)}
                variant="outline"
                className="w-full h-12 border-dashed border-2 hover:bg-primary/5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share your thoughts anonymously...
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    variant={isAnonymous ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsAnonymous(true)}
                    className="flex items-center space-x-2"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Anonymous</span>
                  </Button>
                  <Button
                    variant={!isAnonymous ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsAnonymous(false)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Identified</span>
                  </Button>
                </div>
                
                <Textarea
                  placeholder="What's on your mind? Use #tags to categorize your post..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-24 resize-none"
                  maxLength={280}
                />

                {/* Media Attachments */}
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploadedVideos.map((vid, i) => (
                    <div key={i} className="relative group">
                      <video src={vid} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setUploadedVideos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploadedPdfs.map((pdf, i) => (
                    <div key={i} className="relative group flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs">{pdf.name}</span>
                      <button
                        onClick={() => setUploadedPdfs(prev => prev.filter((_, idx) => idx !== i))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Poll Creator */}
                {showPollCreator && (
                  <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Poll question..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    />
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...pollOptions];
                            newOpts[i] = e.target.value;
                            setPollOptions(newOpts);
                          }}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-md"
                        />
                        {i >= 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPollOptions([...pollOptions, ''])}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add option
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Media Upload Buttons */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                      </span>
                    </Button>
                  </label>

                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </span>
                    </Button>
                  </label>

                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </span>
                    </Button>
                  </label>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPollCreator(!showPollCreator)}
                    className={showPollCreator ? 'bg-primary/10' : ''}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Poll
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {newPostContent.length}/280 characters
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPostContent('');
                        setUploadedImages([]);
                        setUploadedVideos([]);
                        setUploadedPdfs([]);
                        setShowPollCreator(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreatePost}
                      disabled={creatingPost || (!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator)}
                      className="gradient-primary text-primary-foreground"
                    >
                      {creatingPost ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {creatingPost ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No posts found. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post, index) => (
              <Card 
                key={post.id} 
                className={`transition-all hover:shadow-hover animate-scale-in ${
                  post.trending ? 'border-l-4 border-l-accent' : ''
                } ${post.reported ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Repost Header */}
                  {post.isRepost && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Share2 className="w-4 h-4" />
                      <span>{post.author} reposted</span>
                    </div>
                  )}

                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    {post.trending && (
                      <Badge className="bg-accent/10 text-accent">
                        <Flame className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>

                  {/* Repost Thoughts */}
                  {post.repostThoughts && (
                    <div className="mb-4 p-3 bg-secondary/50 rounded-lg border-l-4 border-l-primary">
                      <p className="text-sm">{post.repostThoughts}</p>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className={post.isRepost ? 'ml-4 pl-4 border-l-2 border-border' : ''}>
                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                    {/* Images */}
                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {post.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="w-full rounded-lg object-cover max-h-96" />
                        ))}
                      </div>
                    )}

                    {/* Videos */}
                    {post.videos && post.videos.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {post.videos.map((vid, i) => (
                          <video key={i} src={vid} controls className="w-full rounded-lg max-h-96" />
                        ))}
                      </div>
                    )}

                    {/* PDFs */}
                    {post.pdfs && post.pdfs.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {post.pdfs.map((pdf, i) => (
                          <a
                            key={i}
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                          >
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">{pdf.name}</span>
                            <Upload className="w-4 h-4 ml-auto" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Poll */}
                    {post.poll && (
                      <div className="mb-4 p-4 bg-secondary/50 rounded-lg space-y-3">
                        <p className="font-medium">{post.poll.question}</p>
                        <div className="space-y-2">
                          {post.poll.options.map((opt) => {
                            const percentage = post.poll!.totalVotes > 0 
                              ? (opt.votes / post.poll!.totalVotes) * 100 
                              : 0;
                            const isVoted = post.poll!.userVote === opt.id;
                            
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handlePollVote(post.id, opt.id)}
                                disabled={!!post.poll!.userVote}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  isVoted 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-border hover:border-primary/50'
                                } ${post.poll!.userVote ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{opt.text}</span>
                                  {post.poll!.userVote && (
                                    <span className="text-xs text-muted-foreground">
                                      {percentage.toFixed(0)}%
                                    </span>
                                  )}
                                </div>
                                {post.poll!.userVote && (
                                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary transition-all duration-300"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {post.poll.totalVotes} votes • Ends {new Date(post.poll.endsAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-6">
                      {/* Voting */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'up')}
                          disabled={votingPosts.has(post.id)}
                          className={`flex items-center space-x-1 ${
                            post.userVote === 'up' ? 'text-accent bg-accent/10' : ''
                          }`}
                        >
                          {votingPosts.has(post.id) && post.userVote === 'up' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowUp className="w-4 h-4" />
                          )}
                          <span>{post.upvotes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'down')}
                          disabled={votingPosts.has(post.id)}
                          className={`flex items-center space-x-1 ${
                            post.userVote === 'down' ? 'text-destructive bg-destructive/10' : ''
                          }`}
                        >
                          {votingPosts.has(post.id) && post.userVote === 'down' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )}
                          <span>{post.downvotes}</span>
                        </Button>
                      </div>

                      {/* Comments */}
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </Button>

                      {/* Repost */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRepostDialog(post.id)}
                        className="flex items-center space-x-1"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{post.reposts}</span>
                      </Button>
                    </div>

                    {/* Report */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReport(post.id)}
                      disabled={post.reported}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-destructive"
                    >
                      <Flag className="w-4 h-4" />
                      <span>{post.reported ? 'Reported' : 'Report'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Repost Dialog */}
        {showRepostDialog && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Repost</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRepostDialog(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add your thoughts (optional)..."
                  value={repostThoughts}
                  onChange={(e) => setRepostThoughts(e.target.value)}
                  className="min-h-20 resize-none"
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRepost(showRepostDialog)}
                  >
                    Repost
                  </Button>
                  <Button
                    onClick={() => handleRepost(showRepostDialog, repostThoughts)}
                    disabled={!repostThoughts.trim()}
                    className="gradient-primary text-primary-foreground"
                  >
                    Repost with thoughts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Backend Status */}
        <div className="mt-12 p-4 bg-card/50 rounded-lg border border-border animate-fade-in">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Live Data:</strong> Connected to backend API. Posts are now persisted in MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousPosts;