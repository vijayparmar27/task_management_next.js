import { Roles } from "./globle.interface";

export interface IUserApi {
  name: string;
  email: string;
  members: {
    _id: string;
    name: string;
    email: string;
    role: Roles;
  }[];
}

export interface IUserApiFormateRes {
  message?: string;
  data: {
    user: IUserApi;
  };
}
