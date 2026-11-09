import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getKyivDateTimeFromGMTMinusTwo,
  getAccountingReport,
} from '../../utils';

export const fetchAccountingReport = createAsyncThunk(
  'accountingReport/fetchAccountingReport',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await getAccountingReport(startDate, endDate);
      return data.map(
        ({
          id,
          event_timestamp,
          driver,
          liters,
          azs_name,
          amount_uah,
          comment,
          is_active,
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
        })
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
