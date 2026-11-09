import { Router } from 'express';

const router = Router();

import {
  getUsers,
  getUserInfo,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/users.controller.js';

import { requireRole } from '../../middlewares/authMiddleware.js';

const adminOnly = requireRole('admin');

router.get('/users', adminOnly, getUsers);
router.get('/users/me', getUserInfo);
router.post('/users/create', adminOnly, createUser);
router.patch('/users/update/:id', adminOnly, updateUser);
router.delete('/users/delete/:id', adminOnly, deleteUser);

export default router;
