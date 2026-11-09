export const CONSTANTS = {
  CarLimits: 'Ліміти легкових',
  ChooseAMonth: 'Обрати місяць:',
  AddNew: 'Додати запис',
  Create: 'Створити',

  HEADER_ITEMS: [
    {
      key: 'license_plate',
      label: 'Номерний знак',
      type: 'text',
      editable: true,
      required: true,
      isAddable: true,
    },
    {
      key: 'brand_model',
      label: 'Авто',
      type: 'text',
      editable: true,
      required: true,
      isAddable: true,
    },
    {
      key: 'limit_liters',
      label: 'Ліміт (л.)',
      type: 'number',
      editable: true,
      required: true,
      isAddable: true,
    },
    {
      key: 'filled',
      label: 'Заправлено (л.)',
      type: 'number',
    },
    { key: 'remains', label: 'Залишок (л.)', type: 'number' },
    { key: 'progress', label: 'Прогрес' },
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
};
