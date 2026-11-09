import { createAsyncThunk } from '@reduxjs/toolkit';

import { loginUser } from '../../utils';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ username, password });
      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
