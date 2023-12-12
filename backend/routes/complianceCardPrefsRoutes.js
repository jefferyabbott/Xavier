import { Router } from 'express';
const router = Router();
import { getComplianceCardPrefs, setComplianceCardPrefs } from '../controllers/complianceCardPrefs.js';

router.get('/', getComplianceCardPrefs);
router.post('/', setComplianceCardPrefs);

export default router;
