export interface IAxiosError {
  response?: { data?: { message?: string } };
  message?: string;
}

export enum ProjectStatus {
  CREATED = "CREATED",
  ON_GOING = "ON_GOING",
  COMPLETE = "COMPLETE",
}

export enum Roles {
  Admin = "Admin",
  Manager = "Manager",
  Member = "Member",
}

export enum Status {
  To_Do = "To Do",
  In_Progress = "In Progress",
  Done = "Done",
}
