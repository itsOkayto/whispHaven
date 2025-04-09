
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post, toggleLikePost, hasLikedPost } from '@/services/posts';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  refreshPosts: () => void;
}

const PostCard = ({ post, refreshPosts }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(hasLikedPost(post.id));
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this anonymous post: ${window.location.origin}/post/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card className="pookie-card overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-pookie-purple to-pookie-blue rounded-full text-white font-bold text-sm">
            A
          </div>
          <div className="flex flex-col">
            <div className="font-medium">Anonymous</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </div>
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.comments}
          </Button>

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
