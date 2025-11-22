import { useState } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  authorHash: string;
  isAnonymous: boolean;
  reported: boolean;
  reportedBy: string[];
  isHidden: boolean;
  createdAt: string;
  authorInfo?: any;
}

interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
  reportedCount: number;
  isBanned: boolean;
  createdAt: string;
}

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch all anonymous posts
  const fetchAnonymousPosts = async (): Promise<Post[]> => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/admin/anonymous-posts', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch anonymous posts');
      const data = await response.json();
      return data.posts;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch flagged posts
  const fetchFlaggedPosts = async (): Promise<Post[]> => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/admin/flagged-posts', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch flagged posts');
      const data = await response.json();
      return data.posts;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Identify post author
  const identifyPostAuthor = async (postId: string): Promise<Author | null> => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/identify-author/${postId}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to identify author');
      const data = await response.json();
      return data.author;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Ban user
  const banUser = async (userId: string, reason: string = 'Violation of community guidelines'): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ban-user/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason, duration: 30 })
      });
      
      if (!response.ok) throw new Error('Failed to ban user');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Delete post
  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    loading,
    error,
    setError,
    fetchAnonymousPosts,
    fetchFlaggedPosts,
    identifyPostAuthor,
    banUser,
    deletePost
  };
};