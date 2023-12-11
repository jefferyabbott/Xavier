import { Router } from 'express';
const router = Router();
import { 
    updateiOSDeviceDetails, 
    updateMacDeviceDetails, 
    restartDevice, 
    enableRemoteDesktop, 
    disableRemoteDesktop, 
    installConfigProfile,
    clearPasscode,
    renameDevice,
    shutdownDevice,
    uploadConfigProfile
} from '../controllers/mdmCommands.js';
import protect from '../middleware/authHandler.js';

router.post('/mac/updateInventory/:udid', protect, updateMacDeviceDetails);
router.post('/ios/updateInventory/:udid', protect, updateiOSDeviceDetails);
router.post('/restartDevice/:udid', protect, restartDevice);
router.post('/mac/enableRemoteDesktop/:udid', protect, enableRemoteDesktop);
router.post('/mac/disableRemoteDesktop/:udid', protect, disableRemoteDesktop);
router.post('/installProfile/:udid', protect, installConfigProfile);
router.post('/ios/clearPasscode/:udid', protect, clearPasscode);
router.post('/renameDevice/:udid', protect, renameDevice);
router.post('/shutdownDevice/:udid', protect, shutdownDevice);
router.post('/uploadProfile', protect, uploadConfigProfile);

export default router;
