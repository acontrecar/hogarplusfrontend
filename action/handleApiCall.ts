import { isAxiosError } from "axios";
import { GlobalApiResponse } from "../infraestructure/interfaces/global/global-api-response";

export const handleApiCall = async <T>(
  apiCall: () => Promise<{ data: GlobalApiResponse<T> }>
): Promise<GlobalApiResponse<T> | null> => {
  try {
    const { data } = await apiCall();
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const err = error.response?.data as GlobalApiResponse<any>;
      console.log(
        `❌ API Error [${err.statusCode} - ${err.path}]: ${JSON.stringify(
          err.message
        )}`
      );

      return err;
    } else {
      console.log("❌ Unknown Error:", error);
    }
    return null;
  }
};
