import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface RepostDialogProps {
  postId: string | null;
  onClose: () => void;
  onRepost: (postId: string, thoughts?: string) => void;
}

export const RepostDialog: React.FC<RepostDialogProps> = ({
  postId,
  onClose,
  onRepost
}) => {
  const [repostThoughts, setRepostThoughts] = useState('');

  if (!postId) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Repost</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add your thoughts (optional)..."
            value={repostThoughts}
            onChange={(e) => setRepostThoughts(e.target.value)}
            className="min-h-20 resize-none"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onRepost(postId);
                onClose();
              }}
            >
              Repost
            </Button>
            <Button
              onClick={() => {
                onRepost(postId, repostThoughts);
                onClose();
              }}
              disabled={!repostThoughts.trim()}
              className="gradient-primary text-primary-foreground"
            >
              Repost with thoughts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};