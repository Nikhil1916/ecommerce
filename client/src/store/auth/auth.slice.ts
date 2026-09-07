import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated"
}

const initialState: AuthState = {
  user: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "authenticated";
    },

    clearUser: (state) => {
      state.user = null;
      state.status = "unauthenticated";
    },

    setAuthLoading: (state) => {
      state.status = "loading";
    }
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;