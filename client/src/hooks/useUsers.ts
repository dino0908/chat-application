import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { UserType } from "../types/UserTypes";

const fetchUsers = async (): Promise<UserType[]> => {
  const { data } = await axios.get<{ data: UserType[] }>("http://localhost:5000/api/users");
  return data.data; // Returning the 'data' array from JSON response
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, 
  });
};

