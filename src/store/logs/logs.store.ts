import { ITaskLogsFormateRes } from "@/@types/apiResponce.interface";
import { IAxiosError } from "@/@types/globle.interface";
import { IStoreRoot, ITasksLogsState } from "@/@types/store.interface";
import showToast from "@/components/ui/Toasters";
import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import axiosClient from "@/utils/axios.utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getTaskLogsApi = createAsyncThunk<
  ITaskLogsFormateRes,
  { taskId: string }
>("getTaskLogsApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.TASK_LOGS}/${data.taskId}`
    );
    return response.data as ITaskLogsFormateRes;
  } catch (error) {
    const errorMessage: string =
      (<IAxiosError>error)?.response?.data?.message ??
      (<IAxiosError>error).message ??
      "something want wrong";

    showToast("Error", "error", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const initialState: ITasksLogsState = {
  logs: null,
  status: "idel",
  error: null,
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setIdelStatus(state) {
      state.status = "idel";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getTaskLogsApi.fulfilled,
        (state, action: PayloadAction<ITaskLogsFormateRes>) => {
          state.logs = action.payload.data.taskLogs;
          if (action.payload?.message) {
            showToast("getTaskLogsApi", "success", action.payload.message);
          }
        }
      )
      .addCase(getTaskLogsApi.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });
  },
});

export const logsData = (state: IStoreRoot) => state.logs;

export default logsSlice.reducer;
