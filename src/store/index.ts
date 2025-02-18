import { configureStore } from "@reduxjs/toolkit";
import user from "./user/user.store";
import projects from "./projects/project.store";
import tasks from "./tasks/task.store";

export const store = configureStore({
  reducer: {
    user,
    projects,
    tasks,
  },
});

export type AppDispatch = typeof store.dispatch;
