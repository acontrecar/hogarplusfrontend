import { hogarPlusApi } from '../../config/api/hogarPlusApi';
import { CreateTaskResponse } from '../../infraestructure/interfaces/calendar/calendar';
import {
  CreateDebtsDto,
  CreateDebtsResponse,
  DeleteDebtResponse,
  GetDebtsByHome,
  PaidDebtMember,
  SummaryDebtResponse
} from '../../infraestructure/interfaces/debts/debts.interfaces';
import { GlobalApiResponse } from '../../infraestructure/interfaces/global/global-api-response';
import { handleApiCall } from '../handleApiCall';

export const createDebtAction = async (
  debt: CreateDebtsDto
): Promise<GlobalApiResponse<CreateDebtsResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.post<GlobalApiResponse<CreateDebtsResponse>>('/debts', debt));
};

export const getDebtsByHomeAction = async (homeId: string): Promise<GlobalApiResponse<GetDebtsByHome> | null> => {
  return handleApiCall(() => hogarPlusApi.get<GlobalApiResponse<GetDebtsByHome>>('/debts/home/' + homeId));
};

export const payDebtMemberAction = async (debtMemberId: string): Promise<GlobalApiResponse<PaidDebtMember> | null> => {
  return handleApiCall(() => hogarPlusApi.patch<GlobalApiResponse<PaidDebtMember>>('/debts/pay/' + debtMemberId));
};

export const deleteDebtAction = async (debtId: string): Promise<GlobalApiResponse<DeleteDebtResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.delete<GlobalApiResponse<DeleteDebtResponse>>('/debts/' + debtId));
};

export const summaryDebtAction = async (homeId: string): Promise<GlobalApiResponse<SummaryDebtResponse> | null> => {
  return handleApiCall(() => hogarPlusApi.get<GlobalApiResponse<SummaryDebtResponse>>(`/debts/${homeId}/summary`));
};
