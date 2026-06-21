import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";

export const createPlayRequest = createAsyncThunk(
  "playRequests/createPlayRequest",
  async (requestData, thunkAPI) => {
    try {
      const { data } = await api.post("/play-requests", requestData);
      return data.playRequest;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send play request",
      );
    }
  },
);

export const fetchMyPlayRequests = createAsyncThunk(
  "playRequests/fetchMyPlayRequests",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/play-requests/my");
      return data.playRequests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch play requests",
      );
    }
  },
);

export const updatePlayRequestStatus = createAsyncThunk(
  "playRequests/updatePlayRequestStatus",
  async ({ requestId, status }, thunkAPI) => {
    try {
      const { data } = await api.put(`/play-requests/${requestId}/status`, {
        status,
      });

      return data.playRequest;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update request",
      );
    }
  },
);

const playRequestSlice = createSlice({
  name: "playRequests",

  initialState: {
    playRequests: [],
    loading: false,
    actionLoading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearPlayRequestMessage: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createPlayRequest.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPlayRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.playRequests.unshift(action.payload);
      })
      .addCase(createPlayRequest.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyPlayRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPlayRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.playRequests = action.payload;
      })
      .addCase(fetchMyPlayRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePlayRequestStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePlayRequestStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.playRequests = state.playRequests.map((request) =>
          request._id === action.payload._id ? action.payload : request,
        );
      })
      .addCase(updatePlayRequestStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPlayRequestMessage } = playRequestSlice.actions;

export default playRequestSlice.reducer;
