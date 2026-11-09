import { createListCollection } from '@chakra-ui/react';

export const CONSTANTS = {
  User: 'Користувач',
  Passwrod: 'Пароль',
  PasswordUnchanged: 'Залиште порожнім, щоб не змінювати',
  Role: 'Роль',
  UserName: "Ім'я користувача",

  Create: 'Створити',
  Save: 'Зберегти зміни',

  RequiredField: 'Поле обов’язкове',
  BiggerThenZeroErr: 'Значення повинно бути більше 0',

  Close_Button_value: '✕',
  EditUser: 'Редагувати користувача',
  CreateUser: 'Створити користувача',

  SELECTION_OPTIONS: createListCollection({
    items: [
      { value: 'fueler', label: 'Заправник' },
      { value: 'accountant', label: 'Бухгалтер' },
    ],
  }),
};
