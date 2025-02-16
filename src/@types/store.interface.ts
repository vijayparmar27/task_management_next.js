export interface User {
  message: string;
  data: {
    email: string;
    name: string;
  };
}

export interface UserState {
  userData: User | null;
  status: "loading" | "succeeded" | "failed" | "idel";
  error: null | string;
  isDisabledNavbar: boolean;
}

export interface IStoreRoot {
  user: UserState;
}
