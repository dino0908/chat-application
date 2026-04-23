import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type ChatType } from "../types/ChatTypes";

const fetchChats = async (): Promise<ChatType[]>=> {
  // Axios automatically sends cookies if you are on the same domain or have withCredentials set in your global axios config
  // the /getChats API requires the user's id as a param to show the chats the user is in but it gets it from the jwt token (middleware function verifyToken handles this)
  const { data } = await axios.get<{ data: ChatType[] }>("http://localhost:5000/api/getChats", {
    withCredentials: true,
  });

  return data.data; 
};

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    refetchOnWindowFocus: true, 
    staleTime: 1000 * 30,
  });
};