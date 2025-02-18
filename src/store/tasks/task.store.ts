import { IAxiosError } from "@/@types/globle.interface";
import { IStoreRoot, ITasks, ITasksState } from "@/@types/store.interface";
import showToast from "@/components/ui/Toasters";
import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import axiosClient from "@/utils/axios.utils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setLoading } from "../user/user.store";

export const taksApi = createAsyncThunk<{ message: string }, ITasks>(
  "taksApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.TASKS.TASKS, data);
      return response.data as { message: string };
    } catch (error) {
      const errorMessage: string =
        (<IAxiosError>error)?.response?.data?.message ??
        (<IAxiosError>error).message ??
        "something want wrong";

      showToast("Error", "error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const taksUpdateApi = createAsyncThunk<{ message: string }, ITasks>(
  "taksUpdateApi",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosClient.put(
        `${API_ENDPOINTS.TASKS.TASKS}/${data._id}`,
        data
      );
      return response.data as { message: string };
    } catch (error) {
      const errorMessage: string =
        (<IAxiosError>error)?.response?.data?.message ??
        (<IAxiosError>error).message ??
        "something want wrong";

      showToast("Error", "error", errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getTasksApi = createAsyncThunk<
  {
    data: { tasks: ITasks[] };
    message: string;
  },
  { projectId: string }
>("getTasksApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.TASKS.TASKS}${API_ENDPOINTS.PROJECTS.PROJECT}/${data.projectId}`
    );
    return response.data as {
      data: { tasks: ITasks[] };
      message: string;
    };
  } catch (error) {
    const errorMessage: string =
      (<IAxiosError>error)?.response?.data?.message ??
      (<IAxiosError>error).message ??
      "something want wrong";

    showToast("Error", "error", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateTaskStatusApi = createAsyncThunk<
  { message: string },
  { taskId: string; status: string }
>("updateTaskStatusApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch(
      `${API_ENDPOINTS.TASKS.TASKS}/status/${data.taskId}`,
      { status: data.status }
    );
    return response.data as { message: string };
  } catch (error) {
    const errorMessage: string =
      (<IAxiosError>error)?.response?.data?.message ??
      (<IAxiosError>error).message ??
      "something want wrong";

    showToast("Error", "error", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const initialState: ITasksState = {
  tasks: null,
  status: "idel",
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setIdelStatus(state) {
      state.status = "idel";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taksApi.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        taksApi.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.status = "succeeded";
          showToast("projectsApi", "success", action.payload.message);
        }
      )
      .addCase(taksApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });

    builder
      .addCase(
        getTasksApi.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: { tasks: ITasks[] };
            message: string;
          }>
        ) => {
          state.tasks = action.payload.data.tasks;
          showToast("getTasksApi", "success", action.payload.message);
        }
      )
      .addCase(getTasksApi.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });

    builder
      .addCase(
        updateTaskStatusApi.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          showToast("updateTaskStatusApi", "success", action.payload.message);
        }
      )
      .addCase(updateTaskStatusApi.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : "Updating task status failed";
      });
  },
});

export const selectTasksData = (state: IStoreRoot) => state.tasks;
export const { setIdelStatus } = tasksSlice.actions;

export default tasksSlice.reducer;
