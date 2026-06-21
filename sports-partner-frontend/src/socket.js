import { io } from "socket.io-client";

const socket = io("https://sports-partner.onrender.com", {
  transports: ["websocket"],
});

export default socket;