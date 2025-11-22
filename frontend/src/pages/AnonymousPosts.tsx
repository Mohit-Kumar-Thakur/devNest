import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, TrendingUp, ThumbsUp, Loader2, BookOpen } from 'lucide-react';
import { AnonymousHeader } from '@/components/anonymous/AnonymousHeader';
import { CreatePostForm } from '@/components/anonymous/CreatePostForm';
import { PostCard } from '@/components/anonymous/PostCard';
import { RepostDialog } from '@/components/anonymous/RepostDialog';
import { useAnonymousPosts } from '@/hooks/useAnonymousPosts';
import { anonymousApi } from '@/services/anonymousApi';
import { Post } from '@/types/anonymous';

// Import the new CSS
import '@/styles/anonymous.css';

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

  // --- SPOTLIGHT EFFECT LOGIC ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".anon-glass-card, .anonymous-page-wrapper .card");
      
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
  }, [posts, loading]);

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

  if (loading) {
    return (
      <div className="anonymous-page-wrapper flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#07eae6]" />
          <p className="text-gray-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="anonymous-page-wrapper">
      <AnonymousHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        
        {/* Title Section with NEW Class for Margin/Padding */}
        <div className="anon-header-section animate-fade-in text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-4 anon-title-gradient z-10 p-2">
            Anonymous Community 🎭
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Share thoughts, ask questions, and connect with your peers anonymously
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-2 mb-10 p-1 anon-tabs-container w-fit mx-auto md:mx-0">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'top', label: 'Top', icon: ThumbsUp }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 anon-tab-btn ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Create Post Form */}
        <div className="mb-10 relative z-20">
           <CreatePostForm onPostCreated={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="anon-glass-card p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-500 mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">No posts found.</p>
                <p className="text-gray-600 text-sm">Be the first to share something with the community!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in">
                <PostCard
                  post={post}
                  index={index}
                  onVote={handleVote}
                  onPollVote={handlePollVote}
                  onReport={handleReport}
                  onRepost={setShowRepostDialog}
                  votingPosts={votingPosts}
                />
              </div>
            ))
          )}
        </div>

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