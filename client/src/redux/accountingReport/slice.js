import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchAccountingReport } from './thunk';

import { selectSaleCardNames } from '../fuelings/slice';

const accountingReportAdapter = createEntityAdapter();

const initialState = accountingReportAdapter.getInitialState({
  loading: false,
  error: null,
});

const accountingReportSlice = createSlice({
  name: 'accountingReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountingReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountingReport.fulfilled, (state, { payload }) => {
        state.loading = false;
        accountingReportAdapter.setAll(state, payload);
      })
      .addCase(fetchAccountingReport.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { selectAll: selectAllAccountingReport } =
  accountingReportAdapter.getSelectors(
    ({ accountingReport }) => accountingReport
  );

export const selectAccountingReportLoadingStatus = ({ accountingReport }) =>
  accountingReport.loading;
export const selectAccountingReportErrorMessage = ({ accountingReport }) =>
  accountingReport.error;

export const selectSortedForPrint = createSelector(
  [selectAllAccountingReport, selectSaleCardNames],
  (data, saleCardNames) => {
    const getPriority = (driver) => {
      const idx = saleCardNames.indexOf(driver);
      return idx !== -1 ? idx : 99;
    };

    return [...data].sort(
      (a, b) => getPriority(a.driver) - getPriority(b.driver)
    );
  }
);

export const accountingReportReducer = accountingReportSlice.reducer;
