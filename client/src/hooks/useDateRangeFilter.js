import { useState, useCallback } from 'react';

const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return [start, end];
};

export const useDateRangeFilter = (setCurrentPage = () => {}) => {
  const [dateRange, setDateRange] = useState(getCurrentMonthRange);

  const resetDateFilter = useCallback(() => {
    setDateRange([null, null]);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const setDefaultDateFilter = useCallback(() => {
    setDateRange(getCurrentMonthRange());
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handleDateChange = useCallback(
    (dates) => {
      if (!dates || dates.every((d) => d === null)) {
        resetDateFilter();
        return;
      }

      let [start, end] = dates;

      if (start && !end) {
        setDateRange([start, null]);
        return;
      }

      if (start && end) {
        if (start.toDateString() === end.toDateString()) {
          end = new Date(end);
          end.setHours(23, 59, 59, 999);
        }
        setDateRange([start, end]);
        setCurrentPage(1);
      }
    },
    [resetDateFilter, setCurrentPage]
  );

  return {
    dateRange,
    handleDateChange,
    resetDateFilter,
    setDefaultDateFilter,
  };
};
