export const CONSTANTS = {
  AllRefuels: 'Усі заправки',
  ChoosePeriod: 'Обрати період:',
  FilterByNumber: 'Пошук за карткою...',

  HEADER_ITEMS: [
    {
      key: 'dateTime',
      label: 'Дата',
      sortable: true,
    },
    { key: 'driver', label: 'Картка', editable: true },
    {
      key: 'liters',
      label: 'Літри',
      type: 'number',
    },
    { key: 'amount_uah', label: 'Сума (грн.)', editable: true, type: 'number' },
    { key: 'azs', label: 'Усі АЗС', selectable: true },
    { key: 'comment', label: 'Коментар', editable: true },
    {
      key: 'edited_by',
      label: 'Змінено',
      type: 'text',
    },
    { key: 'actions', label: 'Дії' },
  ],
};
