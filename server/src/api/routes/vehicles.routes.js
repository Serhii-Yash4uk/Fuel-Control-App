import { Router } from 'express';

const router = Router();

import {
  getCarLimits,
  createCarLimit,
  updateCarLimit,
  updateCarLimitActiveStatus,
  deleteCarLimit,
} from '../controllers/vehicles.controller.js';
import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/car-limits', getCarLimits);
router.post('/car-limits', adminOnly, createCarLimit);
router.patch('/car-limits/:id', adminOnly, updateCarLimit);
router.patch(
  '/car-limits/:id/updateActiveStatus',
  adminOnly,
  updateCarLimitActiveStatus,
);
router.delete('/car-limits/:id', adminOnly, deleteCarLimit);

export default router;
