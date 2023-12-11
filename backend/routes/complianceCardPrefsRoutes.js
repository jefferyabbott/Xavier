import { Router } from 'express';
const router = Router();
import { getComplianceCardPrefs, setComplianceCardPrefs } from '../controllers/complianceCardPrefs.js';
import protect from '../middleware/authHandler.js';

router.get('/', protect, getComplianceCardPrefs);
router.post('/', protect, setComplianceCardPrefs);

export default router;
