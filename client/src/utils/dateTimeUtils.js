export const formatDateForAccounting = (date) => {
  if (!date) return '';

  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  });
};

export const getCurrentTimestamp = () =>
  Math.floor(new Date().getTime() / 1000);

export const getKyivDateTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp * 1000);

  const datePart = date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Kyiv',
  });

  const timePart = date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Kyiv',
  });

  return `${datePart} ${timePart}`;
};

export const getKyivDateTimeFromGMTMinusTwo = (timestamp) => {
  if (!timestamp) return '';

  const utcTimestamp = (timestamp + 2 * 60 * 60) * 1000;

  const date = new Date(utcTimestamp);

  const datePart = date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Kyiv',
  });

  const timePart = date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Kyiv',
  });

  return `${datePart} ${timePart}`;
};

export const getDateRangeTimestamp = (start, end) => {
  const startTimestamp = Math.floor(new Date(start).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(end).getTime() / 1000);

  return [startTimestamp, endTimestamp];
};

export const getMonthTimestamps = (date) => {
  const startOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0
  );
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const startTimestamp = Math.floor(startOfMonth.getTime() / 1000);
  const endTimestamp = Math.floor(endOfMonth.getTime() / 1000);

  return [startTimestamp, endTimestamp];
};
