import { Router } from 'express';

const router = Router();

import { getAccountingReport } from '../controllers/accounting.controller.js';

router.get('/accountingReport', getAccountingReport);

export default router;
