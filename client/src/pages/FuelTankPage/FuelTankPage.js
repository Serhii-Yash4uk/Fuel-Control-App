import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Flex, Heading, Button, Icon } from '@chakra-ui/react';

import { FaCheckSquare, FaMinusSquare } from 'react-icons/fa';
import { LuPenLine } from 'react-icons/lu';

import {
  selectMainTankStats,
  selectConnectedTanksStats,
  selectFuelTanksLoadingStatus,
  selectFuelTankStatsLoadingStatus,
  fetchFuelTanksReceipts,
  createReceiptAsync,
  updateReceiptAsync,
  fetchFuelTankStats,
  deactivateReceiptAsync,
  selectAllReceipts,
  selectFuelTanksErrorMessage,
  selectUser,
  selectUsersErrorMessage,
  selectInitializedUser,
} from '../../redux';

import {
  FuelTankStats,
  CustomDatePicker,
  DataGrid,
  RefillFuelTankDialog,
  ActionsColumn,
  ErrorAlert,
  Toaster,
  EuroTankStats,
} from '../../components';

import { useMonthFilter } from '../../hooks';

import {
  generateInitialFormState,
  getFuelTankStatsData,
  hasRole,
  chunkArray,
} from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const FuelTankPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isAddReceiptDialogOpen, setIsAddReceiptDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newItemForm, setNewItemForm] = useState(
    generateInitialFormState(CONSTANTS.HEADER_ITEMS),
  );

  const mainTank = useSelector(selectMainTankStats);
  const connectedTanks = useSelector(selectConnectedTanksStats);

  const receipts = useSelector(selectAllReceipts);
  const isLoading = useSelector(selectFuelTanksLoadingStatus);
  const isStatsLoading = useSelector(selectFuelTankStatsLoadingStatus);
  const error = useSelector(selectFuelTanksErrorMessage);

  const user = useSelector(selectUser);
  const role = user?.role;
  const userError = useSelector(selectUsersErrorMessage);
  const initializedUser = useSelector(selectInitializedUser);

  const fuelTankStatsData = useMemo(
    () => getFuelTankStatsData(mainTank),
    [mainTank],
  );

  const { filteredData, selectedMonth, handleChange } = useMonthFilter(
    receipts,
    setCurrentPage,
  );

  useEffect(() => {
    dispatch(fetchFuelTanksReceipts({ tankId: id }));
    dispatch(fetchFuelTankStats({ tankId: id }));
  }, [dispatch, id]);

  const refreshStats = () => dispatch(fetchFuelTankStats({ tankId: id }));

  const handleAddReceipt = () => {
    dispatch(
      createReceiptAsync({
        ...newItemForm,
        tank_id: id,
        currentBalance:
          mainTank.currentBalance +
          (connectedTanks || []).reduce(
            (acc, tank) => acc + tank.currentBalance,
            0,
          ),
        averagePrice: mainTank.averagePrice,
      }),
    ).then(refreshStats);

    closeAddDialog();
  };

  const handleDelete = (rId) => {
    dispatch(deactivateReceiptAsync({ id: rId })).then(refreshStats);
  };

  const handleEdit = () => {
    dispatch(
      updateReceiptAsync({
        id: editForm.id,
        changes: editForm,
      }),
    ).then(refreshStats);

    setIsEditDialogOpen(false);
  };

  const handleEditChange = (rowId) => {
    const currentRow = receipts.find(({ id }) => id === rowId);
    if (!currentRow) return;

    setEditForm({ ...currentRow });
    setIsEditDialogOpen(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setNewItemForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeAddDialog = () => {
    setIsAddReceiptDialogOpen(false);
    setNewItemForm(generateInitialFormState(CONSTANTS.HEADER_ITEMS));
  };

  const filteredHeaderItems = hasRole(role, ['fueler'])
    ? CONSTANTS.HEADER_ITEMS.filter(
        ({ key }) =>
          key !== 'actions' && key !== 'edited_by' && key !== 'created_by',
      )
    : hasRole(role, ['admin'])
      ? CONSTANTS.HEADER_ITEMS
      : CONSTANTS.HEADER_ITEMS.filter(
          ({ key }) => key !== 'edited_by' && key !== 'created_by',
        );

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

  const hasInvalidPrice = receipts?.some((r) => !r.price);

  const addableHeaderItems = CONSTANTS.HEADER_ITEMS.map((item) =>
    item.key === 'price' && hasInvalidPrice
      ? { ...item, isAddable: false }
      : item,
  ).filter(({ isAddable }) => isAddable);

  const euroTanksCount = connectedTanks?.length || 0;

  return (
    <Box>
      <Heading
        size={['5xl', '6xl']}
        letterSpacing={['1px', '1.5px', '2px', '2px']}
        mb={[8, 12, 16, 16]}
        textAlign='center'>
        {CONSTANTS.Barrel}
      </Heading>

      {error && <ErrorAlert title={error} />}

      <Flex
        mx='auto'
        mb={12}
        w='100%'
        direction={{ base: 'column', '2xl': 'row' }}
        justify='center'
        gap={4}>
        {!euroTanksCount && (
          <FuelTankStats
            stats={mainTank}
            isLoading={isStatsLoading}
            fuelTankStatsData={fuelTankStatsData}
            setIsOpen={setIsAddReceiptDialogOpen}
          />
        )}

        {euroTanksCount === 1 && (
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            justify='center'
            align='center'
            gap={6}
            w='100%'>
            <FuelTankStats
              stats={mainTank}
              isLoading={isStatsLoading}
              fuelTankStatsData={fuelTankStatsData}
              setIsOpen={setIsAddReceiptDialogOpen}
            />
            {connectedTanks.map((t) => (
              <EuroTankStats
                key={t.id || t.tankName}
                isLoading={isStatsLoading}
                euroStats={getFuelTankStatsData(t).filter(
                  ({ key }) =>
                    key !== 'warningThreshold' && key !== 'averagePrice',
                )}
                tankName={t.tankName}
                fillPercentage={t.fillPercentage}
                threshold={t.warningThreshold}
              />
            ))}
          </Flex>
        )}

        {euroTanksCount > 1 && (
          <Flex direction='column' align='center' gap={6} w='100%'>
            <FuelTankStats
              stats={mainTank}
              isLoading={isStatsLoading}
              fuelTankStatsData={fuelTankStatsData}
              setIsOpen={setIsAddReceiptDialogOpen}
            />

            <Flex direction='column' gap={6} align='center' w='100%'>
              {chunkArray(connectedTanks, 2).map((tankPair, idx) => (
                <Flex
                  key={idx}
                  direction={{ base: 'column', lg: 'row' }}
                  justify='space-between'
                  gap={4}
                  w={{ base: '100%', md: '76.5%', xl: '66.5%' }}>
                  {tankPair.map((t) => (
                    <EuroTankStats
                      key={t.id || t.tankName}
                      isLoading={isStatsLoading}
                      euroStats={getFuelTankStatsData(t).filter(
                        ({ key }) =>
                          key !== 'warningThreshold' && key !== 'averagePrice',
                      )}
                      tankName={t.tankName}
                      fillPercentage={t.fillPercentage}
                      threshold={t.warningThreshold}
                      flex='0 1 100%'
                      w='100%'
                    />
                  ))}
                </Flex>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>

      <Flex direction='column' w='full'>
        <CustomDatePicker
          mb={6}
          selected={selectedMonth}
          onChange={handleChange}
          showMonthYearPicker
          isClearable
          text={CONSTANTS.ChooseAMonth}
        />

        <DataGrid
          tableItems={filteredData.map((r) => ({
            ...r,
            paid: !r.paid ? (
              ''
            ) : (
              <Icon
                as={r.paid === 'Так' ? FaCheckSquare : FaMinusSquare}
                boxSize={6}
                color={r.paid === 'Так' ? 'green.400' : 'red.400'}
              />
            ),
            actions:
              role === 'accountant' ? (
                <Button
                  variant='plain'
                  h='4'
                  p='0'
                  onClick={() => handleEditChange(r.id)}>
                  <LuPenLine />
                  {CONSTANTS.Edit}
                </Button>
              ) : (
                <ActionsColumn
                  onEdit={() => handleEditChange(r.id)}
                  onDelete={() => handleDelete(r.id)}
                />
              ),
          }))}
          tableHeaderItems={filteredHeaderItems}
          editForm={editForm}
          setEditForm={setEditForm}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          handleEditSubmit={handleEdit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectionOptions={CONSTANTS.SELECTION_OPTIONS}
          isLoading={isLoading}
        />
      </Flex>

      <RefillFuelTankDialog
        setIsOpen={setIsAddReceiptDialogOpen}
        isOpen={isAddReceiptDialogOpen}
        handleClose={closeAddDialog}
        onChange={handleAddChange}
        handleAddSubmit={handleAddReceipt}
        tableHeaderItems={addableHeaderItems}
        formValues={newItemForm}
      />

      <Toaster />
    </Box>
  );
};
