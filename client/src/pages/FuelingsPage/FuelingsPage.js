import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Box,
  Input,
  Flex,
  Heading,
  InputGroup,
  createListCollection,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

import {
  updateFuelingAsync,
  deactivateFuelingAsync,
  fetchFuelings,
  selectAllFuelings,
  selectFuelingsLoadingStatus,
  selectFuelingsErrorMessage,
  selectFuelTanksErrorMessage,
  selectUser,
  selectUsersErrorMessage,
  selectInitializedUser,
  selectAzsSelectionOptions,
} from '../../redux';

import {
  DataGrid,
  CustomDatePicker,
  ActionsColumn,
  ErrorAlert,
  Toaster,
} from '../../components';

import { useDateRangeFilter } from '../../hooks';

import { getDateRangeTimestamp, hasRole } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const FuelingsPage = () => {
  const dispatch = useDispatch();

  const [editForm, setEditForm] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const fuelings = useSelector(selectAllFuelings);
  const isLoading = useSelector(selectFuelingsLoadingStatus);
  const error = useSelector(selectFuelingsErrorMessage);

  const azsSelectionOptions = useSelector(selectAzsSelectionOptions);
  const azsOptions = useMemo(
    () => createListCollection({ items: azsSelectionOptions }),
    [azsSelectionOptions]
  );

  const fuelTankErr = useSelector(selectFuelTanksErrorMessage);

  const user = useSelector(selectUser);
  const role = user?.role;
  const userError = useSelector(selectUsersErrorMessage);
  const initializedUser = useSelector(selectInitializedUser);

  const { dateRange, handleDateChange } = useDateRangeFilter(setCurrentPage);

  const filteredTableData = useMemo(
    () =>
      fuelings.filter(({ driver }) =>
        (driver ? driver.toLowerCase() : '').includes(searchText.toLowerCase())
      ),
    [searchText, fuelings]
  );

  const handleDelete = (id) => {
    dispatch(deactivateFuelingAsync({ id }));
  };

  const handleEdit = (rowId) => {
    const currentRow = fuelings.find(({ id }) => id === rowId);
    if (!currentRow) return;

    setEditForm({ ...currentRow });
    setIsEditDialogOpen(true);
  };

  const handleEditDialogSubmit = () => {
    const { id, ...changes } = editForm;

    dispatch(updateFuelingAsync({ id, changes }));

    setIsEditDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const [start, end] = dateRange;
    if (start && !end) return;

    const [startTimestamp, endTimestamp] = getDateRangeTimestamp(start, end);

    dispatch(
      fetchFuelings({
        startDate: startTimestamp,
        endDate: endTimestamp,
      })
    );
  }, [dateRange, dispatch]);

  useEffect(() => {
    const maxPage = Math.ceil(filteredTableData.length / pageSize);

    if (currentPage > maxPage) setCurrentPage(maxPage || 1);
  }, [filteredTableData.length, pageSize, currentPage]);

  const filteredHeaderItems = hasRole(role, ['fueler', 'accountant'])
    ? CONSTANTS.HEADER_ITEMS.filter(
        ({ key }) => key !== 'actions' && key !== 'edited_by'
      )
    : hasRole(role, ['admin'])
      ? CONSTANTS.HEADER_ITEMS.map((hi) =>
          hi.key === 'liters' ? { ...hi, editable: true } : hi
        )
      : CONSTANTS.HEADER_ITEMS.filter(({ key }) => key !== 'edited_by');

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
        {CONSTANTS.AllRefuels}
      </Heading>

      {(error || fuelTankErr) && <ErrorAlert title={error || fuelTankErr} />}

      <Flex justifyContent='space-between' mb={6} flexWrap='wrap' gap={4}>
        <CustomDatePicker
          selected={dateRange[0]}
          onChange={handleDateChange}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          dateFormat='dd.MM.yyyy'
          text={CONSTANTS.ChoosePeriod}
          selectsRange
          isClearable
        />

        <InputGroup
          flex='1'
          minW={{ base: 300, md: 600 }}
          startElement={<LuSearch />}>
          <Input
            placeholder={CONSTANTS.FilterByNumber}
            value={searchText}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </Flex>

      <DataGrid
        tableItems={filteredTableData.map((r) => ({
          ...r,
          actions: (
            <ActionsColumn
              onEdit={() => handleEdit(r.id)}
              onDelete={() => handleDelete(r.id)}
            />
          ),
        }))}
        tableHeaderItems={filteredHeaderItems}
        setEditForm={setEditForm}
        editForm={editForm}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        handleEditSubmit={handleEditDialogSubmit}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isLoading}
        selectionOptions={azsOptions}
      />

      <Toaster />
    </Box>
  );
};
