import { Router } from 'express';

const router = Router();

import { login } from '../controllers/auth.controller.js';

router.post('/auth/login', login);

export default router;
