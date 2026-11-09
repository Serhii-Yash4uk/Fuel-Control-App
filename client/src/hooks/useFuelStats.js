import { useMemo } from 'react';

import {
  FaGasPump,
  FaMoneyBillWave,
  FaBalanceScale,
  FaListOl,
} from 'react-icons/fa';
import { MdRemoveCircleOutline } from 'react-icons/md';
import { TbSum } from 'react-icons/tb';

export const useFuelStats = (data = [], saleCardNames = []) => {
  const writeOffStats = useMemo(() => {
    const saleItems = data.filter(({ driver }) =>
      saleCardNames.includes(driver)
    );
    const saleLiters = saleItems.reduce(
      (sum, { liters }) => sum + (Number(liters) || 0),
      0
    );
    const totalLiters = data.reduce(
      (sum, { liters }) => sum + (Number(liters) || 0),
      0
    );
    const writeOffLiters = totalLiters - saleLiters;

    return [
      {
        icon: MdRemoveCircleOutline,
        label: 'Всього до списання',
        value:
          writeOffLiters.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) +
          ' л.',
        highlight: false,
      },
      {
        icon: TbSum,
        label: 'Загальна кількість дизеля',
        value:
          totalLiters.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) +
          ' л.',
        highlight: true,
      },
    ];
  }, [data, saleCardNames]);

  const dieselSaleStats = useMemo(() => {
    const saleItems = data.filter(({ driver }) =>
      saleCardNames.includes(driver)
    );

    const validSaleItems = saleItems.filter(
      ({ amount_uah }) => Number(amount_uah) >= 1
    );

    const saleLiters = saleItems.reduce(
      (sum, { liters }) => sum + (Number(liters) || 0),
      0
    );

    const saleAmount = validSaleItems.reduce(
      (sum, { amount_uah }) => sum + (Number(amount_uah) || 0),
      0
    );

    const validSaleLiters = validSaleItems.reduce(
      (sum, { liters }) => sum + (Number(liters) || 0),
      0
    );

    const saleCount = saleItems.length;
    const averagePrice = validSaleLiters ? saleAmount / validSaleLiters : 0;

    return [
      {
        icon: FaGasPump,
        label: 'Продано',
        value:
          saleLiters.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) +
          ' л.',
      },
      {
        icon: FaMoneyBillWave,
        label: 'Виручка',
        value:
          saleAmount.toLocaleString('uk-UA', { minimumFractionDigits: 2 }) +
          ' грн.',
      },
      {
        icon: FaBalanceScale,
        label: 'Середня ціна',
        value: averagePrice
          ? averagePrice.toLocaleString('uk-UA', { maximumFractionDigits: 2 }) +
            ' грн.'
          : '0 грн.',
      },
      {
        icon: FaListOl,
        label: 'Кількість продажів',
        value: saleCount.toLocaleString('uk-UA'),
      },
    ];
  }, [data, saleCardNames]);

  return { writeOffStats, dieselSaleStats };
};
