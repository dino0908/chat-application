import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: number[]
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false, onlineUsers: [] });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return; // Don't connect until user is authenticated

    // Initialize connection (one instance for the entire app)
    const newSocket = io(`${API_BASE_URL}`, {
      query: { userId: user.id },
      withCredentials: true,
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('online_users', (userIds: number[]) => setOnlineUsers(userIds));

    newSocket.on('user_online', ({ userId }: { userId: number }) => 
      setOnlineUsers((prev) => [...new Set([...prev, userId])]));

    newSocket.on('user_offline', ({ userId }: { userId: number }) => 
      setOnlineUsers((prev) => prev.filter((id) => id !== userId)));

    setSocket(newSocket);

    // Cleanup: Disconnect when user logs out or component unmounts
    return () => {
      newSocket.close();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket anywhere in app
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
