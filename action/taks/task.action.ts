import { hogarPlusApi } from '../../config/api/hogarPlusApi';
import {
  CompleteTaskResponse,
  CreateTaskDto,
  CreateTaskResponse,
  DeleteTaskDto,
  GetTasksResponse,
  SummaryDto,
  Task
} from '../../infraestructure/interfaces/calendar/calendar';
import { GlobalApiResponse } from '../../infraestructure/interfaces/global/global-api-response';
import { DeleteHomeResponse } from '../../infraestructure/interfaces/home/home.interfaces';
import { handleApiCall } from '../handleApiCall';

export const getTasksByHouse = async (houseId: string): Promise<GlobalApiResponse<GetTasksResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.get<GlobalApiResponse<GetTasksResponse>>(`/task/house/${houseId}`));
};

export const createTaskAction = async (
  createTask: CreateTaskDto
): Promise<GlobalApiResponse<CreateTaskResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.post<GlobalApiResponse<CreateTaskResponse>>(`/task`, createTask));
};

export const completeTaskAction = async (taskId: string): Promise<GlobalApiResponse<CompleteTaskResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.post<GlobalApiResponse<CompleteTaskResponse>>(`/task/complete/${taskId}`));
};

export const deleteTaskAction = async (deleteTaskDto: DeleteTaskDto): Promise<GlobalApiResponse<Task> | null> => {
  return handleApiCall(() => hogarPlusApi.post<GlobalApiResponse<Task>>(`/task/house`, deleteTaskDto));
};

export const summaryTaskAction = async (homeId: string): Promise<GlobalApiResponse<SummaryDto> | null> => {
  return handleApiCall(() => hogarPlusApi.get<GlobalApiResponse<SummaryDto>>(`/task/${homeId}/summary`));
};
