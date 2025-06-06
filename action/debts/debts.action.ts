import { hogarPlusApi } from '../../config/api/hogarPlusApi';
import { CreateTaskResponse } from '../../infraestructure/interfaces/calendar/calendar';
import { CreateDebtsDto } from '../../infraestructure/interfaces/debts/debts.interfaces';
import { GlobalApiResponse } from '../../infraestructure/interfaces/global/global-api-response';
import { handleApiCall } from '../handleApiCall';

export const createDebtAction = async (debt: CreateDebtsDto): Promise<GlobalApiResponse<CreateTaskResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.post<GlobalApiResponse<CreateTaskResponse>>('/debts', debt));
};
