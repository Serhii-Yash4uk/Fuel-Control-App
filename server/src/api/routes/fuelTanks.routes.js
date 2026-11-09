import { Router } from 'express';

const router = Router();

import {
  getAllFuelTanks,
  getAllFuelTanksWithConnected,
  createMainTank,
  updateFuelTank,
  deleteFuelTank,
  createConnectedTank,
  getFuelTankStatsWithConnections,
} from '../controllers/fuelTanks.controller.js';
import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/fuel-tanks', getAllFuelTanks);
router.get('/fuel-tanks/with-connected', getAllFuelTanksWithConnected);

router.post('/fuel-tanks/main', adminOnly, createMainTank);
router.post('/fuel-tanks/connected', adminOnly, createConnectedTank);

router.patch('/fuel-tanks/:id', adminOnly, updateFuelTank);

router.delete('/fuel-tanks/:id', adminOnly, deleteFuelTank);

router.get('/fuel-tanks/:id/stats', getFuelTankStatsWithConnections);

export default router;
