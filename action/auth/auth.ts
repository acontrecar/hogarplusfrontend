import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import { User, UserData } from "../../domain/entities/user";
import { AuthRegisterResponse } from "../../infraestructure/interfaces/auth.responses";
import {
  AuthToRegister,
  AuthUserWithToken,
} from "../../infraestructure/interfaces/auth/auth.interfaces";

export const authRegister = async (
  name: string,
  email: string,
  password: string
): Promise<AuthUserWithToken | null> => {
  email = email.toLowerCase();
  const user: AuthToRegister = {
    user: {
      name,
      email,
      password,
    },
  };

  try {
    const { data } = await hogarPlusApi.post<AuthRegisterResponse>("/user", {
      user,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log(`Register error: ${error}`);
    return null;
  }
};

function returnUserToken(data: AuthRegisterResponse) {
  const user: AuthUserWithToken = {
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    },
    token: data.token,
  };

  return user;
}
