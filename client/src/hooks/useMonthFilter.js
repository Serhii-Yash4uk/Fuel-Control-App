import { useState, useMemo } from 'react';
import { getMonthTimestamps } from '../utils';

export const useMonthFilter = (
  dataOrSetPage,
  setCurrentPage,
  initialMonth = null
) => {
  const isDataArray = Array.isArray(dataOrSetPage);
  const data = isDataArray ? dataOrSetPage : undefined;
  const setPage = isDataArray ? setCurrentPage : dataOrSetPage;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const [startTimestamp, endTimestamp] = useMemo(() => {
    if (!selectedMonth) return [null, null];

    return getMonthTimestamps(selectedMonth);
  }, [selectedMonth]);

  const filteredData = useMemo(() => {
    if (!isDataArray || !selectedMonth) return data;

    return data.filter(
      ({ timestamp }) =>
        timestamp >= startTimestamp && timestamp <= endTimestamp
    );
  }, [data, selectedMonth, startTimestamp, endTimestamp, isDataArray]);

  const handleChange = (date) => {
    setSelectedMonth(date || (initialMonth ?? null));
    setPage && setPage(1);
  };

  const resetFilters = () => {
    setSelectedMonth(initialMonth ?? null);
  };

  return isDataArray
    ? {
        filteredData,
        selectedMonth,
        handleChange,
        resetFilters,
        startTimestamp,
        endTimestamp,
      }
    : {
        selectedMonth,
        handleChange,
        resetFilters,
        startTimestamp,
        endTimestamp,
      };
};
