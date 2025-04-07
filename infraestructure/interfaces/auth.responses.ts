export interface AuthRegisterResponse {
  user: UserI;
  token: string;
}

export interface UserI {
  id: number;
  name: string;
  email: string;
}
