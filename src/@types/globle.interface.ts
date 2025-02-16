export interface IAxiosError {
  response?: { data?: { message?: string } };
  message?: string;
}
