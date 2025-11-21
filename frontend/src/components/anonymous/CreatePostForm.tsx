import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Send, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  BarChart3,
  Loader2,
  X
} from 'lucide-react';
import { MediaAttachments } from './MediaAttachments';
import { PollComponent } from './PollComponent';
import { anonymousApi } from '@/services/anonymousApi';
import { Post } from '@/types/anonymous';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadedPdfs, setUploadedPdfs] = useState<{ name: string; url: string }[]>([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [creatingPost, setCreatingPost] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator) return;

    const poll = showPollCreator ? handleCreatePoll() : undefined;
    if (showPollCreator && !poll) return;

    try {
      setCreatingPost(true);

      const postData = {
        content: newPostContent,
        isAnonymous,
        images: uploadedImages,
        videos: uploadedVideos,
        pdfs: uploadedPdfs,
        poll
      };

      const newPost = await anonymousApi.createPost(postData);
      
      const transformedPost: Post = {
        ...newPost,
        id: newPost._id || newPost.id,
        tags: newPost.tags || [],
        reported: newPost.reported || false,
        trending: newPost.trending || false,
        comments: newPost.comments || 0,
        reposts: newPost.reposts || 0,
        upvotes: newPost.upvotes || 0,
        downvotes: newPost.downvotes || 0,
        timestamp: 'Just now',
        userVote: null
      };

      onPostCreated(transformedPost);
      
      // Reset form
      setNewPostContent('');
      setUploadedImages([]);
      setUploadedVideos([]);
      setUploadedPdfs([]);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setShowCreatePost(false);
      
      toast({
        title: "Post created!",
        description: "Your anonymous post has been shared with the community.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreatingPost(false);
    }
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) {
      toast({
        title: "Invalid poll",
        description: "Please add a question and at least 2 options.",
        variant: "destructive"
      });
      return null;
    }
    return {
      question: pollQuestion,
      options: pollOptions.filter(o => o.trim()).map((text, i) => ({
        id: `opt-${i}-${Date.now()}`,
        text,
        votes: 0
      })),
      totalVotes: 0,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const resetForm = () => {
    setShowCreatePost(false);
    setNewPostContent('');
    setUploadedImages([]);
    setUploadedVideos([]);
    setUploadedPdfs([]);
    setShowPollCreator(false);
  };

  if (!showCreatePost) {
    return (
      <Card className="mb-6 animate-fade-in">
        <CardContent className="p-4">
          <Button
            onClick={() => setShowCreatePost(true)}
            variant="outline"
            className="w-full h-12 border-dashed border-2 hover:bg-primary/5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share your thoughts anonymously...
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 animate-fade-in">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant={isAnonymous ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAnonymous(true)}
              className="flex items-center space-x-2"
            >
              <EyeOff className="w-4 h-4" />
              <span>Anonymous</span>
            </Button>
            <Button
              variant={!isAnonymous ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAnonymous(false)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Identified</span>
            </Button>
          </div>
          
          <Textarea
            placeholder="What's on your mind? Use #tags to categorize your post..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-24 resize-none"
            maxLength={280}
          />

          <MediaAttachments
            uploadedImages={uploadedImages}
            uploadedVideos={uploadedVideos}
            uploadedPdfs={uploadedPdfs}
            onImagesChange={setUploadedImages}
            onVideosChange={setUploadedVideos}
            onPdfsChange={setUploadedPdfs}
          />

          {showPollCreator && (
            <PollComponent
              pollQuestion={pollQuestion}
              pollOptions={pollOptions}
              onQuestionChange={setPollQuestion}
              onOptionsChange={setPollOptions}
            />
          )}
          
          <div className="flex items-center gap-2">
            <MediaUploadButton
              type="image"
              icon={ImageIcon}
              label="Image"
              onFileUpload={(urls) => setUploadedImages(prev => [...prev, ...urls])}
            />
            <MediaUploadButton
              type="video"
              icon={Video}
              label="Video"
              onFileUpload={(urls) => setUploadedVideos(prev => [...prev, ...urls])}
            />
            <MediaUploadButton
              type="pdf"
              icon={FileText}
              label="PDF"
              onFileUpload={(files) => setUploadedPdfs(prev => [...prev, ...files])}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPollCreator(!showPollCreator)}
              className={showPollCreator ? 'bg-primary/10' : ''}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Poll
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {newPostContent.length}/280 characters
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreatePost}
                disabled={creatingPost || (!newPostContent.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0 && !showPollCreator)}
                className="gradient-primary text-primary-foreground"
              >
                {creatingPost ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {creatingPost ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for media upload
const MediaUploadButton: React.FC<{
  type: 'image' | 'video' | 'pdf';
  icon: React.ComponentType<any>;
  label: string;
  onFileUpload: (files: any[]) => void;
}> = ({ type, icon: Icon, label, onFileUpload }) => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const urls = fileArray.map(file => URL.createObjectURL(file));
    
    if (type === 'pdf') {
      const pdfFiles = fileArray.map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
      onFileUpload(pdfFiles);
    } else {
      onFileUpload(urls);
    }

    toast({
      title: "File uploaded!",
      description: `${type} added to your post.`,
    });
  };

  return (
    <>
      <input
        type="file"
        accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '.pdf'}
        multiple
        onChange={handleFileUpload}
        className="hidden"
        id={`${type}-upload`}
      />
      <label htmlFor={`${type}-upload`}>
        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
          <span>
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </span>
        </Button>
      </label>
    </>
  );
};