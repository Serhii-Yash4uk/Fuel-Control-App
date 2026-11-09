import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Flex,
  Heading,
  Button,
} from '@chakra-ui/react';
import { LuPrinter } from 'react-icons/lu';

import {
  selectCards,
  fetchCardsAsync,
  selectSaleCardNames,
  fetchAccountingReport,
  selectAllAccountingReport,
  selectSortedForPrint,
  selectCardsLoadingStatus,
  selectAccountingReportLoadingStatus,
  selectAccountingReportErrorMessage,
  selectFuelTanksErrorMessage,
  selectUser,
  selectUsersErrorMessage,
  selectInitializedUser,
} from '../../redux';

import {
  DataGrid,
  CustomDatePicker,
  StatsCard,
  PeriodDisplay,
  ErrorAlert,
  StatsCardsSkeletonRow,
} from '../../components';

import { useDateRangeFilter, useFuelStats, usePrint } from '../../hooks';

import { getDateRangeTimestamp, hasRole } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

import './AccountingReportPage.css';

export const AccountingReportPage = () => {
  const dispatch = useDispatch();

  const accountingReport = useSelector(selectAllAccountingReport);
  const sortedForPrint = useSelector(selectSortedForPrint);
  const fuelingsLoading = useSelector(selectAccountingReportLoadingStatus);
  const cardsLoading = useSelector(selectCardsLoadingStatus);
  const error = useSelector(selectAccountingReportErrorMessage);
  const fuelTankErr = useSelector(selectFuelTanksErrorMessage);

  const user = useSelector(selectUser);
  const role = user?.role;
  const initializedUser = useSelector(selectInitializedUser);
  const userError = useSelector(selectUsersErrorMessage);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isPeriodDisplay, setIsPeriodDisplay] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const { dateRange, handleDateChange } = useDateRangeFilter(setCurrentPage);

  const saleCardNames = useSelector(selectSaleCardNames);
  const cards = useSelector(selectCards);

  const isLoading = fuelingsLoading || cardsLoading;

  const tableItems = isPrintMode ? sortedForPrint : accountingReport;

  const { writeOffStats, dieselSaleStats } = useFuelStats(
    accountingReport,
    saleCardNames
  );

  const { printContentRef, handlePrint } = usePrint({
    onAfterPrint: () => {
      setIsPrintMode(false);
      setPageSize(15);
      setIsPeriodDisplay(false);
    },
  });

  const handlePrintButtonClick = useCallback(() => {
    setIsPrintMode(true);
    setPageSize(accountingReport.length);
    setIsPeriodDisplay(true);

    setTimeout(() => {
      handlePrint();
    }, 100);
  }, [accountingReport.length, handlePrint]);

  useEffect(() => {
    const [start, end] = dateRange;
    if (start && !end) return;

    const [startTimestamp, endTimestamp] = getDateRangeTimestamp(start, end);

    dispatch(
      fetchAccountingReport({
        startDate: startTimestamp,
        endDate: endTimestamp,
      })
    );
  }, [dateRange, dispatch]);

  useEffect(() => {
    if (!cards || cards.length === 0) {
      dispatch(fetchCardsAsync());
    }
  }, [dispatch, cards]);

  const containsAnyRole = hasRole(role, ['accountant', 'admin', 'fueler']);

  if (initializedUser && !containsAnyRole)
    return (
      <ErrorAlert
        title={userError}
        position='fixed'
        w={{ base: '90%', sm: '70%', md: '50%' }}
        top={{ base: '160px', md: '120px' }}
        left='50%'
        transform='translateX(-50%)'
      />
    );

  return (
    <Box>
      <Heading
        size={['5xl', '6xl']}
        letterSpacing={['1px', '1.5px', '2px', '2px']}
        mb={[8, 12, 16, 16]}
        textAlign='center'>
        {CONSTANTS.AccountingReport}
      </Heading>

      <Flex justifyContent='space-between' mb={6} flexWrap='wrap' gap={4}>
        <CustomDatePicker
          selected={dateRange[0]}
          onChange={handleDateChange}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          dateFormat='dd.MM.yyyy'
          selectsRange
          isClearable
          text={CONSTANTS.ChoosePeriod}
        />

        <Button size='lg' variant='surface' onClick={handlePrintButtonClick}>
          <LuPrinter />
          {CONSTANTS.Print}
        </Button>
      </Flex>

      <Box ref={printContentRef} className='print-container'>
        {isPeriodDisplay && <PeriodDisplay dateRange={dateRange} />}

        {(error || fuelTankErr) && <ErrorAlert title={error || fuelTankErr} />}
        {isLoading && <StatsCardsSkeletonRow />}

        {!isLoading && (
          <Flex
            mx='auto'
            mb={6}
            w='100%'
            flexDirection={{ base: 'column-reverse', lg: 'row' }}
            justify='center'
            gap={4}>
            <StatsCard
              title={CONSTANTS.FuelWriteOffTitle}
              stats={writeOffStats}
              divideY={false}
            />
            <StatsCard
              title={CONSTANTS.DieselSell}
              stats={dieselSaleStats}
              divideY={true}
            />
          </Flex>
        )}

        <DataGrid
          tableItems={tableItems}
          tableHeaderItems={CONSTANTS.TABLE_HEADER_ITEMS}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pageSize={pageSize}
          isLoading={isLoading}
          disableSorting={isPrintMode}
        />
      </Box>
    </Box>
  );
};
