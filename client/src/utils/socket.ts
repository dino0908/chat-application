import { io, Socket } from "socket.io-client";

const URL = "http://localhost:5000";

export const connectSocket = (userId: number): Socket => {
  return io(URL, {
    query: { userId },
    withCredentials: true,
    autoConnect: true, // Connect immediately when this function is called
  });
};