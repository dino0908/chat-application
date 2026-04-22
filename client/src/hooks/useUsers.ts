import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const { data } = await axios.get("http://localhost:5000/api/users");
  return data.data; // Returning the 'data' array from JSON response
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, 
  });
};

