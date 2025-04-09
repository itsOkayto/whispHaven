
import React, { useState, useEffect } from 'react';
import { User } from '@/services/auth';
import { Comment, getComments, addComment, deleteComment } from '@/services/posts';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquare, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import PostAvatar from './PostAvatar';

interface CommentSectionProps {
  postId: string;
  currentUser: User | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchComments = async () => {
    if (!isExpanded) return;
    
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchComments();
    }
  }, [isExpanded, postId]);

  const handleSubmitComment = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      await addComment(postId, newComment, currentUser);
      setNewComment('');
      fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to delete comments');
      return;
    }

    try {
      await deleteComment(commentId, currentUser.id);
      fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const isUserComment = (comment: Comment) => {
    return currentUser?.id === comment.userId;
  };

  return (
    <div className="mt-3 border-t pt-3">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {isExpanded ? 'Hide' : 'Show'} Comments ({comments.length})
      </Button>

      {isExpanded && (
        <>
          {currentUser && (
            <div className="flex gap-2 mb-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none min-h-[60px]"
                disabled={isSubmitting}
              />
              <Button 
                className="self-end" 
                disabled={isSubmitting || !newComment.trim()}
                onClick={handleSubmitComment}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <PostAvatar avatar={comment.userAvatar} emoji={comment.userEmoji} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <div className="font-medium">Anonymous</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </div>
                          </div>

                          {isUserComment(comment) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-2 text-sm whitespace-pre-line">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
