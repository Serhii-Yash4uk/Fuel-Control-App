import { toaster } from '../../components';

import {
  createReceiptAsync,
  updateReceiptAsync,
  deleteReceiptAsync,
  deactivateReceiptAsync,
  createCarLimitAsync,
  updateCarLimitAsync,
  deactivateCarLimitAsync,
  deleteCarLimitAsync,
  updateFuelingAsync,
  deleteFuelingAsync,
  deactivateFuelingAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  createCardAsync,
  updateCardAsync,
  deleteCardAsync,
  updateFuelTankAsync,
  createMainFuelTankAsync,
  deleteFuelTankAsync,
  createConnectedFuelTankAsync,
} from '..';

const toastMessages = {
  [createReceiptAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис додано',
    type: 'success',
  },
  [createReceiptAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося додати запис',
    type: 'error',
  },
  [updateReceiptAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис оновлено',
    type: 'success',
  },
  [updateReceiptAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити запис',
    type: 'error',
  },
  [deleteReceiptAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис видалено',
    type: 'success',
  },
  [deleteReceiptAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити запис',
    type: 'error',
  },
  [deactivateReceiptAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис деактивовано',
    type: 'success',
  },
  [deactivateReceiptAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося деактивувати запис',
    type: 'error',
  },
  [createCarLimitAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Ліміт створено',
    type: 'success',
  },
  [createCarLimitAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося створити ліміт',
    type: 'error',
  },
  [updateCarLimitAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Ліміт оновлено',
    type: 'success',
  },
  [updateCarLimitAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити ліміт',
    type: 'error',
  },
  [deactivateCarLimitAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Ліміт деактивовано',
    type: 'success',
  },
  [deactivateCarLimitAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося деактивувати ліміт',
    type: 'error',
  },
  [deleteCarLimitAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Ліміт видалено',
    type: 'success',
  },
  [deleteCarLimitAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити ліміт',
    type: 'error',
  },
  [updateFuelingAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис оновлено',
    type: 'success',
  },
  [updateFuelingAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити запис',
    type: 'error',
  },
  [deleteFuelingAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис видалено',
    type: 'success',
  },
  [deleteFuelingAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити запис',
    type: 'error',
  },
  [deactivateFuelingAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Запис деактивовано',
    type: 'success',
  },
  [deactivateFuelingAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося деактивувати запис',
    type: 'error',
  },
  [createUserAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Користувач створено',
    type: 'success',
  },
  [createUserAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося створити користувача',
    type: 'error',
  },
  [updateUserAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Користувач оновлено',
    type: 'success',
  },
  [updateUserAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити користувача',
    type: 'error',
  },
  [deleteUserAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Користувач видалено',
    type: 'success',
  },
  [deleteUserAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити користувача',
    type: 'error',
  },
  [createCardAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Картку створено',
    type: 'success',
  },
  [createCardAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося створити картку',
    type: 'error',
  },
  [updateCardAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Картку оновлено',
    type: 'success',
  },
  [updateCardAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити картку',
    type: 'error',
  },
  [deleteCardAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Картку видалено',
    type: 'success',
  },
  [deleteCardAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити картку',
    type: 'error',
  },
  [updateFuelTankAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Бочку оновлено',
    type: 'success',
  },
  [updateFuelTankAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося оновити бочку',
    type: 'error',
  },
  [createMainFuelTankAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Бочку створено',
    type: 'success',
  },
  [createMainFuelTankAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося створити бочку',
    type: 'error',
  },
  [deleteFuelTankAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Бочку видалено',
    type: 'success',
  },
  [deleteFuelTankAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося видалити бочку',
    type: 'error',
  },
  [createConnectedFuelTankAsync.fulfilled.type]: {
    title: 'Успіх',
    default: 'Підключену бочку створено',
    type: 'success',
  },
  [createConnectedFuelTankAsync.rejected.type]: {
    title: 'Помилка',
    default: 'Не вдалося створити бочку для підключення',
    type: 'error',
  },
};

export const toastMiddleware = () => (next) => (action) => {
  const config = toastMessages[action.type];

  if (config) {
    const description =
      action.payload?.message || action.payload?.error || config.default;

    toaster.create({
      title: config.title,
      description,
      type: config.type,
    });
  }

  return next(action);
};
