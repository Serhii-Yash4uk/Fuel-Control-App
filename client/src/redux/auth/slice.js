import { createSlice } from '@reduxjs/toolkit';
import { login } from './thunk';

const initialState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        localStorage.setItem('token', payload.token);
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const selectIsLoggedIn = ({ auth }) => !!auth.token;
export const selectAuthLoadingStatus = ({ auth }) => auth.loading;
export const selectAuthErrorMessage = ({ auth }) => auth.error;

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
