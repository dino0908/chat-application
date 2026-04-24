import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { UserType } from "../types/UserTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fetchUsers = async (): Promise<UserType[]> => {
  const { data } = await axios.get<{ data: UserType[] }>(`${API_BASE_URL}/api/users`);
  return data.data; // Returning the 'data' array from JSON response
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, 
  });
};

