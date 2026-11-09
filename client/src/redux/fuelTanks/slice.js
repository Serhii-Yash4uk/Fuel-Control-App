import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchAllFuelTanks,
  fetchAllFuelTanksWithConnected,
  fetchFuelTankStats,
  fetchDeactivatedFuelTanksReceipts,
  fetchFuelTanksReceipts,
  createReceiptAsync,
  updateReceiptAsync,
  deleteReceiptAsync,
  deactivateReceiptAsync,
} from './thunk';

import {
  safeNumber,
  calculateAmount,
  getKyivDateTime,
  getCurrentTimestamp,
} from '../../utils';

const fuelTanksAdapter = createEntityAdapter();

const initialState = fuelTanksAdapter.getInitialState({
  loading: false,
  statsLoading: false,
  error: null,
  fuelTanks: [],
  fuelTanksLoaded: false,
  fuelTanksWithConnected: [],
  receipts: [],
  deactivatedReceipts: [],
  stats: null,
  azsSelectionOptions: [],
});

const fuelTanksSlice = createSlice({
  name: 'fuelTanks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFuelTanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFuelTanks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.fuelTanksLoaded = true;
        state.fuelTanks = payload;
        state.azsSelectionOptions = [
          { value: 'all', label: 'Усі АЗС' },
          ...(Array.isArray(payload)
            ? payload.map(({ name }) => ({
                value: name,
                label: name,
              }))
            : []),
        ];
      })
      .addCase(fetchAllFuelTanks.rejected, (state, { payload }) => {
        state.loading = false;
        state.fuelTanksLoaded = true;
        state.error = payload;
      })

      .addCase(fetchAllFuelTanksWithConnected.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllFuelTanksWithConnected.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.fuelTanksWithConnected = payload;
        }
      )
      .addCase(
        fetchAllFuelTanksWithConnected.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      )

      .addCase(fetchFuelTanksReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuelTanksReceipts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.receipts = payload;
      })
      .addCase(fetchFuelTanksReceipts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(fetchDeactivatedFuelTanksReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDeactivatedFuelTanksReceipts.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.deactivatedReceipts = payload;
        }
      )
      .addCase(
        fetchDeactivatedFuelTanksReceipts.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      )

      .addCase(createReceiptAsync.fulfilled, (state, { payload }) => {
        const { liters, price } = payload;
        const timestamp = getCurrentTimestamp();
        state.receipts = [
          {
            ...payload,
            timestamp,
            dateTime: getKyivDateTime(timestamp),
            amount: calculateAmount(liters, price).toLocaleString('uk-UA'),
          },
          ...state.receipts,
        ];
      })
      .addCase(updateReceiptAsync.fulfilled, (state, { payload }) => {
        const { id, changes } = payload;
        const idx = state.receipts.findIndex((r) => r.id === id);
        if (idx !== -1) {
          const liters = changes.liters ?? state.receipts[idx].liters;
          const price = changes.price ?? state.receipts[idx].price;
          state.receipts[idx] = {
            ...state.receipts[idx],
            ...changes,
            amount: calculateAmount(liters, price).toLocaleString('uk-UA'),
          };
        }
      })
      .addCase(deleteReceiptAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        state.receipts = state.receipts.filter((r) => r.id !== id);
        state.deactivatedReceipts = state.deactivatedReceipts.filter(
          (r) => r.id !== id
        );
      })

      .addCase(deactivateReceiptAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        state.receipts = state.receipts.filter((r) => r.id !== id);
        state.deactivatedReceipts = state.deactivatedReceipts.filter(
          (r) => r.id !== id
        );
      })

      .addCase(fetchFuelTankStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchFuelTankStats.fulfilled, (state, { payload }) => {
        state.statsLoading = false;
        state.stats = payload;
      })
      .addCase(fetchFuelTankStats.rejected, (state, { payload }) => {
        state.statsLoading = false;
        state.error = payload;
      });
  },
});

export const selectAllReceipts = (state) => state.fuelTanks.receipts;
export const selectAllDeactivatedReceipts = (state) =>
  state.fuelTanks.deactivatedReceipts;

export const selectFuelTanksLoadingStatus = (state) => state.fuelTanks.loading;
export const selectFuelTankStatsLoadingStatus = (state) => state.fuelTanks.statsLoading;
export const selectFuelTanksErrorMessage = (state) => state.fuelTanks.error;

export const selectAllFuelTanks = (state) => state.fuelTanks.fuelTanks;
export const selectFuelTanksLoaded = (state) =>
  state.fuelTanks.fuelTanksLoaded;

export const selectAllFuelTanksWithConnected = (state) =>
  state.fuelTanks.fuelTanksWithConnected;

export const selectMainTankStats = createSelector(
  (state) => state.fuelTanks.stats?.mainTank,
  (mainTank) => {
    if (!mainTank) {
      return {
        tankName: 'АЗС',
        tankCapacity: 100,
        warningThreshold: 30,
        currentBalance: 50,
        fillPercentage: 50,
        averagePrice: 0,
      };
    }

    return {
      tankName: mainTank.tankName || '',
      tankCapacity: safeNumber(mainTank.tankCapacity),
      currentBalance: safeNumber(mainTank.currentBalance),
      fillPercentage: safeNumber(mainTank.fillPercentage),
      warningThreshold: safeNumber(mainTank.warningThreshold),
      averagePrice: safeNumber(mainTank.averagePrice),
    };
  }
);

export const selectConnectedTanksStats = createSelector(
  (state) => state.fuelTanks.stats?.connectedTanks,
  (connectedTanks) => {
    if (!connectedTanks || connectedTanks.length === 0) {
      return null;
    }

    return connectedTanks.map((tank) => ({
      id: tank.id,
      tankName: tank.tankName || '',
      tankCapacity: safeNumber(tank.tankCapacity),
      currentBalance: safeNumber(tank.currentBalance),
      fillPercentage: safeNumber(tank.fillPercentage),
      warningThreshold: safeNumber(tank.warningThreshold),
    }));
  }
);

export const selectAzsSelectionOptions = (state) =>
  state.fuelTanks.azsSelectionOptions;

export const fuelTanksReducer = fuelTanksSlice.reducer;
