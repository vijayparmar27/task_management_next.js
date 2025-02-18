import { ProjectStatus, Roles } from "./globle.interface";

export interface IProjectsReq {
  _id?: string;
  status: ProjectStatus;
  title: string;
  description: string;
  members: {
    id: string;
    role: Roles;
  }[];
  dueDate: string;
}
