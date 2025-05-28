import { hogarPlusApi } from "../../config/api/hogarPlusApi";
import { GetTasksResponse } from "../../infraestructure/interfaces/calendar/calendar";
import { GlobalApiResponse } from "../../infraestructure/interfaces/global/global-api-response";
import { DeleteHomeResponse } from "../../infraestructure/interfaces/home/home.interfaces";
import { handleApiCall } from "../handleApiCall";

export const getTasksByHouse = async (
  houseId: string
): Promise<GlobalApiResponse<GetTasksResponse> | null> => {
  return handleApiCall(() =>
    hogarPlusApi.get<GlobalApiResponse<GetTasksResponse>>(
      `/task/house/${houseId}`
    )
  );
};
