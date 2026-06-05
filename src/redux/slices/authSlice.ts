import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: Record<string, unknown> | null;
  token: string | null;
  refreshToken: string | null;
  bootstrapped: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: Record<string, unknown>;
        token: string;
        refreshToken?: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.bootstrapped = true;
    },
    updateUser: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.user = { ...(state.user ?? {}), ...action.payload };
    },
    restoreSession: (
      state,
      action: PayloadAction<{
        user: Record<string, unknown>;
        token: string;
        refreshToken?: string;
      } | null>,
    ) => {
      state.bootstrapped = true;
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken ?? null;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.bootstrapped = true;
    },
  },
});

export const { loginSuccess, updateUser, restoreSession, logout } = authSlice.actions;
export default authSlice.reducer;
