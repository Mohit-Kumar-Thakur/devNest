export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  endsAt: string;
  userVotes?: Array<{ userHash: string; optionId: string }>;
}

export interface Post {
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