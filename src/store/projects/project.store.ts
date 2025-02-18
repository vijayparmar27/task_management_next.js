import { IProjectsReq } from "@/@types/apiRequest.interface";
import { IAxiosError } from "@/@types/globle.interface";
import {
  IProjects,
  IProjectsState,
  IStoreRoot,
} from "@/@types/store.interface";
import showToast from "@/components/ui/Toasters";
import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import axiosClient from "@/utils/axios.utils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setLoading } from "../user/user.store";
import { store } from "..";
import { IProjectsFormateRes } from "@/@types/apiResponce.interface";

export const projectsApi = createAsyncThunk<{ message: string }, IProjectsReq>(
  "projectsApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        API_ENDPOINTS.PROJECTS.PROJECTS,
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
    }
  }
);

export const getProjectsApi = createAsyncThunk<IProjectsFormateRes, void>(
  "getProjectsApi",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get(API_ENDPOINTS.PROJECTS.PROJECTS);
      return response.data as IProjectsFormateRes;
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

const initialState: IProjectsState = {
  projects: null,
  status: "idel",
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setIdelStatus(state) {
      state.status = "idel";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(projectsApi.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        projectsApi.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.status = "succeeded";
          showToast("projectsApi", "success", action.payload.message);
        }
      )
      .addCase(projectsApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });

    builder
      .addCase(
        getProjectsApi.fulfilled,
        (state, action: PayloadAction<IProjectsFormateRes>) => {
          state.projects = action.payload.data.projects;
          if (action.payload?.message) {
            showToast("projectsApi", "success", action.payload.message);
          }
        }
      )
      .addCase(getProjectsApi.rejected, (state, action) => {
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });
  },
});

export const selectProjectsData = (state: IStoreRoot) => state.projects;
export const { setIdelStatus } = projectsSlice.actions;

export default projectsSlice.reducer;
