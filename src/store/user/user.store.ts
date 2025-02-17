import { IUserApiFormateRes } from "@/@types/apiResponce.interface";
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

export const userApi = createAsyncThunk<IUserApiFormateRes>(
  "userApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.AUTH.USER);
      return response.data as IUserApiFormateRes;
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

export const sendInvitationApi = createAsyncThunk<
  { message: string },
  { email: string }
>("sendInvitationApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.INVATE, data);

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

export const acceptInvitationApi = createAsyncThunk<
  { message: string },
  { token: string }
>("acceptInvitationApi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.ACCEPT_INVATE,
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
});

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
      .addCase(
        userApi.fulfilled,
        (state, action: PayloadAction<IUserApiFormateRes>) => {
          state.userData = {
            data: {
              email: action.payload.data.user.email,
              name: action.payload.data.user.name,
              members: action.payload.data.user.members,
            },
            message: "",
          };
          if (action.payload?.message) {
            showToast("User", "success", action.payload.message);
          }
        }
      )
      .addCase(userApi.rejected, () => {
        showToast("User", "error", "somthing want wrong !");
      });

    builder
      .addCase(sendInvitationApi.fulfilled, (state, action: any) => {
        state.isLoading = false;
        showToast("User", "success", action.payload.message);
      })
      .addCase(sendInvitationApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendInvitationApi.rejected, (state) => {
        state.isLoading = false;
        showToast("User", "error", "somthing want wrong !");
      });

    builder
      .addCase(acceptInvitationApi.fulfilled, (state, action: any) => {
        state.isLoading = false;
        showToast("User", "success", action.payload.message);
      })
      .addCase(acceptInvitationApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptInvitationApi.rejected, (state) => {
        state.isLoading = false;
        showToast("User", "error", "somthing want wrong !");
      });
  },
});

export const selectUserData = (state: IStoreRoot) => state.user;

export const { setIdelStatus, setLoading } = userSlice.actions;

export default userSlice.reducer;
