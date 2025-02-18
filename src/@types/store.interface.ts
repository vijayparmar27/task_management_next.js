import { IProjectsRes } from "./apiResponce.interface";
import { ProjectStatus, Roles, Status } from "./globle.interface";

export interface User {
  message: string;
  data: {
    email: string;
    name: string;
    members: {
      _id: string;
      name: string;
      email: string;
      role: Roles;
    }[];
  };
}

export type ApiStatus = "loading" | "succeeded" | "failed" | "idel";

export interface UserState {
  userData: User | null;
  status: "loading" | "succeeded" | "failed" | "idel";
  error: null | string;
  isDisabledNavbar: boolean;
  isLoading: boolean;
}

export interface IProjects {
  _id?: string;
  status: ProjectStatus;
  title: string;
  description: string;
  members: {
    id: string;
    role: Roles;
  }[];
  dueDate: string;
  userId?: {
    id: string;
    name: string;
  };
}

export interface IProjectsState {
  projects: IProjectsRes[] | null;
  status: ApiStatus;
  error: null | string;
}

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "Hign",
}

export interface ITasks {
  _id?: string;
  projectId?: string;
  title: string;
  description: string;
  status: Status;
  assignee?: string;
  priority: Priority;
  dueDate: string;
}

export interface ITasksState {
  tasks: ITasks[] | null;
  status: ApiStatus;
  error: null | string;
}

export interface IStoreRoot {
  user: UserState;
  projects: IProjectsState;
  tasks: ITasksState;
}
