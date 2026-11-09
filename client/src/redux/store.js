import { configureStore } from '@reduxjs/toolkit';

import { fuelTanksReducer } from './fuelTanks';
import { fuelingsReducer } from './fuelings';
import { accountingReportReducer } from './accountingReport';
import { carLimitsReducer } from './carLimits';
import { usersReducer } from './users';
import { authReducer } from './auth';

import { toastMiddleware } from './middlewares';

export const store = configureStore({
  reducer: {
    fuelTanks: fuelTanksReducer,
    fuelings: fuelingsReducer,
    accountingReport: accountingReportReducer,
    carLimits: carLimitsReducer,
    users: usersReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});
