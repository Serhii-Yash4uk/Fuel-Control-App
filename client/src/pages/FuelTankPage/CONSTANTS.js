import { createListCollection } from '@chakra-ui/react';

export const CONSTANTS = {
  Barrel: 'Бочка',
  ChooseAMonth: 'Обрати місяць:',
  Edit: 'Редагувати',

  HEADER_ITEMS: [
    {
      key: 'dateTime',
      label: 'Дата',
      sortable: true,
    },
    {
      key: 'liters',
      label: 'Літри',
      isAddable: true,
      type: 'number',
    },
    {
      key: 'price',
      label: 'Ціна (грн/л)',
      editable: true,
      isAddable: true,
      type: 'number',
    },
    { key: 'amount', label: 'Сума (грн)', type: 'number' },
    {
      key: 'paymentMethod',
      label: 'Спосіб оплати',
      editable: true,
    },
    { key: 'paid', label: 'Оплачено', editable: true, type: 'text' },
    {
      key: 'note',
      label: 'Коментар',
      editable: true,
      isAddable: true,
      type: 'text',
    },
    {
      key: 'edited_by',
      label: 'Змінено',
      type: 'text',
    },
    {
      key: 'created_by',
      label: 'Створено',
      type: 'text',
    },
    { key: 'actions', label: 'Дії' },
  ],

  SELECTION_OPTIONS: {
    paymentMethod: createListCollection({
      items: [
        { value: 'cash', label: 'Готівка' },
        { value: 'card', label: 'Безготівка' },
      ],
    }),
    paid: createListCollection({
      items: [
        { value: 'Yes', label: 'Так' },
        { value: 'No', label: 'Ні' },
      ],
    }),
  },
};
