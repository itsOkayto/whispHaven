
import { toast } from "sonner";

// This would be replaced with actual Firebase/Google Auth implementation when connected to Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  emoji: string;
  isIncognito: boolean;
}

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

export const loginWithGoogle = (): Promise<User> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const { avatar, emoji } = generateRandomAvatar();
      
      const user = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: "Anonymous Pookie",
        email: "user@example.com",
        avatar,
        emoji,
        isIncognito: false,
      };
      
      // Store in localStorage for persistence
      localStorage.setItem("whispHavenUser", JSON.stringify(user));
      currentUser = user;
      
      toast.success("Logged in successfully!");
      resolve(user);
    }, 1000);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem("whispHavenUser");
      currentUser = null;
      resolve();
    }, 500);
  });
};

export const deleteAccount = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
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
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const toggleIncognitoMode = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (!currentUser) {
      reject(new Error("No user logged in"));
      return;
    }

    try {
      currentUser.isIncognito = !currentUser.isIncognito;
      localStorage.setItem("whispHavenUser", JSON.stringify(currentUser));
      resolve(currentUser);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // First check if we have the user in memory
    if (currentUser) {
      resolve(currentUser);
      return;
    }
    
    // Otherwise check localStorage
    const storedUser = localStorage.getItem("whispHavenUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        currentUser = user;
        resolve(user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("whispHavenUser");
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
};
