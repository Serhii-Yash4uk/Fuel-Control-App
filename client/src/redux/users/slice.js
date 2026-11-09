import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import {
  getUsersAsync,
  getUsersInfoAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
} from './thunk';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  user: null,
  loading: false,
  error: null,
  initialized: false,
  logout: false,
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        usersAdapter.setAll(state, payload);
      })
      .addCase(getUsersAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(getUsersInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.logout = false;
      })
      .addCase(getUsersInfoAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.initialized = true;
        state.logout = false;
      })
      .addCase(getUsersInfoAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
        state.error = payload?.message || '';
        state.logout = payload?.logout;
      })

      .addCase(createUserAsync.fulfilled, (state, { payload }) => {
        usersAdapter.addOne(state, payload);
      })

      .addCase(updateUserAsync.fulfilled, (state, { payload }) => {
        usersAdapter.updateOne(state, payload);
      })

      .addCase(deleteUserAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        usersAdapter.removeOne(state, id);
      });
  },
});

export const { selectAll: selectAllUsers } = usersAdapter.getSelectors(
  ({ users }) => users
);

export const selectUser = (state) => state.users.user;

export const selectUsersLoadingStatus = ({ users }) => users.loading;
export const selectUsersErrorMessage = ({ users }) => users.error;
export const selectInitializedUser = ({ users }) => users.initialized;
export const selectLogout = ({ users }) => users.logout;

export const usersReducer = usersSlice.reducer;
