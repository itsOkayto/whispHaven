import { User } from '@/services/auth';

export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'text';
  createdAt: Date;
  likes: number;
  comments: number;
  userId?: string;
  userAvatar?: string;
  userEmoji?: string;
  reactions?: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
  };
  isFlagged?: boolean;
  isPookieOfDay?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  userId?: string;
  userAvatar?: string;
  userEmoji?: string;
}

export type ReactionType = 'happy' | 'sad' | 'angry' | 'surprised';
export type PostType = 'image' | 'video' | 'text' | 'all';

const MOCK_POSTS: Post[] = [
  {
    id: "post1",
    content: "I secretly love pineapple on pizza but pretend to hate it around my friends...",
    mediaType: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 42,
    comments: 15,
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pizza123",
    userEmoji: "🐱",
    reactions: {
      happy: 20,
      sad: 5,
      angry: 7,
      surprised: 10
    },
    isPookieOfDay: true
  },
  {
    id: "post2",
    content: "I've been pretending to know how to code for 3 years at my job and nobody has noticed yet. I just use AI for everything 🤫",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    mediaType: "image",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 128,
    comments: 32,
    userAvatar: "https://api.dicebear.com/7.x/micah/svg?seed=dev456",
    userEmoji: "🐶",
  },
  {
    id: "post3",
    content: "Sometimes I wear mismatched socks on purpose because it makes me feel rebellious 🧦",
    mediaType: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    likes: 73,
    comments: 9,
    userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sock789",
    userEmoji: "🐰",
  },
  {
    id: "post4",
    content: "I rehearse conversations in the shower and then never use any of my prepared material",
    mediaUrl: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb",
    mediaType: "image",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 215,
    comments: 47,
    userAvatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=shower321",
    userEmoji: "🐼",
  },
  {
    id: "post5",
    content: "I still sleep with my childhood stuffed animal and I'm 30 years old. No regrets! 🧸",
    mediaType: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    likes: 320,
    comments: 62,
    userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=plush654",
    userEmoji: "🦊",
  },
];

const POSTS_STORAGE_KEY = "whispHaven_posts";
const LIKED_POSTS_KEY = "whispHaven_liked_posts";
const USER_REACTIONS_KEY = "whispHaven_user_reactions";
const COMMENTS_STORAGE_KEY = "whispHaven_comments";

// Profanity filter (basic)
const PROFANITY_WORDS = [
  "fuck", "shit", "ass", "bitch", "dick", "pussy", "cunt", "whore", "slut"
];

const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some(word => lowerText.includes(word));
};

const filterProfanity = (text: string): string => {
  let filteredText = text;
  PROFANITY_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const stars = '*'.repeat(word.length);
    filteredText = filteredText.replace(regex, stars);
  });
  return filteredText;
};

// Posts storage and retrieval
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

export const getPosts = (type?: PostType, reaction?: ReactionType): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let posts = getStoredPosts();
      
      // Filter by type if specified
      if (type && type !== 'all') {
        posts = posts.filter(post => post.mediaType === type);
      }
      
      // Filter by reaction if specified
      if (reaction) {
        posts = posts.filter(post => 
          post.reactions && post.reactions[reaction] && post.reactions[reaction] > 0
        );
      }
      
      // Sort by creation date (newest first)
      posts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      resolve(posts);
    }, 800);
  });
};

// Pookie of the Day selection
const updatePookieOfDay = (posts: Post[]): Post[] => {
  // Reset all posts
  posts.forEach(post => post.isPookieOfDay = false);
  
  // If there are posts, select one with the most reactions
  if (posts.length > 0) {
    const postsWithReactions = posts.filter(post => post.reactions);
    
    if (postsWithReactions.length > 0) {
      // Find post with most total reactions
      const postWithMostReactions = postsWithReactions.reduce((prev, current) => {
        const prevTotal = prev.reactions ? 
          (prev.reactions.happy + prev.reactions.sad + prev.reactions.angry + prev.reactions.surprised) : 0;
        const currentTotal = current.reactions ? 
          (current.reactions.happy + current.reactions.sad + current.reactions.angry + current.reactions.surprised) : 0;
        
        return prevTotal > currentTotal ? prev : current;
      });
      
      // Mark as pookie of the day
      const postIndex = posts.findIndex(p => p.id === postWithMostReactions.id);
      if (postIndex !== -1) {
        posts[postIndex].isPookieOfDay = true;
      }
    } else {
      // If no posts with reactions, select a random one
      const randomIndex = Math.floor(Math.random() * posts.length);
      posts[randomIndex].isPookieOfDay = true;
    }
  }
  
  return posts;
};

export const createPost = (
  postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'reactions' | 'isFlagged' | 'isPookieOfDay'>, 
  user?: User
): Promise<Post> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      
      // Filter profanity in content
      const filteredContent = filterProfanity(postData.content);
      
      const newPost: Post = {
        ...postData,
        content: filteredContent,
        id: `post_${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        userId: user?.id,
        userAvatar: user?.avatar,
        userEmoji: user?.emoji,
        isFlagged: containsProfanity(postData.content),
        reactions: {
          happy: 0,
          sad: 0,
          angry: 0,
          surprised: 0
        }
      };
      
      if (!postData.mediaType) {
        newPost.mediaType = postData.mediaUrl ? 
          (postData.mediaUrl.includes('video') ? 'video' : 'image') : 'text';
      }
      
      posts.unshift(newPost);
      
      // Update pookie of the day
      const updatedPosts = updatePookieOfDay(posts);
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      
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
      
      // Update pookie of the day
      const updatedPosts = updatePookieOfDay(posts);
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      
      // Delete related data
      const userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || "{}");
      if (userReactions[postId]) {
        delete userReactions[postId];
        localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(userReactions));
      }
      
      // Delete comments for this post
      const comments = getStoredComments();
      const filteredComments = comments.filter(comment => comment.postId !== postId);
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(filteredComments));
      
      resolve(true);
    }, 500);
  });
};

export const flagPost = (postId: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        reject(new Error("Post not found"));
        return;
      }
      
      posts[postIndex].isFlagged = true;
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      
      resolve(posts[postIndex]);
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
      
      // Update pookie of the day after reactions change
      const updatedPosts = updatePookieOfDay(posts);
      
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(userReactions));
      
      resolve(updatedPosts[postIndex]);
    }, 500);
  });
};

// Comments functionality
const getStoredComments = (): Comment[] => {
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }));
    } catch (error) {
      console.error("Error parsing stored comments:", error);
      return [];
    }
  }
  return [];
};

export const getComments = (postId: string): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = getStoredComments();
      resolve(comments
        .filter(comment => comment.postId === postId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }, 500);
  });
};

export const addComment = (
  postId: string, 
  content: string, 
  user?: User
): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!content.trim()) {
        reject(new Error("Comment cannot be empty"));
        return;
      }
      
      // Filter profanity
      const filteredContent = filterProfanity(content);
      
      // Create new comment
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        postId,
        content: filteredContent,
        createdAt: new Date(),
        userId: user?.id,
        userAvatar: user?.avatar,
        userEmoji: user?.emoji,
      };
      
      // Add to storage
      const comments = getStoredComments();
      comments.push(newComment);
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
      
      // Update post comment count
      const posts = getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        posts[postIndex].comments += 1;
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      }
      
      resolve(newComment);
    }, 500);
  });
};

export const deleteComment = (commentId: string, userId?: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const comments = getStoredComments();
      const commentIndex = comments.findIndex(c => c.id === commentId);
      
      if (commentIndex === -1) {
        reject(new Error("Comment not found"));
        return;
      }
      
      const comment = comments[commentIndex];
      
      if (userId && comment.userId && comment.userId !== userId) {
        reject(new Error("Unauthorized: You can only delete your own comments"));
        return;
      }
      
      // Update post comment count
      const postId = comment.postId;
      const posts = getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        posts[postIndex].comments = Math.max(0, posts[postIndex].comments - 1);
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      }
      
      // Remove the comment
      comments.splice(commentIndex, 1);
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
      
      resolve(true);
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
