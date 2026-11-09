import { Router } from 'express';

const router = Router();

import {
  getAllFuelings,
  updateFueling,
  updateFuelingActiveStatus,
  deleteFueling,
} from '../controllers/fuelings.controller.js';
import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/fuelings', getAllFuelings);
router.patch('/fuelings/:id', requireRole('admin', 'fueler'), updateFueling);
router.patch(
  '/fuelings/:id/updateActiveStatus',
  adminOnly,
  updateFuelingActiveStatus,
);
router.delete('/fuelings/:id', adminOnly, deleteFueling);

export default router;
