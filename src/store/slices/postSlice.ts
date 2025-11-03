import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postsAPI from "@/api/posts";

interface Post {
  _id: string;
  liked_account_ids: string[];
  [key: string]: any;
}

interface Review {
  status: string;
  [key: string]: any;
}

interface PaginatedData {
  data: any[];
  current_page: number;
  next_page_url?: string;
  [key: string]: any;
}

interface PostsState {
  posts: PaginatedData[];
  categories: PaginatedData[];
  liked_posts: PaginatedData | null;
  post: Post | null;
  reviews: PaginatedData | null;
  related_posts_urls: string[];
  related_posts: PaginatedData[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  categories: [],
  liked_posts: null,
  post: null,
  reviews: null,
  related_posts_urls: [],
  related_posts: [],
  loading: false,
  error: null,
};

// Async Thunks
export const getPostDetails = createAsyncThunk(
  'posts/getPostDetails',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPostDetails({ _id });
      console.log("从接口获取到的数据为", response)
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.message || '获取文章详情失败');
    }
  }
);

export const filterPostsByCategories = createAsyncThunk(
  'posts/filterPostsByCategories',
  async (params: {
    next_page_url?: string;
    category_ids?: string[];
    logic_gate?: string;
    per_page?: number;
    page?: number;
    slug?: string;
    keyword?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.filterPostsByCategories(params);
      console.log("|response.data", response)
      return response;
    } catch (error: any) {
      console.log("获取的论设数据出错", error)
      return rejectWithValue(error.response?.data?.message || '筛选文章失败');
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<PaginatedData>) => {
      state.categories = [action.payload];
    },
    pushCategories: (state, action: PayloadAction<PaginatedData>) => {
      state.categories.push(action.payload);
    },
    setLikedPosts: (state, action: PayloadAction<PaginatedData>) => {
      state.liked_posts = action.payload;
    },
    setReviews: (state, action: PayloadAction<PaginatedData>) => {
      state.reviews = action.payload;
    },
    setRelatedPostsUrls: (state, action: PayloadAction<string[]>) => {
      state.related_posts_urls = action.payload;
    },
    setRelatedPosts: (state, action: PayloadAction<PaginatedData>) => {
      state.related_posts = [action.payload];
    },
    pushRelatedPosts: (state, action: PayloadAction<PaginatedData>) => {
      state.related_posts.push(action.payload);
    },
    removeFetchedPostsUrl: (state, action: PayloadAction<string>) => {
      const idx = state.related_posts_urls.indexOf(action.payload);
      if (idx !== -1) {
        state.related_posts_urls.splice(idx, 1);
      }
    },
    updateLike: (state, action: PayloadAction<{ post: Post; currentUserId: string }>) => {
      const { post, currentUserId } = action.payload;

      if (!state.liked_posts || !state.post) return;

      const likedPosts = state.liked_posts.data;
      const isLiked = likedPosts.some((likedPost: Post) => likedPost._id === post._id);

      if (isLiked) {
        // 取消喜欢
        state.liked_posts.data = likedPosts.filter(
          (likedPost: Post) => likedPost._id !== post._id
        );
        state.post.liked_account_ids = state.post.liked_account_ids.filter(
          (id: string) => id !== currentUserId
        );
      } else {
        // 添加喜欢
        state.liked_posts.data.push(post);
        state.post.liked_account_ids.push(currentUserId);
      }
    },
    pushReview: (state, action: PayloadAction<Review>) => {
      if (state.reviews) {
        state.reviews.data.unshift(action.payload);
      }
    },
    updateReview: (state) => {
      if (state.reviews && state.reviews.data.length > 0) {
        state.reviews.data[0].status = "ACTIVE";
      }
    },
    undoReview: (state) => {
      if (state.reviews) {
        state.reviews.data.shift();
      }
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    clearPost: (state) => {
      state.post = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        console.log("getPostDetails fulfilled", action.payload)
        state.post = action.payload;
      })
      .addCase(getPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(filterPostsByCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterPostsByCategories.fulfilled, (state, action) => {
        state.loading = false;
        console.log("crateAsyncChunk", action.payload)
        if (action.payload.current_page === 1) {
          state.posts = [...action.payload.data];
        } else {
          state.posts.push(...action.payload.data);
        }
      })
      .addCase(filterPostsByCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setCategories,
  pushCategories,
  setLikedPosts,
  setReviews,
  setRelatedPostsUrls,
  setRelatedPosts,
  pushRelatedPosts,
  removeFetchedPostsUrl,
  updateLike,
  pushReview,
  updateReview,
  undoReview,
  clearPosts,
  clearPost,
  clearError
} = postsSlice.actions;
export default postsSlice.reducer;