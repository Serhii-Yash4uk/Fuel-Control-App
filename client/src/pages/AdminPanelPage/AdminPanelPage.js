import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Table,
  Tabs,
  Flex,
  Heading,
  Icon,
  createListCollection,
} from '@chakra-ui/react';

import {
  fetchCardsAsync,
  selectCards,
  selectUser,
  selectUsersLoadingStatus,
  selectFuelTanksLoadingStatus,
  selectFuelingsLoadingStatus,
  selectCarLimitsLoading,
  selectUsersErrorMessage,
  selectFuelingsErrorMessage,
  selectCarLimitsError,
  selectFuelTanksErrorMessage,
} from '../../redux';

import {
  EditUserDialog,
  EditCardDialog,
  FormDialog,
  FuelTankDialog,
  Toaster,
  AdminEntityList,
  AdminEntitySkeleton,
} from '../../components';

import { useAdminPanelHandlers } from '../../hooks';

import { getUsedMovingCards, buildCardsCollection } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const AdminPanelPage = () => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('users');

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({});
  const [isTankDialogOpen, setIsTankDialogOpen] = useState(false);
  const [tankDialogType, setTankDialogType] = useState('main');
  const [editTank, setEditTank] = useState(null);
  const [mainTankIdForConnected, setMainTankIdForConnected] = useState(null);

  const user = useSelector(selectUser);
  const isAdmin = user?.id;

  const users = useSelector(CONSTANTS.adminEntities.users.selector);
  const fuelTanks = useSelector(CONSTANTS.adminEntities.fuelTanks.selector);
  const cards = useSelector(CONSTANTS.adminEntities.cards.selector);
  const receipts = useSelector(CONSTANTS.adminEntities.receipts.selector);
  const fuelings = useSelector(CONSTANTS.adminEntities.fuelings.selector);
  const limits = useSelector(CONSTANTS.adminEntities.limits.selector);

  const usersError = useSelector(selectUsersErrorMessage);
  const fuelTanksError = useSelector(selectFuelTanksErrorMessage);
  const cardsError = useSelector(selectFuelingsErrorMessage);
  const limitsError = useSelector(selectCarLimitsError);
  const receiptsError = useSelector(selectFuelingsErrorMessage);
  const fuelingsError = useSelector(selectFuelingsErrorMessage);
  const selectionCards = useSelector(selectCards);

  const entityData = { users, fuelTanks, cards, receipts, fuelings, limits };

  const entityLoading = {
    users: useSelector(selectUsersLoadingStatus),
    fuelTanks: useSelector(selectFuelTanksLoadingStatus),
    cards: useSelector(selectFuelingsLoadingStatus),
    receipts: useSelector(selectFuelTanksLoadingStatus),
    fuelings: useSelector(selectFuelingsLoadingStatus),
    limits: useSelector(selectCarLimitsLoading),
  };

  const entityErrors = {
    users: usersError,
    fuelTanks: fuelTanksError,
    cards: cardsError,
    limits: limitsError,
    receipts: receiptsError,
    fuelings: fuelingsError,
  };

  useEffect(() => {
    const config = CONSTANTS.adminEntities[currentTab];
    if (config && config.fetch) dispatch(config.fetch());
  }, [currentTab, dispatch]);

  useEffect(() => {
    dispatch(fetchCardsAsync());
  }, [dispatch]);

  const usedMovingCards = useMemo(
    () => getUsedMovingCards(fuelTanks),
    [fuelTanks]
  );

  const cardsCollection = useMemo(
    () =>
      buildCardsCollection(
        selectionCards,
        usedMovingCards,
        createListCollection
      ),
    [selectionCards, usedMovingCards]
  );

  const handlers = useAdminPanelHandlers({
    dispatch,
    editUser,
    setEditUser,
    setIsUserDialogOpen,
    editCard,
    setEditCard,
    setIsCardDialogOpen,
    setIsLimitDialogOpen,
    editTank,
    setEditTank,
    setTankDialogType,
    setIsTankDialogOpen,
    setMainTankIdForConnected,
    tankDialogType,
    mainTankIdForConnected,
  });

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setNewItemForm((prev) => ({
      ...prev,
      [name]: name === 'license_plate' ? value.toUpperCase() : value,
    }));
  };

  const handleAddSubmit = () => {
    dispatch(CONSTANTS.adminEntities.limits.create(newItemForm));
    setNewItemForm({});
    setIsLimitDialogOpen(false);
  };

  const handleCloseLimitDialog = () => {
    setNewItemForm({});
    setIsLimitDialogOpen(false);
  };

  return (
    <>
      <Flex direction='column' alignItems='center' mx='auto' pb={12} w='full'>
        <Heading size={['5xl', '6xl']} mb={[8, 12, 16, 16]} textAlign='center'>
          {CONSTANTS.AdminPanelTitle}
        </Heading>

        <Table.ScrollArea
          maxW='container.xl'
          scrollBehavior='smooth'
          overflowY='hidden'>
          <Flex justifyContent='space-beetween' mb={6} flexWrap='wrap' gap={8}>
            <Tabs.Root
              defaultValue='users'
              size={{ base: 'sm', md: 'md', lg: 'lg' }}>
              <Tabs.List display='flex' justifyContent='space-between'>
                {Object.entries(CONSTANTS.adminEntities).map(
                  ([key, config]) => (
                    <Tabs.Trigger
                      value={key}
                      key={key}
                      _hover={{
                        backgroundColor: 'gray.50',
                        borderTopLeftRadius: 'lg',
                        borderTopRightRadius: 'lg',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      onClick={() => setCurrentTab(key)}>
                      <Icon as={config.icon} boxSize={5} />
                      {config.label}
                    </Tabs.Trigger>
                  )
                )}
              </Tabs.List>

              {Object.entries(CONSTANTS.adminEntities).map(([key, config]) => (
                <Tabs.Content value={key} key={key}>
                  {entityLoading[key] ? (
                    <AdminEntitySkeleton
                      type={config.type}
                      count={CONSTANTS.SKELETON_COUNTS[config.type] || 2}
                    />
                  ) : (
                    <AdminEntityList
                      entityKey={key}
                      config={config}
                      items={entityData[key] || []}
                      usedMovingCards={usedMovingCards}
                      onCreate={handlers[key]?.onCreate}
                      onCreateConnected={handlers[key]?.onCreateConnected}
                      onEdit={handlers[key]?.onEdit}
                      onDelete={handlers[key]?.onDelete}
                      onActivate={handlers[key]?.onActivate}
                      RoleIcons={CONSTANTS.RoleIcons}
                      RoleColors={CONSTANTS.RoleColors}
                      isAdmin={isAdmin}
                      error={entityErrors[key]}
                      divideY={
                        [
                          'receipts',
                          'fuelings',
                          'limits',
                          'fuelTanks',
                        ].includes(key)
                          ? 1
                          : undefined
                      }
                    />
                  )}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </Flex>
        </Table.ScrollArea>
      </Flex>

      {isUserDialogOpen && (
        <EditUserDialog
          isOpen={isUserDialogOpen}
          onClose={() => setIsUserDialogOpen(false)}
          onSubmit={handlers.users.onSubmit}
          isEdit={editUser}
          initialValues={
            editUser
              ? {
                  username: editUser.username,
                  password: '',
                  role: editUser.role,
                  displayName: editUser.displayName,
                }
              : { username: '', password: '', role: '', displayName: '' }
          }
          isRoleDisabled={
            editUser && editUser.role === 'admin' && editUser.id === 1
          }
        />
      )}

      {isCardDialogOpen && (
        <EditCardDialog
          isOpen={isCardDialogOpen}
          setIsOpen={setIsCardDialogOpen}
          onClose={() => setIsCardDialogOpen(false)}
          onSubmit={handlers.cards.onSubmit}
          initialValues={{
            cardName: editCard?.cardName || '',
            type: editCard?.type || 'FUEL',
          }}
          isEdit={!!(editCard && editCard.id)}
        />
      )}

      {isLimitDialogOpen && (
        <FormDialog
          isOpen={isLimitDialogOpen}
          setIsOpen={setIsLimitDialogOpen}
          closeDialog={handleCloseLimitDialog}
          form={newItemForm}
          setForm={setNewItemForm}
          handleChange={handleAddChange}
          handleSubmit={handleAddSubmit}
          headerItems={CONSTANTS.LIMITS_DIALOG_ITEMS}
        />
      )}

      {isTankDialogOpen && (
        <FuelTankDialog
          isOpen={isTankDialogOpen}
          setIsOpen={setIsTankDialogOpen}
          onClose={() => setIsTankDialogOpen(false)}
          onSubmit={handlers.fuelTanks.onSubmit}
          type={tankDialogType}
          isEdit={!!editTank}
          initialValues={editTank || {}}
          cardsCollection={cardsCollection}
        />
      )}

      <Toaster />
    </>
  );
};
