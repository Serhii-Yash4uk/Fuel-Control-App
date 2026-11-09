import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getAllFuelTanks,
  getAllFuelTanksWithConnected,
  createMainFuelTank,
  updateFuelTank,
  deleteFuelTank,
  createConnectedFuelTank,
  getFuelTankStats,
  getFuelTanksReceipts,
  getAllDeactivatedFuelTanksReceipts,
  createFuelTanksReceipts,
  updateFuelTanksReceipts,
  deleteFuelTanksReceipts,
  deactivateFuelTanksReceipts,
  getKyivDateTime,
} from '../../utils';

export const fetchAllFuelTanks = createAsyncThunk(
  'fuelTanks/fetchAllFuelTanks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFuelTanks();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllFuelTanksWithConnected = createAsyncThunk(
  'fuelTanks/fetchAllFuelTanksWithConnected',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFuelTanksWithConnected();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createMainFuelTankAsync = createAsyncThunk(
  'fuelTanks/createMainFuelTank',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await createMainFuelTank(payload);
      return { ...payload, id: result.id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateFuelTankAsync = createAsyncThunk(
  'fuelTanks/updateFuelTank',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const result = await updateFuelTank({ id, changes });
      return { id, changes, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteFuelTankAsync = createAsyncThunk(
  'fuelTanks/deleteFuelTank',
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteFuelTank(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createConnectedFuelTankAsync = createAsyncThunk(
  'fuelTanks/createConnectedFuelTank',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await createConnectedFuelTank(payload);
      return { ...payload, id: result.id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchFuelTankStats = createAsyncThunk(
  'fuelTanks/fetchFuelTankStats',
  async ({ tankId = 1 } = {}, { rejectWithValue }) => {
    try {
      const data = await getFuelTankStats(tankId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchFuelTanksReceipts = createAsyncThunk(
  'fuelTanks/fetchReceipts',
  async ({ tankId = 1 } = {}, { rejectWithValue }) => {
    try {
      const data = await getFuelTanksReceipts(tankId);

      return data
        .filter(({ is_active }) => is_active)
        .map(
          ({
            id,
            liters,
            price_per_liter,
            payment_method,
            paid,
            note,
            timestamp,
            edited_at,
            edited_by,
            created_by,
          }) => ({
            id,
            dateTime: getKyivDateTime(timestamp),
            liters: liters || '',
            price: price_per_liter || 0,
            amount:
              liters && price_per_liter
                ? (liters * price_per_liter).toLocaleString('uk-UA')
                : 0,
            paymentMethod: payment_method || '',
            paid: paid ? 'Так' : 'Ні',
            note: note || '',
            timestamp,
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

export const fetchDeactivatedFuelTanksReceipts = createAsyncThunk(
  'fuelTanks/fetchDeactivatedReceipts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllDeactivatedFuelTanksReceipts();

      return data.map(
        ({
          id,
          azs_name,
          liters,
          price_per_liter,
          payment_method,
          paid,
          note,
          timestamp,
          edited_at,
          edited_by,
          created_by,
        }) => ({
          id,
          azs: azs_name || '',
          dateTime: getKyivDateTime(timestamp),
          timestamp,
          liters: liters || '',
          price: price_per_liter || 0,
          amount:
            liters && price_per_liter
              ? (liters * price_per_liter).toLocaleString('uk-UA')
              : 0,
          paymentMethod: payment_method || '',
          paid: paid ? 'Так' : 'Ні',
          note: note || '',
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

export const createReceiptAsync = createAsyncThunk(
  'fuelTanks/createReceipt',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await createFuelTanksReceipts(payload);
      return { ...payload, id: result.id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateReceiptAsync = createAsyncThunk(
  'fuelTanks/updateReceipt',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const result = await updateFuelTanksReceipts({ id, changes });
      return { id, changes, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deactivateReceiptAsync = createAsyncThunk(
  'fuelTanks/deactivate',
  async ({ id }, { rejectWithValue }) => {
    try {
      const result = await deactivateFuelTanksReceipts(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteReceiptAsync = createAsyncThunk(
  'fuelTanks/deleteReceipt',
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteFuelTanksReceipts(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
