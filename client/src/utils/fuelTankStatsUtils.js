export const calculateAmount = (liters, price) =>
  !isNaN(parseFloat(liters)) && !isNaN(parseFloat(price))
    ? parseFloat(liters) * parseFloat(price)
    : 0;

export const safeNumber = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

export const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getFuelTankStatsData = (stats) => {
  if (!stats || Object.keys(stats).length === 0) return [];

  const { tankCapacity, currentBalance, warningThreshold, averagePrice } =
    stats;

  return [
    {
      key: 'tankCapacity',
      label: 'Місткість',
      value:
        safeNumber(tankCapacity).toLocaleString('uk-UA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' л.',
    },
    {
      key: 'currentBalance',
      label: 'Поточний залишок',
      value:
        safeNumber(currentBalance).toLocaleString('uk-UA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' л.',
    },
    {
      key: 'warningThreshold',
      label: 'Поріг попередження',
      value: safeNumber(warningThreshold) + '%',
    },
    {
      key: 'averagePrice',
      label: 'Середня ціна',
      value:
        safeNumber(averagePrice).toLocaleString('uk-UA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' грн.',
    },
  ];
};
