export interface GlobalApiResponse<T = any> {
  statusCode: number;
  path: string;
  message: string;
  data: T;
  ok: boolean;
}
