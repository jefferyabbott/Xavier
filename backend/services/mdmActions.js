import axios from 'axios';
import { createRawCommandPlist } from './createRawCommandPlist.js';

// mdm details
const convertedAuthToken = Buffer.from(`${process.env.MDM_USER}:${process.env.MDM_TOKEN}`).toString('base64');
const AUTHORIZATION = `Basic ${convertedAuthToken}`;
const SERVER_URL = process.env.MDM_SERVER_URL;


// update Application data
function getInstalledApplications_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>InstalledApplicationList</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// update CertificateList data
function getCertificateList_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>CertificateList</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// update Device Info (QueryResponses) data
function getDeviceInfo_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>DeviceInformation</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
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
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// update ProfileList data
function getProfileList_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>ProfileList</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// update Security data
function getSecurityInfo_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>SecurityInfo</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
}


// restart device
function restartDevice_MDM_Command(udid, notifyUser) {
  const args = `
    <key>RequestType</key>
    <string>RestartDevice</string>
    <key>NotifyUser</key>
    <${notifyUser}/>
  `.replace(/\n|\r/g, "");
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// shutdown device
function shutdownDevice_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>ShutDownDevice</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// clear passcode (iOS and iPadOS)
function clearPasscode_MDM_Command(udid, unlockToken) {
  const args = `
    <key>RequestType</key>
    <string>ClearPasscode</string>
    <key>UnlockToken</key>
    <data>${unlockToken}</data>
  `;
  sendMDMCommand(udid, createRawCommandPlist(args));
}

// enable remote desktop (mac)
function enableRemoteDesktop_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>EnableRemoteDesktop</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
  getSecurityInfo_MDM_Command(udid);
}

// disable remote desktop (mac)
function disableRemoteDesktop_MDM_Command(udid) {
  const args = '<key>RequestType</key><string>DisableRemoteDesktop</string>';
  sendMDMCommand(udid, createRawCommandPlist(args));
  getSecurityInfo_MDM_Command(udid);
}

function installConfigProfile_MDM_Command(udid, profile) {
  const args = `
    <key>RequestType</key>
    <string>InstallProfile</string>
    <key>Payload</key>
    <data>${profile}</data>
  `;
  sendMDMCommand(udid, createRawCommandPlist(args));
  getProfileList_MDM_Command(udid);
}

function renameDevice_MDM_Command(udid, newName) {
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
  sendMDMCommand(udid, createRawCommandPlist(args));
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
  shutdownDevice_MDM_Command
};