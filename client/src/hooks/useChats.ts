import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type ChatType } from "../types/ChatTypes";

// --- API Functions (Standalone) ---

const fetchChats = async (): Promise<ChatType[]> => {
  const { data } = await axios.get<{ data: ChatType[] }>("http://localhost:5000/api/getChats", {
    withCredentials: true,
  });
  return data.data;
};

export const markMessagesAsRead = async (conversationId: number): Promise<void> => {
  await axios.post(
    `http://localhost:5000/api/markMessagesAsRead`,
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
    // After the server successfully updates, tell the list to refresh
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};