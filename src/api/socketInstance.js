// src/api/socketInstance.js
import { io } from "socket.io-client";

// Lấy base URL từ axiosInstance (bỏ /api)
const getSocketUrl = () => {
  const apiUrl = "https://screwbe.duckdns.org";
  // Socket thường chạy trên cùng domain nhưng không có /api
  return apiUrl.replace("/api", "");
};

let socket = null;

export const initSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = getSocketUrl();

  socket = io(socketUrl, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_error", (error) => {
    console.error("❌ Socket reconnection error:", error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export default socket;