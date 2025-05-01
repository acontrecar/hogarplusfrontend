import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import {
  AuthRegisterResponse,
  AuthUserWithToken,
} from "../../infraestructure/interfaces/auth/auth.responses";
import {
  AuthToLogin,
  AuthToRegister,
} from "../../infraestructure/interfaces/auth/auth.interfaces";
import { handleApiCall } from "../handleApiCall";
import { GlobalApiResponse } from "../../infraestructure/interfaces/global/global-api-response";

export const authRegister = async (
  name: string,
  email: string,
  password: string
): Promise<GlobalApiResponse<AuthUserWithToken> | null> => {
  const user: AuthToRegister = {
    name,
    email: email.toLowerCase(),
    password,
  };

  return handleApiCall(() =>
    hogarPlusApi.post<GlobalApiResponse<AuthUserWithToken>>(
      "/auth/register",
      user
    )
  );
};

export const authLogin = async (
  email: string,
  password: string
): Promise<GlobalApiResponse<AuthUserWithToken> | null> => {
  email = email.toLowerCase();
  const user: AuthToLogin = {
    email,
    password,
  };

  return handleApiCall(() =>
    hogarPlusApi.post<GlobalApiResponse<AuthUserWithToken>>("/auth/login", user)
  );
};

export const authCheckStatus =
  async (): Promise<GlobalApiResponse<AuthUserWithToken> | null> => {
    return handleApiCall(() =>
      hogarPlusApi.get<GlobalApiResponse<AuthUserWithToken>>("/auth/me")
    );
  };

function returnUserToken(data: AuthRegisterResponse) {
  console.log("La data del registro es: ", data);

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
