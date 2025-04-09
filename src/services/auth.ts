import { toast } from "sonner";

// This would be replaced with actual Firebase/Google Auth implementation when connected to Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Mock data for demo purposes
let currentUser: User | null = null;

export const loginWithGoogle = (): Promise<User> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: "Anonymous Pookie",
        email: "user@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
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
