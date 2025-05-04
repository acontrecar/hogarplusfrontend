import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import { GlobalApiResponse } from "../../infraestructure/interfaces/global/global-api-response";
import {
  CreateHomeResponse,
  GetHomeByUserResponse,
  HomesByUser,
} from "../../infraestructure/interfaces/home/home.interfaces";
import { handleApiCall } from "../handleApiCall";

export const createHome = async (
  homeName: string
): Promise<GlobalApiResponse<CreateHomeResponse> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.post<GlobalApiResponse<CreateHomeResponse>>("/home", {
      name: homeName,
    })
  );
};

export const getHomesByUser =
  async (): Promise<GlobalApiResponse<GetHomeByUserResponse> | null> => {
    return handleApiCall(() =>
      hogarPlusApi.get<GlobalApiResponse<GetHomeByUserResponse>>("/home")
    );
  };
