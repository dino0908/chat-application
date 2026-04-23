import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type MessageType } from "../types/MessageTypes";

const fetchMessages = async (chatId: string): Promise<MessageType[]> => {
  const { data } = await axios.get<{ data: MessageType[] }>(
    `http://localhost:5000/api/messages/${chatId}`,
    { withCredentials: true },
  );
  return data.data;
};

export const useMessages = (chatId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", chatId], // including the chatId in the queryKey makes the cache unique per chat
    queryFn: () => fetchMessages(chatId!),
    enabled: !!chatId, // enabled ensures the function only runs when we have a valid string
    staleTime: 1000 * 60,
  });
};
