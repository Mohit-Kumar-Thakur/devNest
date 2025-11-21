import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Flame, Hash, FileText, Upload } from 'lucide-react';
import { Post } from '@/types/anonymous';
import { PostActions } from './PostActions';
import { PollDisplay } from './PollDisplay.tsx';

interface PostCardProps {
  post: Post;
  index: number;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onPollVote: (postId: string, optionId: string) => void;
  onReport: (postId: string) => void;
  onRepost: (postId: string) => void;
  votingPosts: Set<string>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  onVote,
  onPollVote,
  onReport,
  onRepost,
  votingPosts
}) => {
  return (
    <Card 
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
            <PollDisplay 
              poll={post.poll} 
              postId={post.id}
              onVote={onPollVote}
            />
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
        <PostActions
          post={post}
          onVote={onVote}
          onReport={onReport}
          onRepost={onRepost}
          votingPosts={votingPosts}
        />
      </CardContent>
    </Card>
  );
};