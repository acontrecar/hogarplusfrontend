export interface CreateHomeResponse {
  home: Home;
}

export interface GetHomeByUserResponse {
  home: HomesByUser;
}

export interface Home {
  id: number;
  name: string;
  invitationCode: string;
}

export interface HomesByUser extends Home {
  isAdmin: boolean;
}
