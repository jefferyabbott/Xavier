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
    uploadConfigProfile,
    lockDevice,
    removeConfigProfile,
    eraseDevice,
    getAvailableSoftwareUpdates
} from '../controllers/mdmCommands.js';

router.post('/mac/updateInventory/:udid', updateMacDeviceDetails);
router.post('/ios/updateInventory/:udid', updateiOSDeviceDetails);
router.post('/restartDevice/:udid', restartDevice);
router.post('/mac/enableRemoteDesktop/:udid', enableRemoteDesktop);
router.post('/mac/disableRemoteDesktop/:udid', disableRemoteDesktop);
router.post('/installProfile/:udid', installConfigProfile);
router.post('/ios/clearPasscode/:udid', clearPasscode);
router.post('/renameDevice/:udid', renameDevice);
router.post('/shutdownDevice/:udid', shutdownDevice);
router.post('/uploadProfile', uploadConfigProfile);
router.post('/lockDevice/:udid', lockDevice);
router.post('/eraseDevice/:udid', eraseDevice);
router.post('/removeProfile/:udid', removeConfigProfile);
router.post('/getAvailableSoftwareUpdates/:udid', getAvailableSoftwareUpdates);

export default router;
