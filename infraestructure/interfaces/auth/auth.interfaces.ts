import { UserI } from "./auth.responses";

export interface AuthToRegister {
  user: {
    name: string;
    email: string;
    password: string;
  };
}

export interface AuthToLogin {
  user: {
    email: string;
    password: string;
  };
}

// export interface AuthUserWithToken {
//   user: UserI;
//   token: string;
// }
