import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getKyivDateTimeFromGMTMinusTwo,
  getKyivDateTime,
  getFuelings,
  updateFueling,
  deactivateFueling,
  deleteFueling,
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from '../../utils';

export const fetchFuelings = createAsyncThunk(
  'fuelings/fetchFuelings',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const data = await getFuelings(startDate, endDate);

      return data
        .filter(({ is_active }) => is_active)
        .map(
          ({
            id,
            event_timestamp,
            driver,
            liters,
            azs_name,
            amount_uah,
            comment,
            is_active,
            edited_at,
            edited_by,
          }) => ({
            id: id,
            dateTime: event_timestamp
              ? getKyivDateTimeFromGMTMinusTwo(event_timestamp)
              : '',
            driver: driver,
            liters: liters,
            azs: azs_name || '',
            amount_uah,
            comment,
            is_active,
            timestamp: event_timestamp,
            edited_at: edited_at ? getKyivDateTime(edited_at) : '',
            edited_by: edited_by || '',
          })
        );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDeactivatedFuelings = createAsyncThunk(
  'fuelings/fetchDeactivatedFuelings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFuelings();

      return data
        .filter(({ is_active }) => !is_active)
        .map(
          ({
            id,
            event_timestamp,
            driver,
            liters,
            azs_name,
            amount_uah,
            comment,
            is_active,
            edited_at,
            edited_by,
          }) => ({
            id: id,
            dateTime: event_timestamp
              ? getKyivDateTimeFromGMTMinusTwo(event_timestamp)
              : '',
            timestamp: event_timestamp,
            driver: driver,
            liters: liters,
            azs: azs_name || '',
            amount_uah,
            comment,
            is_active,
            edited_at: edited_at ? getKyivDateTime(edited_at) : '',
            edited_by: edited_by || '',
          })
        );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateFuelingAsync = createAsyncThunk(
  'fuelings/updateFueling',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const result = await updateFueling({ id, changes });
      return { id, changes, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deactivateFuelingAsync = createAsyncThunk(
  'fuelTanks/deactivateFueling',
  async ({ id }, { rejectWithValue }) => {
    try {
      const result = await deactivateFueling(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteFuelingAsync = createAsyncThunk(
  'fuelTanks/deleteFueling',
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteFueling(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchCardsAsync = createAsyncThunk(
  'fuelings/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCards();
      return data.map(({ id, cardName, type, edited_at, edited_by }) => ({
        id,
        cardName,
        type,
        edited_at: edited_at ? getKyivDateTime(edited_at) : '',
        edited_by: edited_by || '',
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCardAsync = createAsyncThunk(
  'fuelings/createCard',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await createCard(payload);
      return { ...payload, id: result.id, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCardAsync = createAsyncThunk(
  'fuelings/updateCard',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const result = await updateCard({ id, changes });
      return { id, changes, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCardAsync = createAsyncThunk(
  'fuelings/deleteCard',
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteCard(id);
      return { id, message: result.message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
