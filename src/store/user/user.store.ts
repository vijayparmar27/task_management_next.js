import { IAxiosError } from "@/@types/globle.interface";
import { IStoreRoot, User, UserState } from "@/@types/store.interface";
import showToast from "@/components/ui/Toasters";
import { API_ENDPOINTS } from "@/constants/apiEndPoints";
import axiosClient from "@/utils/axios.utils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const initialState: UserState = {
  userData: null,
  status: "idel",
  error: null,
  isDisabledNavbar: false,
  isLoading: false,
};

export const registerApi = createAsyncThunk<
  User,
  RegisterData,
  { rejectValue: string }
>("registerApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.SIGN_UP, data);
    return response.data as User;
  } catch (error) {
    const errorMessage: string =
      (<IAxiosError>error)?.response?.data?.message ??
      (<IAxiosError>error).message ??
      "something want wrong";

    showToast("Error", "error", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const userApi = createAsyncThunk<User>(
  "userApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.AUTH.USER);
      return response.data as User;
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

export const loginApi = createAsyncThunk<User, LoginData>(
  "signupApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      if (response.data.data.token) {
        Cookies.set(`token`, response.data.data.token, {
          path: "/",
          expires: 1 / 2,
        });
      }
      return response.data as User;
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIdelStatus(state) {
      state.status = "idel";
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerApi.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.status = "succeeded";
          showToast("registerApi", "success", action.payload.message);
        }
      )
      .addCase(registerApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? String(action.payload)
          : "Registration failed";
      });
    builder
      .addCase(loginApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        showToast("Login Success", "success", action.payload.message);
      })
      .addCase(loginApi.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? String(action.payload) : "SignIn failed";
        showToast("User", "error", "somthing want wrong !");
      });
    builder
      .addCase(userApi.fulfilled, (state, action: any) => {
        state.userData = { data: action.payload.data.user, message: "" };
        showToast("User", "success", action.payload.message);
      })
      .addCase(userApi.rejected, () => {
        showToast("User", "error", "somthing want wrong !");
      });
  },
});

export const selectUserData = (state: IStoreRoot) => state.user;

export const { setIdelStatus, setLoading } = userSlice.actions;

export default userSlice.reducer;
