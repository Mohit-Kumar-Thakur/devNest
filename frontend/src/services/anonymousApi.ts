import { Post } from '@/types/anonymous';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const createApiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to ${options.method || 'GET'} ${url}`);
  }

  return response.json();
};

export const anonymousApi = {
  getPosts: async (tab: string = 'recent', page: number = 1): Promise<{ posts: Post[] }> => {
    return createApiRequest(`/posts?tab=${tab}&page=${page}`);
  },

  createPost: async (postData: any): Promise<Post> => {
    return createApiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  votePost: async (postId: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number; userVote: 'up' | 'down' | null }> => {
    return createApiRequest(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },

  votePoll: async (postId: string, optionId: string): Promise<any> => {
    return createApiRequest(`/posts/${postId}/poll/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    });
  },

  reportPost: async (postId: string): Promise<{ reported: boolean }> => {
    return createApiRequest(`/posts/${postId}/report`, {
      method: 'POST',
    });
  },
};