import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUsers,
  getUsersInfo,
  createUser,
  updateUser,
  deleteUser,
} from '../../utils';

export const getUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsers();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUsersInfoAsync = createAsyncThunk(
  'users/fetchUsersInfo',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsersInfo();
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message, logout: err.logout });
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async ({ password, ...payload }, { rejectWithValue }) => {
    try {
      const data = await createUser({ ...payload, password });
      return { ...payload, id: data.id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const data = await updateUser({ id, changes });
      const { password, ...safeChanges } = changes;
      return { id, changes: safeChanges, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteUser(id);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
