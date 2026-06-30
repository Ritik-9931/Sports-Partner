import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";
// ==================== POSTS ====================

// Get Posts
export const fetchCommunityPosts = createAsyncThunk(
  "communityPosts/fetchCommunityPosts",
  async (communityId, thunkAPI) => {
    try {
      const { data } = await api.get(`/community-posts/${communityId}/posts`);
      return data.posts;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts",
      );
    }
  },
);

// Create Post
export const createCommunityPost = createAsyncThunk(
  "communityPosts/createCommunityPost",
  async ({ communityId, formData }, thunkAPI) => {
    try {
      const { data } = await api.post(
        `/community-posts/${communityId}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data.post;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

// Delete Post
export const deleteCommunityPost = createAsyncThunk(
  "communityPosts/deleteCommunityPost",
  async (postId, thunkAPI) => {
    try {
      await api.delete(`/community-posts/posts/${postId}`);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

// Like / Unlike
export const likeCommunityPost = createAsyncThunk(
  "communityPosts/likeCommunityPost",
  async (postId, thunkAPI) => {
    try {
      const { data } = await api.put(`/community-posts/posts/${postId}/like`);

      return data.post;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to like post",
      );
    }
  },
);

// ==================== COMMENTS ====================

// Get Comments
export const fetchComments = createAsyncThunk(
  "communityPosts/fetchComments",
  async (postId, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/community-posts/posts/${postId}/comments`,
      );

      return {
        postId,
        comments: data.comments,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments",
      );
    }
  },
);

// Add Comment
export const addComment = createAsyncThunk(
  "communityPosts/addComment",
  async ({ postId, comment }, thunkAPI) => {
    try {
      const { data } = await api.post(
        `/community-posts/posts/${postId}/comments`,
        { comment },
      );

      return {
        postId,
        comment: data.comment,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

// Delete Comment
export const deleteComment = createAsyncThunk(
  "communityPosts/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      await api.delete(`/community-posts/comments/${commentId}`);

      return {
        postId,
        commentId,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

// ==================== Slice ====================

const communityPostSlice = createSlice({
  name: "communityPosts",

  initialState: {
    posts: [],
    comments: {},
    loading: false,
    actionLoading: false,
    error: null,
  },

  reducers: {
    clearPostError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Posts
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Post
      .addCase(createCommunityPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // Delete Post
      .addCase(deleteCommunityPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })

      // Like Post
      .addCase(likeCommunityPost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        );
      })

      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (!state.comments[action.payload.postId]) {
          state.comments[action.payload.postId] = [];
        }

        state.comments[action.payload.postId].push(action.payload.comment);
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = state.comments[
          action.payload.postId
        ].filter((comment) => comment._id !== action.payload.commentId);
      });
  },
});

export const { clearPostError } = communityPostSlice.actions;

export default communityPostSlice.reducer;
