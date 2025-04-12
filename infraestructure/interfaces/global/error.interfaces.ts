export interface GlobalErrorResponse {
  statusCode: number;
  path: string;
  message: Message;
  data: Data;
}

export interface Data {}

export interface Message {
  message: string;
  error: string;
  statusCode: number;
}
