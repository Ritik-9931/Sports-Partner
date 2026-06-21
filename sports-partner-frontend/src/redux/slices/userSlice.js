import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",

  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/users/profile");
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "User/updateProfile",

  async (FormData, thunkAPI) => {
    try {
      const { data } = await api.put("/users/profile", FormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const updatePrivacy = createAsyncThunk(
  "user/updatePrivacy",

  async (privacyData, thunkAPI) => {
    try {
      const { data } = await api.put("/users/privacy", privacyData);

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update privacy",
      );
    }
  },
);

export const updateLocation = createAsyncThunk(
  "user/updateLocation",

  async ({ latitude, longitude, address }, thunkAPI) => {
    try {
      const { data } = await api.put("/users/location", {
        latitude,
        longitude,
        address,
      });

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update location",
      );
    }
  },
);

export const fetchUserProfileById = createAsyncThunk(
  "user/fetchUserProfileById",

  async (userId, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/profile/${userId}`);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile",
      );
    }
  },
);

const userSlice = createSlice({
  name: "userInfo",

  initialState: {
    profile: null,
    viewedProfile: null,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePrivacy.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updatePrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.viewedProfile = null;
      })
      .addCase(fetchUserProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(fetchUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
