import React from 'react';
import { Poll } from '@/types/anonymous';

interface PollDisplayProps {
  poll: Poll;
  postId: string;
  onVote: (postId: string, optionId: string) => void;
}

export const PollDisplay: React.FC<PollDisplayProps> = ({ poll, postId, onVote }) => {
  return (
    <div className="mb-4 p-4 bg-secondary/50 rounded-lg space-y-3">
      <p className="font-medium">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const percentage = poll.totalVotes > 0 
            ? (opt.votes / poll.totalVotes) * 100 
            : 0;
          const isVoted = poll.userVote === opt.id;
          
          return (
            <button
              key={opt.id}
              onClick={() => onVote(postId, opt.id)}
              disabled={!!poll.userVote}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isVoted 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              } ${poll.userVote ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{opt.text}</span>
                {poll.userVote && (
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>
              {poll.userVote && (
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
        {poll.totalVotes} votes • Ends {new Date(poll.endsAt).toLocaleDateString()}
      </p>
    </div>
  );
};