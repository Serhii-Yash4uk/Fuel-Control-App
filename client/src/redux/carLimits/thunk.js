import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getCarLimits,
  createCarLimit,
  updateCarLimit,
  deactivateCarLimit,
  deleteCarLimit,
  getKyivDateTime,
} from '../../utils';

export const fetchCarLimits = createAsyncThunk(
  'carLimits/fetchCarLimits',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await getCarLimits(startDate, endDate);

      return data
        .filter(({ is_active }) => is_active)
        .map(
          ({
            id,
            license_plate,
            brand_model,
            limit_liters,
            filled,
            edited_at,
            edited_by,
            created_by,
          }) => ({
            id: id,
            license_plate,
            brand_model,
            limit_liters: Number(limit_liters) || 0,
            filled: Number(filled) || 0,
            remains: 0,
            progress: '',
            edited_at: edited_at ? getKyivDateTime(edited_at) : '',
            edited_by: edited_by || '',
            created_by: created_by || '',
          })
        );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDeactivatedCarLimits = createAsyncThunk(
  'carLimits/fetchDeactivatedCarLimits',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCarLimits();

      return data
        .filter(({ is_active }) => !is_active)
        .map(
          ({
            id,
            license_plate,
            brand_model,
            limit_liters,
            edited_at,
            edited_by,
            created_by,
          }) => ({
            id: id,
            license_plate,
            brand_model,
            limit_liters: Number(limit_liters) || 0,
            edited_at: edited_at ? getKyivDateTime(edited_at) : '',
            edited_by: edited_by || '',
            created_by: created_by || '',
          })
        );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCarLimitAsync = createAsyncThunk(
  'carLimits/createCarLimit',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await createCarLimit(payload);
      return { ...payload, id: result.id, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCarLimitAsync = createAsyncThunk(
  'carLimits/updateCarLimit',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const result = await updateCarLimit({ id, changes });
      return { id, changes, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deactivateCarLimitAsync = createAsyncThunk(
  'carLimits/deactivateCarLimit',
  async ({ id }, { rejectWithValue }) => {
    try {
      const result = await deactivateCarLimit(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCarLimitAsync = createAsyncThunk(
  'carLimits/deleteCarLimit',
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteCarLimit(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
