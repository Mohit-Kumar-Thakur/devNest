import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Flag, Loader2 } from 'lucide-react';
import { Post } from '@/types/anonymous';

interface PostActionsProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onReport: (postId: string) => void;
  onRepost: (postId: string) => void;
  votingPosts: Set<string>;
}

export const PostActions: React.FC<PostActionsProps> = ({
  post,
  onVote,
  onReport,
  onRepost,
  votingPosts
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="flex items-center space-x-6">
        {/* Voting */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(post.id, 'up')}
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
            onClick={() => onVote(post.id, 'down')}
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
          onClick={() => onRepost(post.id)}
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
        onClick={() => onReport(post.id)}
        disabled={post.reported}
        className="flex items-center space-x-1 text-muted-foreground hover:text-destructive"
      >
        <Flag className="w-4 h-4" />
        <span>{post.reported ? 'Reported' : 'Report'}</span>
      </Button>
    </div>
  );
};