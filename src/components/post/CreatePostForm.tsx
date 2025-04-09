
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Loader2, Send } from 'lucide-react';
import { createPost } from '@/services/posts';
import { toast } from 'sonner';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File too large. Please upload files smaller than 10MB.");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set file and type
    setMediaFile(file);
    setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      toast.error("Please add some content or media to your post");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let mediaUrl = undefined;
      
      if (mediaFile) {
        // In a real app, we would upload to storage and get URL
        // For this mock app, we'll use the preview as the URL
        mediaUrl = mediaPreview || undefined;
      }
      
      await createPost({
        content,
        mediaUrl,
        mediaType,
      });
      
      // Reset form
      setContent('');
      clearMedia();
      
      toast.success("Post created successfully!");
      onPostCreated();
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pookie-card p-4 mb-6">
      <div className="mb-4">
        <Textarea
          placeholder="Share your weirdest thoughts or moments anonymously..."
          className="min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg placeholder:text-muted-foreground/70"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      {mediaPreview && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          {mediaType === 'image' ? (
            <img 
              src={mediaPreview} 
              alt="Upload preview" 
              className="max-h-[300px] w-auto mx-auto"
            />
          ) : (
            <video 
              src={mediaPreview} 
              controls 
              className="max-h-[300px] w-auto mx-auto"
            />
          )}
          
          <button
            type="button"
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90"
            onClick={clearMedia}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-secondary/50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
          >
            <ImagePlus className="h-4 w-4 mr-1" />
            Add Media
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="pookie-button"
          disabled={isSubmitting || (!content.trim() && !mediaFile)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Post
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
