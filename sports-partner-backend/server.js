import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./models/User.js";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import playRequestRoutes from "./routes/playRequestRoutes.js";
import communityPostRoutes from "./routes/communityPostRoutes.js";

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("user-online", async (userId) => {
    try {
      console.log("ONLINE EVENT RECEIVED:", userId);

      socket.userId = userId;

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });

      console.log("socket.userId set:", socket.userId);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      console.log("OFFLINE USER ID:", socket.userId);

      if (!socket.userId) return;

      const user = await User.findByIdAndUpdate(
        socket.userId,
        {
          isOnline: false,
          lastSeen: new Date(),
        },
        {
          returnDocument: "after",
        },
      );
    } catch (err) {
      console.error(err);
    }
  });
});

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sports Partner Finder API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/games", gameRoutes);

app.use("/api/communities", communityRoutes);

app.use("/api/play-requests", playRequestRoutes);

app.use("/api/community-posts", communityPostRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
