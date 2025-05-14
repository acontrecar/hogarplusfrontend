import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import { GlobalApiResponse } from "../../infraestructure/interfaces/global/global-api-response";
import {
  CreateHomeResponse,
  DeleteHomeResponse,
  GetHomeByUserResponse,
  GetHomeDetails,
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

export const getHomeDetails = async (
  homeId: number
): Promise<GlobalApiResponse<GetHomeDetails> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.get<GlobalApiResponse<GetHomeDetails>>(`/home/${homeId}`)
  );
};

export const deleteHome = async (
  homeId: number
): Promise<GlobalApiResponse<DeleteHomeResponse> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.delete<GlobalApiResponse<DeleteHomeResponse>>(
      `/home/${homeId}`
    )
  );
};

export const exitFromHome = async (
  homeId: number
): Promise<GlobalApiResponse<DeleteHomeResponse> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.delete<GlobalApiResponse<DeleteHomeResponse>>(
      `/home/exit/${homeId}`
    )
  );
};
