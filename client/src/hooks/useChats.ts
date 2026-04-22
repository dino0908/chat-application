import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchChats = async () => {
  // Axios automatically sends cookies if you are on the same domain
  // or have withCredentials set in your global axios config
  // the /getChats API requires the user's id as a param to show the chats the user is in but it gets it from the jwt token (middleware function verifyToken handles this)
  const { data } = await axios.get("http://localhost:5000/api/getChats", {
    withCredentials: true,
  });
  return data.data; 
};

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"], // Unique key for the chat list
    queryFn: fetchChats,
    // Refetch when the window is refocused to keep unread counts/online status fresh
    refetchOnWindowFocus: true, 
    staleTime: 1000 * 30, // Keep data fresh for 30 seconds
  });
};