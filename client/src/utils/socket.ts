import { io, Socket } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const connectSocket = (userId: number): Socket => {
  return io(API_BASE_URL, {
    query: { userId },
    withCredentials: true,
    autoConnect: true, // Connect immediately when this function is called
  });
};

