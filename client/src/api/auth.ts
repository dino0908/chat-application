import { type AuthFormType } from "../schema/authSchema";
import { type AuthResponse } from "../types/AuthTypes";
import axios from "axios";

export const loginUser = async (data: AuthFormType): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>("http://localhost:5000/api/login", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (data: AuthFormType): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      "http://localhost:5000/api/register",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";

    throw new Error(errorMessage);
  }
};
