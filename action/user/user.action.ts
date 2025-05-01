import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import { User } from "../../domain/entities/user";
import { GlobalApiResponse } from "../../infraestructure/interfaces/global/global-api-response";
import { handleApiCall } from "../handleApiCall";

export const updateUserProfile = async (
  formData: FormData
): Promise<GlobalApiResponse<User> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.patch<GlobalApiResponse<User>>("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
