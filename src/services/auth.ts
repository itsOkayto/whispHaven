
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/supabase";

// Cute emojis and avatars for random assignment
const CUTE_EMOJIS = ["🐱", "🐶", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐙", "🐢", "🦄", "🦋", "🐞"];
const AVATAR_STYLES = ["avataaars", "micah", "bottts", "open-peeps", "notionists", "adventurer", "lorelei"];

// Generate a random avatar and emoji
const generateRandomAvatar = () => {
  const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  const randomSeed = Math.random().toString(36).substring(2, 9);
  const randomEmoji = CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
  
  return {
    avatar: `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`,
    emoji: randomEmoji
  };
};

// Mock data for demo purposes
let currentUser: User | null = null;

export const loginWithGoogle = async (): Promise<User> => {
  try {
    // Check if the user prefers to use a demo account directly
    const useDemoAccount = localStorage.getItem("whispHaven_useDemoAccount") === "true";
    
    if (useDemoAccount) {
      return createAndStoreDemoUser("Demo account used as preferred");
    }

    // Attempt to sign in with Google OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      if (error.message.includes("provider is not enabled") || error.message.includes("Unsupported provider")) {
        const demoUser = createAndStoreDemoUser("Supabase provider not configured");
        // Mark that we're using demo mode due to provider configuration issues
        localStorage.setItem("whispHaven_providerNotConfigured", "true");
        return demoUser;
      }
      throw error;
    }

    // Since OAuth is redirect-based, this function will return before auth is completed
    // The user will be redirected to Google login
    // After successful login and redirect back, we'll check for the session and return the user

    // Returning a temporary user, will be updated after redirect
    const { avatar, emoji } = generateRandomAvatar();
    const tempUser: User = {
      id: "pending_auth",
      name: "Signing in...",
      email: "",
      avatar,
      emoji,
      isIncognito: false,
    };
    
    return tempUser;
  } catch (error) {
    console.error("Error during Google login:", error);
    
    // For any error, create a demo user as fallback
    return createAndStoreDemoUser("Auth provider error");
  }
};

// Helper function to create and store a demo user
const createAndStoreDemoUser = (reason: string): User => {
  const { avatar, emoji } = generateRandomAvatar();
  const demoUser: User = {
    id: `demo-${Math.random().toString(36).substring(2, 9)}`,
    name: "Demo User",
    email: "demo@example.com",
    avatar,
    emoji,
    isIncognito: false,
  };
  
  // Store demo user in memory and localStorage
  currentUser = demoUser;
  localStorage.setItem("whispHavenUser", JSON.stringify(demoUser));
  
  toast.success(`Logged in with demo account (${reason})`);
  return demoUser;
};

export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem("whispHavenUser");
    currentUser = null;
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Logout failed. Please try again.");
    throw error;
  }
};

export const deleteAccount = async (): Promise<void> => {
  try {
    // In a real implementation, we would call a Supabase function to delete the user account
    // For demo purposes, we'll just sign out and clear local storage
    await logout();
    
    // Clear user data
    localStorage.removeItem("whispHavenUser");
    
    // Clear user's posts
    const posts = JSON.parse(localStorage.getItem("whispHaven_posts") || "[]");
    const userId = currentUser?.id;
    const filteredPosts = posts.filter((post: any) => post.userId !== userId);
    localStorage.setItem("whispHaven_posts", JSON.stringify(filteredPosts));
    
    // Clear user reactions and likes
    localStorage.removeItem("whispHaven_liked_posts");
    localStorage.removeItem("whispHaven_user_reactions");
    
    // Clear user comments
    localStorage.removeItem("whispHaven_comments");
    
    currentUser = null;
  } catch (error) {
    console.error("Error during account deletion:", error);
    toast.error("Account deletion failed. Please try again.");
    throw error;
  }
};

export const toggleIncognitoMode = async (): Promise<User> => {
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  try {
    currentUser.isIncognito = !currentUser.isIncognito;
    localStorage.setItem("whispHavenUser", JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    console.error("Error toggling incognito mode:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  // First check if we have the user in memory
  if (currentUser) {
    return currentUser;
  }
  
  try {
    // Check Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    // Check if we have a stored user in localStorage
    const storedUser = localStorage.getItem("whispHavenUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        currentUser = user;
        return user;
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("whispHavenUser");
      }
    }
    
    // If we have a Supabase session, use that
    if (session?.user) {
      // Create new user profile with random avatar/emoji
      const { avatar, emoji } = generateRandomAvatar();
      const user: User = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || "Anonymous Pookie",
        email: session.user.email || "",
        avatar,
        emoji,
        isIncognito: false,
      };
      
      // Store user in memory and localStorage
      currentUser = user;
      localStorage.setItem("whispHavenUser", JSON.stringify(user));
      
      return user;
    }
    
    // If we know the provider is not configured, create a demo user automatically
    if (localStorage.getItem("whispHaven_providerNotConfigured") === "true") {
      return createAndStoreDemoUser("Provider not configured (auto-login)");
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Helper function to allow users to explicitly prefer demo mode
export const setUseDemoAccount = (useDemo: boolean): void => {
  localStorage.setItem("whispHaven_useDemoAccount", useDemo ? "true" : "false");
  
  if (useDemo) {
    toast.info("Demo mode enabled. You'll be logged in with a demo account on next login.");
  } else {
    toast.info("Demo mode disabled. Regular authentication will be used on next login.");
  }
};
