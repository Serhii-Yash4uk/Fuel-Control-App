import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Heading, HStack, Button, Flex, Progress } from '@chakra-ui/react';

import {
  fetchCarLimits,
  createCarLimitAsync,
  updateCarLimitAsync,
  deactivateCarLimitAsync,
  selectAllCarLimits,
  selectCarLimitsLoading,
  selectCarLimitsError,
  selectUser,
  selectUsersErrorMessage,
  selectInitializedUser,
} from '../../redux';

import {
  DataGrid,
  CustomDatePicker,
  ActionsColumn,
  FormDialog,
  ErrorAlert,
  Toaster,
} from '../../components';

import { useMonthFilter } from '../../hooks';

import { generateInitialFormState, safeNumber, hasRole } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const CarLimitsPage = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const role = user?.role;
  const userError = useSelector(selectUsersErrorMessage);
  const initializedUser = useSelector(selectInitializedUser);

  const carLimits = useSelector(selectAllCarLimits);
  const isLoading = useSelector(selectCarLimitsLoading);
  const error = useSelector(selectCarLimitsError);

  const [currentPage, setCurrentPage] = useState(1);
  const [editForm, setEditForm] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState(
    generateInitialFormState(CONSTANTS.HEADER_ITEMS)
  );

  const { selectedMonth, handleChange, startTimestamp, endTimestamp } =
    useMonthFilter(setCurrentPage, undefined, new Date());

  const updatedTableData = useMemo(
    () =>
      carLimits.map((c) => {
        const filled = safeNumber(c.filled);
        const limit = safeNumber(c.limit_liters);
        const remains = limit > 0 ? (limit - filled).toFixed(1) : '';
        let progressValue = limit > 0 ? (filled / limit) * 100 : 0;

        progressValue = Math.max(0, Math.min(progressValue, 100));

        return {
          ...c,
          remains,
          progress: (
            <Progress.Root
              value={progressValue}
              variant='subtle'
              minW='120px'
              pr='1'>
              <HStack gap='2'>
                <Progress.Track flex='1' h='3'>
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText fontSize='14px'>
                  {progressValue.toFixed(1)}%
                </Progress.ValueText>
              </HStack>
            </Progress.Root>
          ),
        };
      }),
    [carLimits]
  );

  useEffect(() => {
    if (startTimestamp && endTimestamp) {
      dispatch(
        fetchCarLimits({ startDate: startTimestamp, endDate: endTimestamp })
      );
    }
  }, [dispatch, startTimestamp, endTimestamp]);

  const handleDelete = (id) => {
    dispatch(deactivateCarLimitAsync({ id }));
  };

  const handleEdit = (rId) => {
    const currentRow = carLimits.find(({ id }) => id === rId);
    if (!currentRow) return;

    setEditForm({ ...currentRow });
    setIsEditDialogOpen(true);
  };

  const handleEditDialogSubmit = () => {
    dispatch(
      updateCarLimitAsync({
        id: editForm.id,
        changes: editForm,
      })
    );
    setIsEditDialogOpen(false);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setNewItemForm(generateInitialFormState(CONSTANTS.HEADER_ITEMS));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setNewItemForm((prev) => ({
      ...prev,
      [name]: name === 'license_plate' ? value.toUpperCase() : value,
    }));
  };

  const handleAddSubmit = () => {
    dispatch(createCarLimitAsync(newItemForm));
    closeAddDialog();
  };

  const filteredHeaderItems = hasRole(role, ['fueler', 'accountant'])
    ? CONSTANTS.HEADER_ITEMS.filter(
        ({ key }) =>
          key !== 'actions' && key !== 'edited_by' && key !== 'created_by'
      )
    : hasRole(role, ['admin'])
      ? CONSTANTS.HEADER_ITEMS
      : CONSTANTS.HEADER_ITEMS.filter(
          ({ key }) => key !== 'edited_by' && key !== 'created_by'
        );

  const canAddLimit = hasRole(role, ['admin']);

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
        {CONSTANTS.CarLimits}
      </Heading>

      {error && <ErrorAlert title={error} />}

      <Flex justifyContent='space-between' mb={6} flexWrap='wrap' gap={4}>
        <CustomDatePicker
          selected={selectedMonth}
          onChange={handleChange}
          showMonthYearPicker
          isClearable
          text={CONSTANTS.ChooseAMonth}
        />

        {canAddLimit && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size='lg'
            alignSelf='flex-end'
            variant='surface'>
            {CONSTANTS.AddNew}
          </Button>
        )}
      </Flex>

      <DataGrid
        tableItems={updatedTableData.map((r) => ({
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
        isLoading={isLoading}
      />

      <FormDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        form={newItemForm}
        setForm={setNewItemForm}
        handleChange={handleAddChange}
        closeDialog={closeAddDialog}
        handleSubmit={handleAddSubmit}
        headerItems={CONSTANTS.HEADER_ITEMS.filter(
          ({ isAddable }) => isAddable
        )}
        submitText={CONSTANTS.Create}
        stripUnitsFromLabel={true}
      />

      <Toaster />
    </Box>
  );
};
