import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMessages = (chatId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const { data } = await axios.get(`http://localhost:5000/api/messages/${chatId}`, {
        withCredentials: true
      });
      return data.data;
    },
    enabled: !!chatId, // Don't run the query if no chat is selected
  });
};