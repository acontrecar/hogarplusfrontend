export interface UserData {
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  avatarPublicId?: string;
}
