
export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  likes: number;
  comments: number;
}

// Mock data for demo purposes
const MOCK_POSTS: Post[] = [
  {
    id: "post1",
    content: "I secretly love pineapple on pizza but pretend to hate it around my friends...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 42,
    comments: 15,
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

// Local storage keys
const POSTS_STORAGE_KEY = "whispHaven_posts";
const LIKED_POSTS_KEY = "whispHaven_liked_posts";

// Helper to get posts from storage or initialize with mock data
const getStoredPosts = (): Post[] => {
  const stored = localStorage.getItem(POSTS_STORAGE_KEY);
  if (stored) {
    try {
      // Parse the stored JSON and convert string dates back to Date objects
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

// Get all posts
export const getPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const posts = getStoredPosts();
      resolve(posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }, 800);
  });
};

// Create a new post
export const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const posts = getStoredPosts();
      
      const newPost: Post = {
        ...postData,
        id: `post_${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
      };
      
      posts.unshift(newPost);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      resolve(newPost);
    }, 1000);
  });
};

// Like/unlike a post
export const toggleLikePost = (postId: string): Promise<{ post: Post, liked: boolean }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const posts = getStoredPosts();
      const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || "[]");
      
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        throw new Error("Post not found");
      }
      
      const isLiked = likedPosts.includes(postId);
      if (isLiked) {
        // Unlike
        posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1);
        const newLikedPosts = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(newLikedPosts));
      } else {
        // Like
        posts[postIndex].likes += 1;
        likedPosts.push(postId);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedPosts));
      }
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      resolve({ post: posts[postIndex], liked: !isLiked });
    }, 500);
  });
};

// Check if user has liked a post
export const hasLikedPost = (postId: string): boolean => {
  const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || "[]");
  return likedPosts.includes(postId);
};
