import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateProfileAPI,
  changePasswordAPI,
  deleteAccountAPI,
} from "../api/authApi";

// Get token from local storage
const getToken = () => localStorage.getItem("token");

// ✅ Async Thunks
export const updateProfile = createAsyncThunk("user/update", async (data) => {
  const token = getToken();
  return await updateProfileAPI(data, token);
});

export const changePassword = createAsyncThunk("user/changePassword", async (data) => {
  const token = getToken();
  return await changePasswordAPI(data, token);
});

export const deleteAccount = createAsyncThunk("user/delete", async () => {
  const token = getToken();
  return await deleteAccountAPI(token);
});

// ✅ Initial State
const initialState = {
  user: {
    name: "",
    email: "",
    role: "",
    darkMode: false,
  },
  loading: false,
  error: null,
};

// ✅ Slice
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        state.user.role = action.payload.role;
        state.user.darkMode = action.payload.darkMode; // ✅ store darkMode
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = initialState.user;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
