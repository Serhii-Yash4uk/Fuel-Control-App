export const API = {
  BASE_URL: process.env.CLIENT_API_URL || 'http://localhost:3001/api',

  FUEL_TANKS: '/fuel-tanks',
  FUEL_TANKS_WITH_CONNECTED: '/fuel-tanks/with-connected',
  MAIN_TANKS: '/fuel-tanks/main',
  CONNECTED_TANKS: '/fuel-tanks/connected',
  STATS: '/stats',

  RECEIPTS: '/receipts',
  DEACTIVATED_RECEIPTS: '/deactivated-receipts',

  FUELINGS: '/fuelings',
  ACCONTING_REPORT: '/accountingReport',

  LIMITS: '/car-limits',

  CARDS: '/cards',
};
