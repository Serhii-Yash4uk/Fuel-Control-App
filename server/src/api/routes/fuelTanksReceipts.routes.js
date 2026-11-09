import { Router } from 'express';

const router = Router();

import {
  getFuelTanksReceipts,
  getDeactivatedFuelTanksReceipts,
  addFuelTankReceipt,
  updateFuelTankReceipt,
  updateReceiptActiveStatus,
  deleteFuelTankReceipt,
} from '../controllers/fuelTanksReceipts.controller.js';
import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/receipts/:tank_id', getFuelTanksReceipts);
router.get(
  '/deactivated-receipts/',
  adminOnly,
  getDeactivatedFuelTanksReceipts,
);
router.post('/receipts', addFuelTankReceipt);
router.patch(
  '/receipts/:id',
  requireRole('admin', 'accountant'),
  updateFuelTankReceipt,
);
router.patch(
  '/receipts/:id/updateActiveStatus',
  adminOnly,
  updateReceiptActiveStatus,
);
router.delete('/receipts/:id', adminOnly, deleteFuelTankReceipt);

export default router;
