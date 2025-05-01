export interface AuthToRegister {
  name: string;
  email: string;
  password: string;
}

export interface AuthToLogin {
  email: string;
  password: string;
}

// export interface AuthUserWithToken {
//   user: UserI;
//   token: string;
// }
