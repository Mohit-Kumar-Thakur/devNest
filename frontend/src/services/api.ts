const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  posts?: T[];
  currentPage?: number;
  totalPages?: number;
  totalPosts?: number;
  [key: string]: any;
}

export const api = {
  // Posts
  getPosts: async (tab: string = 'recent', page: number = 1): Promise<ApiResponse<any>> => {
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

  getPost: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  // Comments
  getComments: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
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
  },

  voteComment: async (commentId: string, voteType: 'up' | 'down') => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType })
    });
    if (!response.ok) throw new Error('Failed to vote on comment');
    return response.json();
  }
};