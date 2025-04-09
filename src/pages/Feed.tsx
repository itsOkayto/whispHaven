
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/post/PostCard';
import CreatePostForm from '@/components/post/CreatePostForm';
import { getPosts, Post, PostType, ReactionType } from '@/services/posts';
import { User, getCurrentUser, loginWithGoogle, logout } from '@/services/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import PostFilters from '@/components/post/PostFilters';
import UserSettings from '@/components/account/UserSettings';

const Feed = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<PostType | undefined>(undefined);
  const [reactionFilter, setReactionFilter] = useState<ReactionType | undefined>(undefined);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts(typeFilter, reactionFilter);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, reactionFilter]);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user is logged in
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Redirect if not logged in
        if (!currentUser) {
          navigate('/');
          toast.error("Please log in to view the feed");
          return;
        }
        
        // Fetch posts
        await fetchPosts();
      } catch (error) {
        console.error("Error initializing feed:", error);
      }
    };

    init();
  }, [navigate, fetchPosts]);

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      setUser(user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFilterChange = (type: PostType | undefined, reaction: ReactionType | undefined) => {
    setTypeFilter(type);
    setReactionFilter(reaction);
  };

  const handleUserUpdate = () => {
    fetchPosts();
  };

  const renderPostSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading posts...</span>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {typeFilter || reactionFilter 
              ? "No posts match your filters. Try different criteria!" 
              : "No posts yet. Be the first to share!"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            refreshPosts={fetchPosts} 
            currentUser={user}
          />
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isLoggedIn={!!user} 
          onLogin={handleLogin} 
          onLogout={handleLogout}
          rightContent={user && <UserSettings user={user} onLogout={handleLogout} onUpdate={handleUserUpdate} />}
        />
        
        <main className="flex-grow container max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Anonymous Feed</h1>
          
          {user && <CreatePostForm onPostCreated={fetchPosts} />}
          
          <PostFilters onFilterChange={handleFilterChange} />
          
          {renderPostSection()}
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Feed;
