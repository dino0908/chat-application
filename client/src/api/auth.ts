import { type AuthFormType } from "../schema/authSchema";
import { type AuthResponse } from "../types/AuthTypes";
import axios from "axios";

export const loginUser = async (data: AuthFormType): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      "http://localhost:5000/api/login",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    let message = "An unexpected error occurred.";

    if (axios.isAxiosError(error)) {
      // SERVER ERRORS (Wrong credentials, 404, 500, etc.) backend sends { message: "..." }
      message = error.response?.data?.message || "Server connection failed.";
    } else if (error instanceof Error) {
      // LOCAL ERRORS (Logic crashes, network timeout, etc.)
      message = error.message;
    }
    throw new Error(message);
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
  } catch (error: unknown) {
    let message = "An unexpected error occurred.";

    if (axios.isAxiosError(error)) {
      // SERVER ERRORS (Wrong credentials, 404, 500, etc.) backend sends { message: "..." }
      message = error.response?.data?.message || "Server connection failed.";
    } else if (error instanceof Error) {
      // LOCAL ERRORS (Logic crashes, network timeout, etc.)
      message = error.message;
    }
    throw new Error(message);
  }
};
