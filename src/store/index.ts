import { configureStore } from "@reduxjs/toolkit";
import user from "./user/user.store";

export const store = configureStore({
  reducer: {
    user,
  },
});
