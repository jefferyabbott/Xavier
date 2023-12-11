import axios from 'axios';
import { toast } from 'react-toastify';

// config axios w/ authorization
const tokenStr = localStorage.getItem('user');
if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.post['content-type'] = 'application/json';
}


// commands

function enableRemoteDesktop(udid) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/mac/enableRemoteDesktop/${udid}`;
    postCommand(API_URL, 'Enable remote desktop command has been issued.');
}

function clearPasscode(udid, platform) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/ios/clearPasscode/${udid}`;
    const options = {
        platform
    }
    const message = "Clear passcode command has been issued."; 
    postCommandWithOptions(API_URL, options, message);
}

function disableRemoteDesktop(udid) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/mac/disableRemoteDesktop/${udid}`;
    postCommand(API_URL, 'Disable remote desktop command has been issued.');
}

function updateDeviceInventory(platform, udid) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/${platform}/updateInventory/${udid}`;
    postCommand(API_URL, 'Inventory update command has been issued.');
}

function restartDevice(udid, notifyUser) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/restartDevice/${udid}`;
    const options = {
        notifyUser
    }
    const message = (notifyUser) ? "Restart device command has been issued, user will be notified.": "Restart device command has been issued."; 
    postCommandWithOptions(API_URL, options, message);
}

function shutdownDevice(udid) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/shutdownDevice/${udid}`;
    const message = "Shutdown device command has been issued."; 
    postCommand(API_URL, message);
}

function installProfile(udid, profile) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/installProfile/${udid}`;
    const options = {
        profileObject: profile
    }
    const message = "The install profile command has been issued."; 
    postCommandWithOptions(API_URL, options, message);
}

function uploadProfile(profile) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/uploadProfile`;
    const options = {
        profileObject: profile
    }
    const message = 'The configuration profile has been uploaded.'; 
    postCommandWithOptions(API_URL, options, message);
}

function renameDevice(udid, platform, newName, oldName) {
    const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/mdm/commands/renameDevice/${udid}`;
    const options = {
        newName,
        platform
    }
    const message = `Command has been issued to rename ${oldName} to ${newName}`; 
    postCommandWithOptions(API_URL, options, message);
}


// post command to server
async function postCommand(url, message) {
    const response = await axios.post(url);
    if (response.status === 200) {
        toast.success(message);
    } else if (response.status === 401) {
        toast.error('Unauthorized');
    } else if (response.status === 404) {
        toast.error('Device not found');
    } else {
        toast.error('Unknown server error');
    }
}

// post command to server w/ options
async function postCommandWithOptions(url, data, message) {
    const response = await axios.post(url, data);
    if (response.status === 200) {
        toast.success(message);
    } else if (response.status === 401) {
        toast.error('Unauthorized');
    } else if (response.status === 404) {
        toast.error('Device not found');
    } else {
        toast.error('Unknown server error');
    }
}

export { 
    enableRemoteDesktop,
    disableRemoteDesktop,
    updateDeviceInventory, 
    restartDevice,
    installProfile,
    clearPasscode,
    renameDevice,
    shutdownDevice,
    uploadProfile
};
