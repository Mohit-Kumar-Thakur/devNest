import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock, TrendingUp, ThumbsUp, Loader2, BookOpen } from 'lucide-react';
import { AnonymousHeader } from '@/components/anonymous/AnonymousHeader';
import { CreatePostForm } from '@/components/anonymous/CreatePostForm';
import { PostCard } from '@/components/anonymous/PostCard';
import { RepostDialog } from '@/components/anonymous/RepostDialog';
import { useAnonymousPosts } from '@/hooks/useAnonymousPosts';
import { anonymousApi } from '@/services/anonymousApi';
import { Post } from '@/types/anonymous';

const AnonymousPosts = () => {
  const [showRepostDialog, setShowRepostDialog] = useState<string | null>(null);
  const [repostThoughts, setRepostThoughts] = useState('');
  const { toast } = useToast();
  
  const {
    posts,
    activeTab,
    setActiveTab,
    loading,
    votingPosts,
    handleVote,
    handlePollVote,
    handleReport,
    setPosts
  } = useAnonymousPosts();

  const handleRepost = async (postId: string, thoughts?: string) => {
    try {
      const originalPost = posts.find(p => p.id === postId);
      if (!originalPost) return;

      const repostData = {
        content: originalPost.content,
        isAnonymous: true,
        isRepost: true,
        originalPostId: postId,
        repostThoughts: thoughts
      };

      const newRepost = await anonymousApi.createPost(repostData);
      
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

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
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
      <AnonymousHeader />

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

        {/* Create Post Form */}
        <CreatePostForm onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts found. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onVote={handleVote}
                onPollVote={handlePollVote}
                onReport={handleReport}
                onRepost={setShowRepostDialog}
                votingPosts={votingPosts}
              />
            ))
          )}
        </div>

        {/* Repost Dialog */}
        <RepostDialog
          postId={showRepostDialog}
          onClose={() => setShowRepostDialog(null)}
          onRepost={handleRepost}
        />
      </div>
    </div>
  );
};

export default AnonymousPosts;