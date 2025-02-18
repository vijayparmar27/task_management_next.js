import { ProjectStatus, Roles } from "./globle.interface";

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

export interface IProjectsRes {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  dueDate: number;
  members: {
    id: string;
    _id: string;
    name: string;
    email: string;
  }[];
  user: {
    _id: string;
    name: string;
  };
}

export interface IProjectsFormateRes {
  message?: string;
  data: {
    projects: IProjectsRes[];
  };
}
