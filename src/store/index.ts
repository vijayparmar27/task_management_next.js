import { configureStore } from "@reduxjs/toolkit";
import user from "./user/user.store";
import projects from "./projects/project.store";
import tasks from "./tasks/task.store";
import logs from "./logs/logs.store";

export const store = configureStore({
  reducer: {
    user,
    projects,
    tasks,
    logs,
  },
});

export type AppDispatch = typeof store.dispatch;
