import { Router } from 'express';
const router = Router();
import deviceResponse from '../controllers/mdmWebhook.js';

router.post('/', deviceResponse);

export default router;
