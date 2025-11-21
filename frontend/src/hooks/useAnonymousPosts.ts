import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { anonymousApi } from '@/services/anonymousApi';
import { Post } from '@/types/anonymous';

export const useAnonymousPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'trending' | 'top'>('recent');
  const [loading, setLoading] = useState(true);
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await anonymousApi.getPosts(activeTab);
      const transformedPosts = data.posts.map((post: any) => ({
        ...post,
        id: post._id || post.id,
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

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      setVotingPosts(prev => new Set(prev).add(postId));
      const result = await anonymousApi.votePost(postId, voteType);
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

  const handlePollVote = async (postId: string, optionId: string) => {
    try {
      const result = await anonymousApi.votePoll(postId, optionId);
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

  const handleReport = async (postId: string) => {
    try {
      const result = await anonymousApi.reportPost(postId);
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

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  return {
    posts,
    activeTab,
    setActiveTab,
    loading,
    votingPosts,
    fetchPosts,
    handleVote,
    handlePollVote,
    handleReport,
    setPosts
  };
};