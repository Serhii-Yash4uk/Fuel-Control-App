import { createListCollection } from '@chakra-ui/react';

export const CONSTANTS = {
  CardName: 'Назва картки',

  CreateCard: 'Створити картку',
  EditCard: 'Редагувати картку',
  Save: 'Зберегти',
  Create: 'Створити',

  RequiredField: 'Поле обов’язкове',

  Close_Button_value: '✕',

  CARD_TYPE_SELECTION: createListCollection({
    items: [
      { value: 'FUEL', label: 'Заправка' },
      { value: 'SALE', label: 'Продаж' },
    ],
  }),
};
