import {
  selectAllUsers,
  getUsersAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  selectCards,
  fetchCardsAsync,
  createCardAsync,
  updateCardAsync,
  deleteCardAsync,
  selectAllDeactivatedReceipts,
  fetchDeactivatedFuelTanksReceipts,
  deleteReceiptAsync,
  deactivateReceiptAsync,
  selectDeactivatedFuelings,
  fetchDeactivatedFuelings,
  deleteFuelingAsync,
  deactivateFuelingAsync,
  selectDeactivatedCarLimits,
  createCarLimitAsync,
  fetchDeactivatedCarLimits,
  deleteCarLimitAsync,
  deactivateCarLimitAsync,
  selectAllFuelTanksWithConnected,
  fetchAllFuelTanksWithConnected,
  createMainFuelTankAsync,
  updateFuelTankAsync,
  deleteFuelTankAsync,
  createConnectedFuelTankAsync,
} from '../../redux';

import { LuUser, LuIdCard, LuFuel } from 'react-icons/lu';
import { MdSpeed, MdOutlineOilBarrel } from 'react-icons/md';

import { FaCalculator } from 'react-icons/fa';
import { RiAdminLine } from 'react-icons/ri';
import { GiFuelTank } from 'react-icons/gi';

export const CONSTANTS = {
  AdminPanelTitle: 'Адмінка',

  RoleColors: {
    admin: 'gray.800',
    accountant: 'gray.400',
    fueler: 'green.500',
  },

  RoleIcons: {
    admin: RiAdminLine,
    accountant: FaCalculator,
    fueler: LuFuel,
  },

  SKELETON_COUNTS: {
    users: 5,
    fuelTanks: 1,
    cards: 6,
    receipts: 2,
    fuelings: 2,
    limits: 2,
  },

  entityCreateButtonTypes: {
    users: 'Створити користувача',
    fuelTanks: 'Створити бочку',
    cards: 'Створити картку',
    limits: 'Створити ліміт',
  },

  adminEntities: {
    users: {
      type: 'users',
      label: 'Користувачі',
      headingText: 'Користувачі',
      emptyTitle: 'Немає доступних користувачів.',
      icon: LuUser,
      selector: selectAllUsers,
      fetch: getUsersAsync,
      create: createUserAsync,
      update: updateUserAsync,
      delete: deleteUserAsync,
      dialog: 'user',
      actions: ['edit', 'delete'],
    },

    fuelTanks: {
      type: 'fuelTanks',
      label: 'Бочки',
      headingText: 'Бочки',
      emptyTitle: 'Нема доступних бочок.',
      icon: GiFuelTank,
      selector: selectAllFuelTanksWithConnected,
      fetch: fetchAllFuelTanksWithConnected,
      createMain: createMainFuelTankAsync,
      createConnected: createConnectedFuelTankAsync,
      updateMain: updateFuelTankAsync,
      updateConnected: updateFuelTankAsync,
      delete: deleteFuelTankAsync,
      dialog: 'fuelTank',
      actions: ['edit', 'delete'],
    },

    cards: {
      type: 'cards',
      label: 'Картки',
      headingText: 'Картки',
      emptyTitle: 'Немає доступних карток.',
      icon: LuIdCard,
      iconColor: 'gray.500',
      selector: selectCards,
      fetch: fetchCardsAsync,
      create: createCardAsync,
      update: updateCardAsync,
      delete: deleteCardAsync,
      dialog: 'card',
      actions: ['edit', 'delete'],
    },

    limits: {
      type: 'limits',
      label: 'Ліміти',
      headingText: 'Деактивовані ліміти',
      emptyTitle: 'Деактивованих лімітів немає.',
      icon: MdSpeed,
      iconColor: 'gray.500',
      selector: selectDeactivatedCarLimits,
      fetch: fetchDeactivatedCarLimits,
      create: createCarLimitAsync,
      delete: deleteCarLimitAsync,
      activate: deactivateCarLimitAsync,
      actions: ['activate', 'delete'],
    },

    receipts: {
      type: 'receipts',
      label: 'Поповнення',
      headingText: 'Деактивовані поповнення',
      emptyTitle: 'Деактивованих поповнень немає.',
      icon: MdOutlineOilBarrel,
      iconColor: 'blue.500',
      selector: selectAllDeactivatedReceipts,
      fetch: fetchDeactivatedFuelTanksReceipts,
      delete: deleteReceiptAsync,
      activate: deactivateReceiptAsync,
      fields: [
        { label: 'Літри', value: (r) => r.liters },
        { label: 'Ціна', value: (r) => r.price },
        { label: 'Сума', value: (r) => r.amount },
        { label: 'АЗС', value: (r) => r.azs || '—' },
        { label: 'Спосіб оплати', value: (r) => r.paymentMethod || '—' },
        { label: 'Коментар', value: (r) => r.note || '—' },
      ],
      actions: ['activate', 'delete'],
    },

    fuelings: {
      type: 'fuelings',
      label: 'Заправки',
      headingText: 'Деактивовані заправки',
      emptyTitle: 'Деактивованих заправок немає.',
      icon: LuFuel,
      iconColor: 'gray.500',
      selector: selectDeactivatedFuelings,
      fetch: fetchDeactivatedFuelings,
      delete: deleteFuelingAsync,
      activate: deactivateFuelingAsync,
      fields: [
        { label: 'Водій', value: (f) => f.driver || '—' },
        { label: 'Літри', value: (f) => f.liters },
        { label: 'Сума', value: (f) => f.amount_uah },
        { label: 'АЗС', value: (f) => f.azs || '—' },
        { label: 'Коментар', value: (f) => f.comment || '—' },
      ],
      actions: ['activate', 'delete'],
    },
  },

  LIMITS_DIALOG_ITEMS: [
    {
      key: 'license_plate',
      label: 'Номерний знак',
      type: 'text',
      required: true,
    },
    {
      key: 'brand_model',
      label: 'Авто',
      type: 'text',
      required: true,
    },
    {
      key: 'limit_liters',
      label: 'Ліміт (л.)',
      type: 'number',
      editable: true,
      required: true,
    },
  ],
};
