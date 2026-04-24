import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type ChatType } from "../types/ChatTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// --- API Functions (Standalone) ---

const fetchChats = async (): Promise<ChatType[]> => {
  const { data } = await axios.get<{ data: ChatType[] }>(`${API_BASE_URL}/api/getChats`, {
    withCredentials: true,
  });
  return data.data;
};

export const markMessagesAsRead = async (conversationId: number): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/api/markMessagesAsRead`,
    { conversationId },
    { withCredentials: true }
  );
};

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] }); // After the server successfully updates, tell the list to refresh
    },
  });
};