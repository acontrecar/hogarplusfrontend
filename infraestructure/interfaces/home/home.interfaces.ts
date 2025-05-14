export interface CreateHomeResponse {
  home: Home;
}

export type RolHome = "admin" | "member";

export interface GetHomeByUserResponse {
  homes: HomesByUser[];
}

export interface Home {
  id: number;
  name: string;
  invitationCode: string;
}

export interface HomesByUser extends Home {
  isAdmin: boolean;
}

export interface HomeDetails extends Home {
  members: Member[];
}

export interface GetHomeDetails {
  home: HomeDetails;
}

export interface DeleteHomeResponse {
  message: string;
}

export interface Member {
  userId: number;
  memberId: number;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}
