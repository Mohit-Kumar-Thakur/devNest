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
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

interface Poll {
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  userVote?: string;
  endsAt: string;
}

interface Post {
  id: string;
  content: string;
  author: string; // Anonymous identifier
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

const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Anyone else struggling with the Machine Learning assignment? The neural network implementation is giving me nightmares 😭 #CS301 #Help',
    author: 'Anonymous Owl',
    timestamp: '2 hours ago',
    upvotes: 24,
    downvotes: 2,
    comments: 8,
    reposts: 3,
    tags: ['CS301', 'Help'],
    reported: false,
    trending: true
  },
  {
    id: '2',
    content: 'Hot take: The new library study rooms are amazing! Finally a quiet place to actually concentrate. Thank you admin! 🙏',
    author: 'Night Owl',
    timestamp: '4 hours ago',
    upvotes: 45,
    downvotes: 1,
    comments: 12,
    reposts: 8,
    tags: [],
    reported: false,
    trending: true
  },
  {
    id: '3',
    content: 'PSA: Free pizza in the CS department lobby right now! First come first serve 🍕',
    author: 'Pizza Hunter',
    timestamp: '6 hours ago',
    upvotes: 89,
    downvotes: 0,
    comments: 23,
    reposts: 15,
    tags: [],
    reported: false,
    trending: true
  },
  {
    id: '4',
    content: 'Is anyone else feeling overwhelmed this semester? Between assignments, projects, and exams, I barely have time to breathe. How do you manage stress?',
    author: 'Stressed Student',
    timestamp: '8 hours ago',
    upvotes: 67,
    downvotes: 3,
    comments: 34,
    reposts: 12,
    tags: ['Stress', 'Help'],
    reported: false,
    trending: false
  },
  {
    id: '5',
    content: 'Just wanted to share that I finally understood recursion! After weeks of confusion, it just clicked during today\'s lecture. Don\'t give up, fellow students! 💪',
    author: 'Code Warrior',
    timestamp: '1 day ago',
    upvotes: 156,
    downvotes: 2,
    comments: 28,
    reposts: 42,
    isRepost: true,
    repostThoughts: 'This is so motivating! We all have those breakthrough moments ✨',
    tags: ['Programming', 'Motivation'],
    reported: false,
    trending: false
  }
];

const AnonymousPosts = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
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
  const { toast } = useToast();

  const anonymousNames = [
    'Anonymous Owl', 'Night Owl', 'Code Warrior', 'Study Buddy', 'Tech Ninja',
    'Silent Scholar', 'Mystery Student', 'Campus Ghost', 'Digital Nomad', 'Wisdom Seeker'
  ];

  const getRandomName = () => {
    return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
  };

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

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
      return;
    }
    return {
      question: pollQuestion,
      options: pollOptions.filter(o => o.trim()).map((text, i) => ({
        id: `opt-${i}`,
        text,
        votes: 0
      })),
      totalVotes: 0,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator) return;

    const poll = showPollCreator ? handleCreatePoll() : undefined;
    if (showPollCreator && !poll) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      author: isAnonymous ? getRandomName() : 'You',
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      reposts: 0,
      tags: extractTags(newPostContent),
      reported: false,
      trending: false,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
      videos: uploadedVideos.length > 0 ? uploadedVideos : undefined,
      pdfs: uploadedPdfs.length > 0 ? uploadedPdfs : undefined,
      poll
    };

    setPosts([newPost, ...posts]);
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
  };

  const handlePollVote = (postId: string, optionId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.poll) {
        const poll = post.poll;
        if (poll.userVote) {
          // Remove previous vote
          poll.options = poll.options.map(opt => 
            opt.id === poll.userVote ? { ...opt, votes: opt.votes - 1 } : opt
          );
          poll.totalVotes--;
        }
        
        // Add new vote
        poll.options = poll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        poll.totalVotes++;
        poll.userVote = optionId;
        
        return { ...post, poll: { ...poll } };
      }
      return post;
    }));
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;

        // Remove previous vote
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // Add new vote if different from current
        if (currentVote !== voteType) {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: currentVote === voteType ? null : voteType
        };
      }
      return post;
    }));
  };

  const handleRepost = (postId: string, thoughts?: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    const repost: Post = {
      id: Date.now().toString(),
      content: originalPost.content,
      author: isAnonymous ? getRandomName() : 'You',
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      reposts: 0,
      isRepost: true,
      originalPost,
      repostThoughts: thoughts,
      tags: originalPost.tags,
      reported: false,
      trending: false
    };

    setPosts([repost, ...posts]);
    
    // Update original post repost count
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, reposts: p.reposts + 1 } : p
    ));

    setShowRepostDialog(null);
    setRepostThoughts('');
    
    toast({
      title: "Reposted!",
      description: thoughts ? "Post shared with your thoughts." : "Post shared to your feed.",
    });
  };

  const handleReport = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, reported: true } : post
    ));
    
    toast({
      title: "Post reported",
      description: "Thank you for helping keep our community safe. The post has been flagged for review.",
    });
  };

  const filteredPosts = posts.filter(post => {
    switch (activeTab) {
      case 'trending':
        return post.trending || post.upvotes > 20;
      case 'top':
        return post.upvotes - post.downvotes > 10;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (activeTab) {
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'trending':
        return b.upvotes - a.upvotes;
      default:
        return Date.parse(b.timestamp) - Date.parse(a.timestamp);
    }
  });

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
                      disabled={!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator}
                      className="gradient-primary text-primary-foreground"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
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
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                isVoted 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border hover:border-primary/50'
                              }`}
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
                  {post.tags.length > 0 && (
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
                        className={`flex items-center space-x-1 ${
                          post.userVote === 'up' ? 'text-accent bg-accent/10' : ''
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>{post.upvotes}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, 'down')}
                        className={`flex items-center space-x-1 ${
                          post.userVote === 'down' ? 'text-destructive bg-destructive/10' : ''
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" />
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
          ))}
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

        {/* Note about Supabase */}
        <div className="mt-12 p-4 bg-card/50 rounded-lg border border-border animate-fade-in">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> This shows demo anonymous posts. Connect to Supabase to enable real-time 
            posting, voting, commenting, and moderation features with proper anonymization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousPosts;