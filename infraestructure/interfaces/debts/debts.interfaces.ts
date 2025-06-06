export interface CreateDebtsDto {
  description: string;
  amount: number;
  affectedMemberIds: number[];
  homeId: number;
}

export interface CreateTaskResponse {
  message: string;
}
