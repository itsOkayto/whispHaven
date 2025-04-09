
import React, { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Send, Loader2 } from 'lucide-react';
import { createPost } from '@/services/posts';
import { toast } from 'sonner';
import { getCurrentUser } from '@/services/auth';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
  const [content, setContent] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    // Generate preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setMediaPreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    
    // Set media type
    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      toast.error("Unsupported file type. Please upload an image or video.");
      return;
    }
    
    setMediaFile(file);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error("Please add some content to your post.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // In a real app, upload the media file to storage and get a URL
      // For demo purposes, we'll just use the preview as the URL
      const mediaUrl = mediaPreview;
      
      // Get current user
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        toast.error("You must be logged in to create a post.");
        return;
      }
      
      await createPost({
        content: content.trim(),
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined,
      }, currentUser); // Pass the entire user object instead of just the ID
      
      toast.success("Post created successfully!");
      
      // Reset form
      setContent('');
      handleRemoveMedia();
      
      // Refresh posts in parent component
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="pookie-card mb-8">
      <CardContent className="p-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Share your anonymous thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none border-pookie-purple/30 focus-visible:ring-pookie-purple/50"
          />
          
          {mediaPreview && (
            <div className="relative">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveMedia}
              >
                <X className="h-3 w-3" />
              </Button>
              
              {mediaType === 'image' && (
                <img
                  src={mediaPreview}
                  alt="Media preview"
                  className="max-h-[300px] w-full object-contain rounded-md"
                />
              )}
              
              {mediaType === 'video' && (
                <video
                  src={mediaPreview}
                  controls
                  className="max-h-[300px] w-full rounded-md"
                />
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <input
                type="file"
                id="media-upload"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground border-pookie-purple/30 hover:bg-pookie-purple/10"
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>
            
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && !mediaFile)}
              className="bg-gradient-to-r from-pookie-purple to-pookie-blue hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
