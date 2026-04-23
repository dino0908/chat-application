import { type UserType } from "./UserTypes";

export interface AuthResponse { // response on SUCCESSFUL login / registration
  message: string;
  user: UserType;
}

// Do not include the error shape in your Promise<AuthResponse>. 
// In TypeScript, a function's return type only describes what happens when the function succeeds. 
// When a function "throws" (fails), it exits a different door.