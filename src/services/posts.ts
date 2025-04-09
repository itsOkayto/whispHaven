export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  likes: number;
  comments: number;
  userId?: string;
  reactions?: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
  };
}

export type ReactionType = 'happy' | 'sad' | 'angry' | 'surprised';

const MOCK_POSTS: Post[] = [
  {
    id: "post1",
    content: "I secretly love pineapple on pizza but pretend to hate it around my friends...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 42,
    comments: 15,
    reactions: {
      happy: 20,
      sad: 5,
      angry: 7,
      surprised: 10
    }
  },
  {
    id: "post2",
    content: "I've been pretending to know how to code for 3 years at my job and nobody has noticed yet. I just use AI for everything 🤫",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    mediaType: "image",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 128,
    comments: 32,
  },
  {
    id: "post3",
    content: "Sometimes I wear mismatched socks on purpose because it makes me feel rebellious 🧦",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    likes: 73,
    comments: 9,
  },
  {
    id: "post4",
    content: "I rehearse conversations in the shower and then never use any of my prepared material",
    mediaUrl: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb",
    mediaType: "image",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 215,
    comments: 47,
  },
  {
    id: "post5",
    content: "I still sleep with my childhood stuffed animal and I'm 30 years old. No regrets! 🧸",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    likes: 320,
    comments: 62,
  },
];

const POSTS_STORAGE_KEY = "whispHaven_posts";
const LIKED_POSTS_KEY = "whispHaven_liked_posts";
const USER_REACTIONS_KEY = "whispHaven_user_reactions";

const getStoredPosts = (): Post[] => {
  const stored = localStorage.getItem(POSTS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
      }));
    } catch (error) {
      console.error("Error parsing stored posts:", error);
      return [...MOCK_POSTS];
    }
  }
  return [...MOCK_POSTS];
};

export const getPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      resolve(posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }, 800);
  });
};

export const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'reactions'>, userId?: string): Promise<Post> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      
      const newPost: Post = {
        ...postData,
        id: `post_${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        userId,
        reactions: {
          happy: 0,
          sad: 0,
          angry: 0,
          surprised: 0
        }
      };
      
      posts.unshift(newPost);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      resolve(newPost);
    }, 1000);
  });
};

export const deletePost = (postId: string, userId?: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        reject(new Error("Post not found"));
        return;
      }
      
      const post = posts[postIndex];
      
      if (userId && post.userId && post.userId !== userId) {
        reject(new Error("Unauthorized: You can only delete your own posts"));
        return;
      }
      
      posts.splice(postIndex, 1);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      const userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || "{}");
      if (userReactions[postId]) {
        delete userReactions[postId];
        localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(userReactions));
      }
      
      resolve(true);
    }, 500);
  });
};

export const toggleLikePost = (postId: string): Promise<{ post: Post, liked: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || "[]");
      
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        throw new Error("Post not found");
      }
      
      const isLiked = likedPosts.includes(postId);
      if (isLiked) {
        posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1);
        const newLikedPosts = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLikedPosts));
      } else {
        posts[postIndex].likes += 1;
        likedPosts.push(postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedPosts));
      }
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      resolve({ post: posts[postIndex], liked: !isLiked });
    }, 500);
  });
};

export const addReaction = (postId: string, reactionType: ReactionType, userId: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        reject(new Error("Post not found"));
        return;
      }
      
      const userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || "{}");
      const previousReaction = userReactions[postId];
      
      if (previousReaction) {
        posts[postIndex].reactions![previousReaction] = Math.max(0, posts[postIndex].reactions![previousReaction] - 1);
      }
      
      if (!previousReaction || previousReaction !== reactionType) {
        if (!posts[postIndex].reactions) {
          posts[postIndex].reactions = {
            happy: 0,
            sad: 0,
            angry: 0,
            surprised: 0
          };
        }
        
        posts[postIndex].reactions![reactionType]++;
        userReactions[postId] = reactionType;
      } else {
        delete userReactions[postId];
      }
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(userReactions));
      
      resolve(posts[postIndex]);
    }, 500);
  });
};

export const getUserReaction = (postId: string): ReactionType | null => {
  const userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || "{}");
  return userReactions[postId] || null;
};

export const hasLikedPost = (postId: string): boolean => {
  const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || "[]");
  return likedPosts.includes(postId);
};

export const isUserPost = (post: Post, userId?: string): boolean => {
  if (!userId || !post.userId) return false;
  return post.userId === userId;
};
