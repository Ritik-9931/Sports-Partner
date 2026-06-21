import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../service/api";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",

  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/games");

      return data.games;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createGame = createAsyncThunk(
  "games/createGame",

  async (formData, thunkAPI) => {
    try {
      const { data } = await api.post("/games", formData);

      return data.game;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateGame = createAsyncThunk(
  "games/updateGame",

  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/games/${id}`, formData);

      return data.game;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteGame = createAsyncThunk(
  "games/deleteGame",

  async (id, thunkAPI) => {
    try {
      await api.delete(`/games/${id}`);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const gameSlice = createSlice({
  name: "games",

  initialState: {
    games: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearGameError: (state) => {
      state.error = null;
    },

    resetGameSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.games.unshift(action.payload);
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.games = state.games.map((game) =>
          game._id === action.payload._id ? action.payload : game,
        );
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.games = state.games.filter((game) => game._id !== action.payload);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGameError, resetGameSuccess } = gameSlice.actions;

export default gameSlice.reducer;
