import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchFuelings,
  fetchDeactivatedFuelings,
  updateFuelingAsync,
  deactivateFuelingAsync,
  deleteFuelingAsync,
  fetchCardsAsync,
  createCardAsync,
  updateCardAsync,
  deleteCardAsync,
} from './thunk';

const fuelingsAdapter = createEntityAdapter();

const initialState = fuelingsAdapter.getInitialState({
  loading: false,
  cardsLoading: false,
  error: null,
  cards: [],
  deactivatedFuelings: [],
});

const fuelingsSlice = createSlice({
  name: 'fuelings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuelings.fulfilled, (state, { payload }) => {
        state.loading = false;
        fuelingsAdapter.setAll(state, payload);
      })
      .addCase(fetchFuelings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(fetchDeactivatedFuelings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeactivatedFuelings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.deactivatedFuelings = payload;
      })
      .addCase(fetchDeactivatedFuelings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(updateFuelingAsync.fulfilled, (state, { payload }) => {
        fuelingsAdapter.updateOne(state, payload);
      })

      .addCase(deleteFuelingAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        fuelingsAdapter.removeOne(state, id);
        state.deactivatedFuelings = state.deactivatedFuelings.filter(
          (r) => r.id !== id
        );
      })

      .addCase(deactivateFuelingAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        fuelingsAdapter.removeOne(state, id);
        state.deactivatedFuelings = state.deactivatedFuelings.filter(
          (r) => r.id !== id
        );
      })

      .addCase(fetchCardsAsync.pending, (state) => {
        state.cardsLoading = true;
        state.error = null;
      })
      .addCase(fetchCardsAsync.fulfilled, (state, { payload }) => {
        state.cardsLoading = false;
        state.cards = payload;
      })
      .addCase(fetchCardsAsync.rejected, (state, { payload }) => {
        state.cardsLoading = false;
        state.error = payload;
      })

      .addCase(createCardAsync.fulfilled, (state, { payload }) => {
        state.cards = [
          {
            ...payload,
            cardName: payload.cardName,
          },
          ...state.cards,
        ];
      })

      .addCase(updateCardAsync.fulfilled, (state, { payload }) => {
        const { id, changes } = payload;
        const idx = state.cards.findIndex((c) => c.id === id);
        if (idx !== -1) {
          state.cards[idx] = { ...state.cards[idx], ...changes };
        }
      })

      .addCase(deleteCardAsync.fulfilled, (state, { payload }) => {
        const { id } = payload;
        state.cards = state.cards.filter((c) => c.id !== id);
      });
  },
});

export const { selectAll: selectAllFuelings } = fuelingsAdapter.getSelectors(
  ({ fuelings }) => fuelings
);

export const selectCards = (state) => state.fuelings.cards;
export const selectCardsLoadingStatus = ({ fuelings }) => fuelings.cardsLoading;

export const selectSaleCardNames = createSelector([selectCards], (cards) =>
  cards.filter((card) => card.type === 'SALE').map(({ cardName }) => cardName)
);

export const selectSaleFuelings = createSelector(
  [selectAllFuelings, selectSaleCardNames],
  (fuelings, saleCardNames) =>
    fuelings.filter(
      ({ driver, amount_uah }) =>
        (saleCardNames.includes(driver) && amount_uah < 0.01) || !driver
    )
);

export const selectDeactivatedFuelings = ({ fuelings }) =>
  fuelings.deactivatedFuelings;
export const selectFuelingsLoadingStatus = ({ fuelings }) => fuelings.loading;
export const selectFuelingsErrorMessage = ({ fuelings }) => fuelings.error;

export const fuelingsReducer = fuelingsSlice.reducer;
