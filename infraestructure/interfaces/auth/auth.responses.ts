import { User } from "../../../domain/entities/user";

export interface AuthRegisterResponse {
  user: UserI;
  token: string;
}

export interface UserI {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: UserI;
  token: string;
}

export interface AuthUserWithToken {
  user: User;
  token: string;
}
