import express from 'express';
const router = express.Router();
import macOSDevice from '../models/macOSDevice.js';
import iOSDevice from '../models/iOSDevice.js';
import iPadOSDevice from '../models/iPadOSDevice.js';
import profile from '../models/profile.js';
import { 
    getInstalledApplications_MDM_Command, 
    getDeviceInfo_MDM_Command, 
    getCertificateList_MDM_Command, 
    getiOSDeviceInfo_MDM_Command, 
    getProfileList_MDM_Command, 
    getSecurityInfo_MDM_Command, 
    restartDevice_MDM_Command,
    enableRemoteDesktop_MDM_Command,
    disableRemoteDesktop_MDM_Command,
    installConfigProfile_MDM_Command,
    clearPasscode_MDM_Command,
    renameDevice_MDM_Command,
    shutdownDevice_MDM_Command,
    lockDevice_MDM_Command
} from '../services/mdmActions.js';
import createRandom6DigitPin from '../utilities/randomPin.js';
import isAdministrator from '../utilities/checkPrivileges.js';

// get iOS devices
const updateiOSDeviceDetails = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    if (udid) {
        getiOSDeviceInfo_MDM_Command(udid);
        getInstalledApplications_MDM_Command(udid);
        getCertificateList_MDM_Command(udid);
        getProfileList_MDM_Command(udid);
        getSecurityInfo_MDM_Command(udid);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// get mac details
const updateMacDeviceDetails = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    if (udid) {
        getDeviceInfo_MDM_Command(udid);
        getInstalledApplications_MDM_Command(udid);
        getSecurityInfo_MDM_Command(udid);
        getCertificateList_MDM_Command(udid);
        getProfileList_MDM_Command(udid);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// install config profile
const installConfigProfile = async (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    const { profileObject } = req.body;
    // update database with profile details
    installConfigProfile_MDM_Command(udid, profileObject.MobileConfigData);
    await profile.updateOne({
            'PayloadIdentifier': profileObject.PayloadIdentifier
        }, 
        {
            PayloadDisplayName: profileObject.PayloadDisplayName,
            PayloadDescription: profileObject.PayloadDescription,
            PayloadOrganization: profileObject.PayloadOrganization,
            PayloadIdentifier: profileObject.PayloadIdentifier,
            PayloadUUID: profileObject.PayloadUUID,
            MobileConfigData: profileObject.MobileConfigData
        },
        {
            upsert: true
        }
        );
    
    return res.sendStatus(200);
}

// upload config profile
const uploadConfigProfile = async (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { profileObject } = req.body;
    await profile.updateOne({
        'PayloadIdentifier': profileObject.PayloadIdentifier
    }, 
    {
        PayloadDisplayName: profileObject.PayloadDisplayName,
        PayloadDescription: profileObject.PayloadDescription,
        PayloadOrganization: profileObject.PayloadOrganization,
        PayloadIdentifier: profileObject.PayloadIdentifier,
        PayloadUUID: profileObject.PayloadUUID,
        MobileConfigData: profileObject.MobileConfigData
    },
    {
        upsert: true
    }
    );

return res.sendStatus(200);
}


// clear passcode (iOS and iPadOS)
const clearPasscode = async (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    const { platform } = req.body;
    let UnlockToken = '';
    if (platform === 'iPadOS') {
        UnlockToken = await iPadOSDevice.findOne({UDID: udid}).select('UnlockToken -_id');
    } else if (platform === 'iOS') {
        UnlockToken = await iOSDevice.findOne({UDID: udid}).select('UnlockToken -_id');
    }
    clearPasscode_MDM_Command(udid, UnlockToken);
    return res.sendStatus(200);
}

// lock device
const lockDevice = async (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    const { message, phoneNumber } = req.body;
    const pin = createRandom6DigitPin();
    await macOSDevice.updateOne({ UDID: udid }, { $push: { unlockPins: {'pin': pin }}});
    lockDevice_MDM_Command(udid, pin, message, phoneNumber);
    return res.sendStatus(200);
}

// restart device
const restartDevice = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    const { notifyUser } = req.body;
    if (udid) {
        restartDevice_MDM_Command(udid, notifyUser);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// shutdown device
const shutdownDevice = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    if (udid) {
        shutdownDevice_MDM_Command(udid);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// enable remote desktop (mac)
const enableRemoteDesktop = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    if (udid) {
        enableRemoteDesktop_MDM_Command(udid);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// disable remote desktop (mac)
const disableRemoteDesktop = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    if (udid) {
        disableRemoteDesktop_MDM_Command(udid);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

// rename device 
const renameDevice = (req, res) => {
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }
    const { udid } = req.params;
    const { newName, platform } = req.body;
    if (udid) {
        renameDevice_MDM_Command(udid, newName);
        if (platform === 'macOS') {
            getDeviceInfo_MDM_Command(udid);
        } else if (platform === 'iOS' || platform === 'iPadOS') {
            getiOSDeviceInfo_MDM_Command(udid);
        }
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
}

export { 
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
    lockDevice
}
