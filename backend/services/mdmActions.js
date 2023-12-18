import axios from 'axios';
import { createRawCommandPlistWithLog, createRawCommandPlistWithoutLog } from './createRawCommandPlist.js';

// mdm details
const convertedAuthToken = Buffer.from(`${process.env.MDM_USER}:${process.env.MDM_TOKEN}`).toString('base64');
const AUTHORIZATION = `Basic ${convertedAuthToken}`;
const SERVER_URL = process.env.MDM_SERVER_URL;


// update Application data
function getInstalledApplications_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>InstalledApplicationList</string>';
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}

// update CertificateList data
function getCertificateList_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>CertificateList</string>';
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}

// update Device Info (QueryResponses) data
function getDeviceInfo_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>DeviceInformation</string>';
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}

// update Device Info (iOS select responses) data
function getiOSDeviceInfo_MDM_Command(udid) {
  const args = `
    <key>RequestType</key>
    <string>DeviceInformation</string>
    <key>Queries</key>
      <array>
        <string>AppAnalyticsEnabled</string>
        <string>AvailableDeviceCapacity</string>
        <string>AwaitingConfiguration</string>
        <string>BluetoothMAC</string>
        <string>BuildVersion</string>
        <string>CellularTechnology</string>
        <string>DataRoamingEnabled</string>
        <string>DeviceCapacity</string>
        <string>DeviceName</string>
        <string>IsActivationLockEnabled</string>
        <string>IsCloudBackupEnabled</string>
        <string>IsDeviceLocatorServiceEnabled</string>
        <string>IsDoNotDisturbInEffect</string>
        <string>LastCloudBackupDate</string>
        <string>Model</string>
        <string>ModelName</string>
        <string>ModelNumber</string>
        <string>OSVersion</string>
        <string>PersonalHotspotEnabled</string>
        <string>ProductName</string>
        <string>SerialNumber</string>
        <string>SupplementalBuildVersion</string>
        <string>TimeZone</string>
        <string>UDID</string>
        <string>WiFiMAC</string>
        <string>ServiceSubscriptions</string>
      </array>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}

// update ProfileList data
function getProfileList_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>ProfileList</string>';
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}

// update Security data
function getSecurityInfo_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>SecurityInfo</string>';
  sendMDMCommand(udid, createRawCommandPlistWithoutLog(args));
}


// restart device
function restartDevice_MDM_Command(udid, notifyUser, requester) {
  const args = `
    <key>RequestType</key>
    <string>RestartDevice</string>
    <key>NotifyUser</key>
    <${notifyUser}/>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, notifyUser ? 'notify user to restart device' : 'restart device', requester, udid));
}

// shutdown device
function shutdownDevice_MDM_Command(udid, requester) {
  const args = '<key>RequestType</key><string>ShutDownDevice</string>';
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, 'shutdown device', requester, udid));
}

// clear passcode (iOS and iPadOS)
function clearPasscode_MDM_Command(udid, unlockToken, requester) {
  const args = `
    <key>RequestType</key>
    <string>ClearPasscode</string>
    <key>UnlockToken</key>
    <data>${unlockToken}</data>
  `;
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, 'clear passcode', requester, udid));
}

// lock device
function lockDevice_MDM_Command(udid, pin, message, phoneNumber, requester) {
  const args = `
    <key>RequestType</key>
    <string>DeviceLock</string>
    <key>PIN</key>
    <string>${pin}</string>
    <key>PhoneNumber</key>
    <string>${phoneNumber}</string>
    <key>Message</key>
    <string>${message}</string>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, `lock device with pin ${pin}`, requester, udid));
}

// erase device
function eraseDevice_MDM_Command(udid, requester) {
  const args = '<key>RequestType</key><string>EraseDevice</string>';
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, 'erase device', requester, udid));
}

// enable remote desktop (mac)
function enableRemoteDesktop_MDM_Command(udid, requester) {
  const args = '<key>RequestType</key><string>EnableRemoteDesktop</string>';
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, 'enable remote desktop', requester, udid));
  getSecurityInfo_MDM_Command(udid, requester);
}


// disable remote desktop (mac)
function disableRemoteDesktop_MDM_Command(udid, requester) {
  const args = '<key>RequestType</key><string>DisableRemoteDesktop</string>';
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, 'disable remote desktop', requester, udid));
  getSecurityInfo_MDM_Command(udid, requester);
}

// install config profile
function installConfigProfile_MDM_Command(udid, profile, profileName, requester) {
  const args = `
    <key>RequestType</key>
    <string>InstallProfile</string>
    <key>Payload</key>
    <data>${profile}</data>
  `;
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, `install profile ${profileName}`, requester, udid));
  getProfileList_MDM_Command(udid, requester);
}

// remove config profile
function removeConfigProfile_MDM_Command(udid, identifier, profileName, requester) {
  const args = `
    <key>RequestType</key>
    <string>RemoveProfile</string>
    <key>Identifier</key>
    <string>${identifier}</string>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, `remove profile ${profileName}`, requester, udid));
  getProfileList_MDM_Command(udid, requester);
}

function renameDevice_MDM_Command(udid, newName, requester) {
  const args = `
      <key>RequestType</key>
      <string>Settings</string>
      <key>Settings</key>
      <array>
          <dict>
              <key>DeviceName</key>
              <string>${newName}</string>
              <key>Item</key>
              <string>DeviceName</string>
          </dict>
      </array>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlistWithLog(args, `rename device to ${newName}`, requester, udid));
}

// send raw command to MDM server
function sendMDMCommand(udid, payload) {
  
  const config = {
    method: 'post',
    url: `${SERVER_URL}/v1/commands/${udid}`,
    headers: {
      Authorization: AUTHORIZATION,
    },
    data: payload,
  };
  axios(config)
    .then(function (response) {
      console.log('normal response');
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log('this is an error');
      console.log(error);
    });
}

export { 
  getInstalledApplications_MDM_Command, 
  getCertificateList_MDM_Command, 
  getDeviceInfo_MDM_Command, 
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
  lockDevice_MDM_Command,
  removeConfigProfile_MDM_Command,
  eraseDevice_MDM_Command
};