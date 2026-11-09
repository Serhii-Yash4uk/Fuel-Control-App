import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import {
  fetchCarLimits,
  createCarLimitAsync,
  updateCarLimitAsync,
  deactivateCarLimitAsync,
  deleteCarLimitAsync,
  fetchDeactivatedCarLimits,
} from './thunk';

const carLimitsAdapter = createEntityAdapter();

const initialState = carLimitsAdapter.getInitialState({
  loading: false,
  error: null,
  deactivatedCarLimits: [],
});

const carLimitsSlice = createSlice({
  name: 'carLimits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarLimits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarLimits.fulfilled, (state, { payload }) => {
        state.loading = false;
        carLimitsAdapter.setAll(state, payload);
      })
      .addCase(fetchCarLimits.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(fetchDeactivatedCarLimits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeactivatedCarLimits.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.deactivatedCarLimits = payload;
      })
      .addCase(fetchDeactivatedCarLimits.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(createCarLimitAsync.fulfilled, (state, { payload }) => {
        carLimitsAdapter.addOne(state, payload);
      })
      .addCase(updateCarLimitAsync.fulfilled, (state, { payload }) => {
        carLimitsAdapter.updateOne(state, payload);
      })
      .addCase(deactivateCarLimitAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        carLimitsAdapter.removeOne(state, id);
        state.deactivatedCarLimits = state.deactivatedCarLimits.filter(
          (r) => r.id !== id
        );
      })
      .addCase(deleteCarLimitAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        carLimitsAdapter.removeOne(state, id);
        state.deactivatedCarLimits = state.deactivatedCarLimits.filter(
          (r) => r.id !== id
        );
      });
  },
});

export const { selectAll: selectAllCarLimits } = carLimitsAdapter.getSelectors(
  ({ carLimits }) => carLimits
);

export const selectDeactivatedCarLimits = ({ carLimits }) =>
  carLimits.deactivatedCarLimits;

export const selectCarLimitsLoading = ({ carLimits }) => carLimits.loading;
export const selectCarLimitsError = ({ carLimits }) => carLimits.error;

export const carLimitsReducer = carLimitsSlice.reducer;
