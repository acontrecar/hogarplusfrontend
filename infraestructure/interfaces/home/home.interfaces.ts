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

export interface HomesAndMembers {
  id: number;
  name: string;
  members: MemberOfHome[];
}

export interface MemberOfHome {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface GetHomesAndMembers {
  homes: HomeAndMembers[];
}

export interface HomeAndMembers {
  id: number;
  name: string;
  members: MemberOfHome[];
}

export interface Member {
  id: number;
  role: string;
  createdAt: Date;
}

export interface Member {
  id: number;
  role: string;
  createdAt: Date;
}
