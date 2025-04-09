import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
  Trash2, 
  SmilePlus, 
  Smile, 
  Frown, 
  Angry, 
  Sparkles,
  Flag,
  AlertTriangle
} from 'lucide-react';
import { 
  Post, 
  toggleLikePost, 
  hasLikedPost, 
  isUserPost, 
  deletePost,
  addReaction,
  getUserReaction,
  ReactionType,
  flagPost
} from '@/services/posts';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { User } from '@/services/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PostAvatar from './PostAvatar';
import CommentSection from './CommentSection';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PostCardProps {
  post: Post;
  refreshPosts: () => void;
  currentUser: User | null;
}

const PostCard = ({ post, refreshPosts, currentUser }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(hasLikedPost(post.id));
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(post.isFlagged || false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    getUserReaction(post.id)
  );

  const isOwnPost = isUserPost(post, currentUser?.id);
  const isIncognito = currentUser?.isIncognito;

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await toggleLikePost(post.id);
      setIsLiked(response.liked);
      setLikeCount(response.post.likes);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Could not like post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this anonymous post: ${window.location.origin}/post/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to delete posts");
      return;
    }

    try {
      setIsDeleting(true);
      await deletePost(post.id, currentUser.id);
      toast.success("Post deleted successfully");
      refreshPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Could not delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFlag = async () => {
    try {
      setIsLoading(true);
      await flagPost(post.id);
      setIsFlagged(true);
      toast.success("Post has been flagged for review");
    } catch (error) {
      console.error("Error flagging post:", error);
      toast.error("Could not flag post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (!currentUser) {
      toast.error("You must be logged in to react to posts");
      return;
    }

    try {
      setIsLoading(true);
      const updatedPost = await addReaction(post.id, reactionType, currentUser.id);
      
      const newReaction = getUserReaction(post.id);
      setCurrentReaction(newReaction);
      
      post.reactions = updatedPost.reactions;
      
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Could not add reaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getReactionIcon = (reaction: ReactionType) => {
    switch (reaction) {
      case 'happy': return <Smile className="h-4 w-4" />;
      case 'sad': return <Frown className="h-4 w-4" />;
      case 'angry': return <Angry className="h-4 w-4" />;
      case 'surprised': return <Sparkles className="h-4 w-4" />;
      default: return null;
    }
  };

  if (isOwnPost && isIncognito) {
    return null;
  }

  return (
    <Card className={`pookie-card overflow-hidden hover:shadow-md transition-all ${post.isPookieOfDay ? 'border-amber-300 bg-amber-50/30 dark:bg-amber-950/10' : ''}`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <PostAvatar 
              avatar={post.userAvatar}
              emoji={post.userEmoji}
              isPookieOfDay={post.isPookieOfDay}
            />
            <div className="flex flex-col">
              <div className="font-medium">Anonymous</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {post.isPookieOfDay && (
              <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 border-amber-200">
                🧃 Pookie of the Day
              </Badge>
            )}
            
            {isFlagged && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                </TooltipTrigger>
                <TooltipContent>This post has been flagged</TooltipContent>
              </Tooltip>
            )}
            
            {!isOwnPost && !isFlagged && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 text-muted-foreground"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will flag the post for moderation. It may be removed if it violates community guidelines.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleFlag}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      Report
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            {isOwnPost && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-pookie-pink/10 border-pookie-pink">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The post will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="mt-2 text-base whitespace-pre-line">{post.content}</div>

        {post.mediaUrl && post.mediaType === 'image' && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img 
              src={post.mediaUrl} 
              alt="Post media" 
              className="w-full h-auto object-cover" 
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {post.mediaUrl && post.mediaType === 'video' && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <video 
              src={post.mediaUrl} 
              controls 
              className="w-full h-auto" 
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        <CommentSection postId={post.id} currentUser={currentUser} />
      </CardContent>

      <CardFooter className="p-3 pt-0 border-t border-border/30">
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full flex items-center ${isLiked ? 'text-destructive' : ''}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-destructive' : ''}`} />
            {likeCount}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-full flex items-center ${currentReaction ? 'text-primary' : ''}`}
                disabled={isLoading}
              >
                {currentReaction ? getReactionIcon(currentReaction) : <SmilePlus className="h-4 w-4 mr-1" />}
                {currentReaction ? 'Reacted' : 'React'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full ${currentReaction === 'happy' ? 'bg-pookie-yellow' : ''}`}
                  onClick={() => handleReaction('happy')}
                >
                  <Smile className="h-5 w-5 text-amber-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full ${currentReaction === 'sad' ? 'bg-pookie-blue' : ''}`}
                  onClick={() => handleReaction('sad')}
                >
                  <Frown className="h-5 w-5 text-blue-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full ${currentReaction === 'angry' ? 'bg-pookie-peach' : ''}`}
                  onClick={() => handleReaction('angry')}
                >
                  <Angry className="h-5 w-5 text-red-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full ${currentReaction === 'surprised' ? 'bg-pookie-green' : ''}`}
                  onClick={() => handleReaction('surprised')}
                >
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </Button>
              </div>
              <div className="flex justify-center mt-2 text-xs text-muted-foreground">
                {post.reactions && (
                  <div className="flex space-x-2">
                    <span>{post.reactions.happy} 😊</span>
                    <span>{post.reactions.sad} 😢</span>
                    <span>{post.reactions.angry} 😠</span>
                    <span>{post.reactions.surprised} ✨</span>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full flex items-center"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
