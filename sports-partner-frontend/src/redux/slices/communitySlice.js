import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";

export const fetchCommunities = createAsyncThunk(
  "communities/fetchCommunities",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/communities");
      return data.communities;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch communities",
      );
    }
  },
);

export const toggleCommunityBlock = createAsyncThunk(
  "communities/toggleCommunityBlock",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${id}/block`);
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update community",
      );
    }
  },
);

export const toggleCommunityActive = createAsyncThunk(
  "communities/toggleCommunityActive",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${id}/active`);
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update community",
      );
    }
  },
);

export const deleteCommunity = createAsyncThunk(
  "communities/deleteCommunity",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/communities/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete community",
      );
    }
  },
);

export const createCommunity = createAsyncThunk(
  "communities/createCommunity",
  async (formData, thunkAPI) => {
    try {
      const { data } = await api.post("/communities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create community",
      );
    }
  },
);

export const updateCommunity = createAsyncThunk(
  "communities/updateCommunity",
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update community",
      );
    }
  },
);

export const joinCommunity = createAsyncThunk(
  "communities/joinCommunity",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${id}/join`);
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to join community",
      );
    }
  },
);

export const leaveCommunity = createAsyncThunk(
  "communities/leaveCommunity",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${id}/leave`);
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to leave community",
      );
    }
  },
);

export const fetchCommunityById = createAsyncThunk(
  "communities/fetchCommunityById",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/communities/${id}`);
      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch community",
      );
    }
  },
);

export const fetchCommunityJoinRequests = createAsyncThunk(
  "communities/fetchCommunityJoinRequests",
  async (communityId, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/communities/${communityId}/join-requests`,
      );
      return data.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch join requests",
      );
    }
  },
);

export const approveCommunityJoinRequest = createAsyncThunk(
  "communities/approveCommunityJoinRequest",
  async (requestId, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/communities/join-requests/${requestId}/approve`,
      );
      return data.requestId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to approve request",
      );
    }
  },
);

export const rejectCommunityJoinRequest = createAsyncThunk(
  "communities/rejectCommunityJoinRequest",
  async (requestId, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/communities/join-requests/${requestId}/reject`,
      );
      return data.requestId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject request",
      );
    }
  },
);

export const blockUserFromCommunity = createAsyncThunk(
  "communities/blockUserFromCommunity",
  async ({ communityId, userId }, thunkAPI) => {
    try {
      const { data } = await api.put(`/communities/${communityId}/block-user`, {
        userId,
      });

      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to block user",
      );
    }
  },
);

export const unblockUserFromCommunity = createAsyncThunk(
  "communities/unblockUserFromCommunity",
  async ({ communityId, userId }, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/communities/${communityId}/unblock-user`,
        { userId },
      );

      return data.community;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to unblock user",
      );
    }
  },
);

const communitySlice = createSlice({
  name: "communities",
  initialState: {
    communities: [],
    selectedCommunity: null,
    joinRequests: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearCommunityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleCommunityBlock.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleCommunityBlock.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(toggleCommunityBlock.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(toggleCommunityActive.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleCommunityActive.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(toggleCommunityActive.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCommunity.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.filter(
          (community) => community._id !== action.payload,
        );
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities.unshift(action.payload);
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedCommunity = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCommunity = action.payload;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCommunityJoinRequests.fulfilled, (state, action) => {
        state.joinRequests = action.payload;
      })
      .addCase(approveCommunityJoinRequest.fulfilled, (state, action) => {
        state.joinRequests = state.joinRequests.filter(
          (request) => request._id !== action.payload,
        );
      })
      .addCase(rejectCommunityJoinRequest.fulfilled, (state, action) => {
        state.joinRequests = state.joinRequests.filter(
          (request) => request._id !== action.payload,
        );
      })

      .addCase(blockUserFromCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedCommunity = action.payload;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      })
      .addCase(unblockUserFromCommunity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedCommunity = action.payload;
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        );
      });
  },
});

export const { clearCommunityError } = communitySlice.actions;

export default communitySlice.reducer;
