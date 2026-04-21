import { type AuthFormType } from "../schema/authSchema";

export const loginUser = async (data: AuthFormType) => {
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed. Please check your credentials.");
  }

  return response.json();
};


export const registerUser = async (data: AuthFormType) => {
  const response = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration failed. Unexpected server error.");
  }

  return response.json();
};