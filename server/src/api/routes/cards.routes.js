import { Router } from 'express';

const router = Router();

import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cards.controller.js';
import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/cards', getCards);
router.post('/cards', adminOnly, createCard);
router.patch('/cards/:id', adminOnly, updateCard);
router.delete('/cards/:id', adminOnly, deleteCard);

export default router;
