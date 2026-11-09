import { CONSTANTS } from '../pages/AdminPanelPage/CONSTANTS';
import { fetchAllFuelTanksWithConnected, fetchAllFuelTanks } from '../redux';

export const useAdminPanelHandlers = ({
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
}) => {
  return {
    users: {
      onCreate: () => {
        setEditUser(null);
        setIsUserDialogOpen(true);
      },
      onEdit: (u) => {
        setEditUser(u);
        setIsUserDialogOpen(true);
      },
      onDelete: (id) => dispatch(CONSTANTS.adminEntities.users.delete(id)),
      onSubmit: (formData) => {
        if (editUser) {
          dispatch(
            CONSTANTS.adminEntities.users.update({
              id: editUser.id,
              changes: formData,
            })
          );
        } else {
          dispatch(CONSTANTS.adminEntities.users.create(formData));
        }
        setIsUserDialogOpen(false);
      },
    },

    fuelTanks: {
      onCreate: () => {
        setEditTank(null);
        setTankDialogType('main');
        setIsTankDialogOpen(true);
      },
      onCreateConnected: (mainTankId) => {
        setEditTank(null);
        setTankDialogType('connected');
        setMainTankIdForConnected(mainTankId);
        setIsTankDialogOpen(true);
      },
      onEdit: (tank) => {
        setEditTank(tank);
        setTankDialogType(tank.is_main ? 'main' : 'connected');
        setIsTankDialogOpen(true);
      },
      onDelete: async (id) => {
        await dispatch(CONSTANTS.adminEntities.fuelTanks.delete(id));
        await dispatch(fetchAllFuelTanksWithConnected());
        await dispatch(fetchAllFuelTanks());
      },
      onSubmit: async (formData) => {
        if (editTank) {
          if (tankDialogType === 'main') {
            await dispatch(
              CONSTANTS.adminEntities.fuelTanks.updateMain({
                id: editTank.id,
                changes: formData,
              })
            );
            await dispatch(fetchAllFuelTanksWithConnected());
          } else {
            await dispatch(
              CONSTANTS.adminEntities.fuelTanks.updateConnected({
                id: editTank.id,
                changes: formData,
              })
            );
            await dispatch(fetchAllFuelTanksWithConnected());
          }
        } else {
          if (tankDialogType === 'main') {
            await dispatch(
              CONSTANTS.adminEntities.fuelTanks.createMain(formData)
            );
            await dispatch(fetchAllFuelTanksWithConnected());
            await dispatch(fetchAllFuelTanks());
          } else {
            await dispatch(
              CONSTANTS.adminEntities.fuelTanks.createConnected({
                ...formData,
                mainTankId: mainTankIdForConnected,
              })
            );
            await dispatch(fetchAllFuelTanksWithConnected());
          }
        }
        setIsTankDialogOpen(false);
      },
    },

    cards: {
      onCreate: () => {
        setEditCard(null);
        setIsCardDialogOpen(true);
      },
      onEdit: (c) => {
        setEditCard(c);
        setIsCardDialogOpen(true);
      },
      onDelete: (id) => dispatch(CONSTANTS.adminEntities.cards.delete(id)),
      onSubmit: (formData) => {
        if (editCard && editCard.id) {
          dispatch(
            CONSTANTS.adminEntities.cards.update({
              id: editCard.id,
              changes: formData,
            })
          );
        } else {
          dispatch(CONSTANTS.adminEntities.cards.create(formData));
        }
        setIsCardDialogOpen(false);
      },
    },

    receipts: {
      onDelete: (id) => dispatch(CONSTANTS.adminEntities.receipts.delete(id)),
      onActivate: (id) =>
        dispatch(CONSTANTS.adminEntities.receipts.activate({ id })),
    },

    fuelings: {
      onDelete: (id) => dispatch(CONSTANTS.adminEntities.fuelings.delete(id)),
      onActivate: (id) =>
        dispatch(CONSTANTS.adminEntities.fuelings.activate({ id })),
    },

    limits: {
      onCreate: () => {
        setIsLimitDialogOpen(true);
      },
      onDelete: (id) => dispatch(CONSTANTS.adminEntities.limits.delete(id)),
      onActivate: (id) =>
        dispatch(CONSTANTS.adminEntities.limits.activate({ id })),
    },
  };
};
