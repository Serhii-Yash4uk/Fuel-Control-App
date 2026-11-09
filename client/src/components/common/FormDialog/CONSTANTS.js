export const CONSTANTS = {
  Cancel: 'Скасувати',
  Save: 'Зберегти',
  RequiredField: 'Поле обов’язкове',
  BiggerThenZeroErr: 'Значення повинно бути більше 0',

  RequiredKeys: ['license_plate', 'limit_liters', 'liters'],

  regex: new RegExp(
    `^(` +
      `['ABCEHIKMOPTX']{2}\\d{4}['ABCEHIKMOPTX']{2}|` +
      `['ABCEHIKMOPTX']{2}\\d{4}['ABCEHIKMOPTX']|` +
      `\\d{4}['ABCEHIKMOPTX']{2}|` +
      `(DP|CD)\\d{6}|` +
      `TP\\d{4}|` +
      `(?!['ABCEHIKMOPTX']{2}\\d{4}['ABCEHIKMOPTX']{2})(?=.*[A-Z])[A-Z0-9]{3,8}` +
      `)$`
  ),
};
