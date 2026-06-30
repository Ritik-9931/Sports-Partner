import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import gameReducer from "./slices/gameSlice";
import communityReducer from "./slices/communitySlice";
import playRequestReducer from "./slices/playRequestSlice";
import communityPostReducer from "./slices/communityPostSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userInfo: userReducer,
    games: gameReducer,
    communities: communityReducer,
    playRequests: playRequestReducer,
    communityPosts: communityPostReducer,
  },
});
