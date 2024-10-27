import React, { useState } from "react";
import { GET_MAC } from "../queries/macQueries";
import DeviceDetailBase from "../components/DeviceDetailBase";
import {
  enableRemoteDesktop,
  disableRemoteDesktop,
  updateDeviceInventory,
  getAvailableSoftwareUpdates,
} from "../commands/mdmCommands.js";
import RestartDeviceModal from '../components/modals/RestartDeviceModal.jsx';
import InstallProfileModal from '../components/modals/InstallProfileModal.jsx';
import RenameDeviceModal from '../components/modals/RenameDeviceModal.jsx';
import ShutdownDeviceModal from '../components/modals/ShutdownDeviceModal.jsx';
import LockDeviceModal from '../components/modals/LockDeviceModal.jsx';
import EraseDeviceModal from '../components/modals/EraseDeviceModal.jsx';
import PinHistoryTable from "../components/PinHistoryTable.jsx";
import { calculateStoragePercentage, formatMacAddress } from '../components/DeviceDetailBase';

export default function MacDetail() {
  const [showRestartDeviceModal, setShowRestartDeviceModal] = useState(false);
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showRenameDeviceModal, setShowRenameDeviceModal] = useState(false);
  const [showShutdownDeviceModal, setShowShutdownDeviceModal] = useState(false);
  const [showLockDeviceModal, setShowLockDeviceModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);
  const [showPinHistory, setShowPinHistory] = useState(false);

  const actionButtons = [
    {
      label: "Check for available software updates",
      onClick: (device) => getAvailableSoftwareUpdates(device.UDID),
    },
    {
      label: "Erase Device",
      onClick: () => setShowEraseDeviceModal(true),
    },
    {
      label: "Install Profile",
      onClick: () => setShowInstallProfileModal(true),
    },
    {
      label: "Lock Device",
      onClick: () => setShowLockDeviceModal(true),
    },
    {
      label: "Remote Desktop",
      onClick: (device) => device.SecurityInfo.RemoteDesktopEnabled
        ? disableRemoteDesktop(device.UDID)
        : enableRemoteDesktop(device.UDID),
      getLabel: (device) => `${device.SecurityInfo.RemoteDesktopEnabled ? "Disable" : "Enable"} Remote Desktop`
    },
    {
      label: "Restart Device",
      onClick: () => setShowRestartDeviceModal(true),
    },
    {
      label: "Rename Device",
      onClick: () => setShowRenameDeviceModal(true),
    },
    {
      label: "Shutdown Device",
      onClick: () => setShowShutdownDeviceModal(true),
    },
    {
      label: "Update Device Inventory",
      onClick: (device) => updateDeviceInventory("mac", device.UDID),
    },
  ];

  const infoSections = [
    {
      title: 'hardware',
      getData: (device) => ({
        "serial number": device.SerialNumber,
        "architecture": device.QueryResponses.IsAppleSilicon ? "Apple Silicon" : "Intel",
        "product name": device.QueryResponses.ProductName,
        "model number": device.QueryResponses.ModelNumber,
        "storage": calculateStoragePercentage(device),
        "enrolled via DEP": device.SecurityInfo.EnrolledViaDEP,
        "FileVault encryption": device.SecurityInfo.FDE_Enabled,
        ...(device.unlockPins?.length > 0 && {
          "unlock PIN": showPinHistory ? (
            <PinHistoryTable
              data={device.unlockPins}
              hideShowPinHistoryTable={() => setShowPinHistory(false)}
            />
          ) : (
            <div onClick={() => setShowPinHistory(true)}>click to view</div>
          )
        })
      })
    },
    {
      title: 'network',
      getData: (device) => ({
        "hostname": device.QueryResponses.HostName,
        "local hostname": device.QueryResponses.LocalHostName,
        "WiFi MAC address": formatMacAddress(device.QueryResponses.WiFiMAC),
        "ethernet MAC address": formatMacAddress(device.QueryResponses.EthernetMAC),
        "bluetooth MAC address": formatMacAddress(device.QueryResponses.BluetoothMAC),
        "firewall": device.SecurityInfo.FirewallEnabled,
        "firewall: block all incoming traffic": device.SecurityInfo.BlockAllIncoming,
      })
    },
    {
      title: 'operating system',
      getData: (device) => ({
        "macOS version": device.QueryResponses.OSVersion,
        "build version": device.QueryResponses.BuildVersion,
        "MDM profile installed": device.mdmProfileInstalled,
        "SIP enabled": device.QueryResponses.SystemIntegrityProtectionEnabled,
        "supervised": device.QueryResponses.IsSupervised,
        "check for updates": device.QueryResponses.OSUpdateSettings.AutoCheckEnabled,
        "download updates in background": device.QueryResponses.OSUpdateSettings.BackgroundDownloadEnabled,
        "install macOS updates": device.QueryResponses.OSUpdateSettings.AutomaticOSInstallationEnabled,
        "install App Store updates": device.QueryResponses.OSUpdateSettings.AutomaticAppInstallationEnabled,
        "install security updates": device.QueryResponses.OSUpdateSettings.AutomaticSecurityUpdatesEnabled,
        "remote desktop": device.SecurityInfo.RemoteDesktopEnabled,
      })
    },
  ];

  const renderModals = (device) => (
    <>
      {showRestartDeviceModal && (
        <RestartDeviceModal
          visible={showRestartDeviceModal}
          UDID={device.UDID}
          hideRestartDeviceModal={() => setShowRestartDeviceModal(false)}
        />
      )}
      {showInstallProfileModal && (
        <InstallProfileModal
          visible={showInstallProfileModal}
          UDID={device.UDID}
          currentProfiles={device.Profiles}
          configProfiles={device.configProfiles}
          hideInstallProfileModal={() => setShowInstallProfileModal(false)}
        />
      )}
      {showRenameDeviceModal && (
        <RenameDeviceModal
          visible={showRenameDeviceModal}
          UDID={device.UDID}
          platform='macOS'
          oldName={device.QueryResponses.DeviceName}
          hideRenameDeviceModal={() => setShowRenameDeviceModal(false)}
        />
      )}
      {showShutdownDeviceModal && (
        <ShutdownDeviceModal
          visible={showShutdownDeviceModal}
          UDID={device.UDID}
          hideShutdownDeviceModal={() => setShowShutdownDeviceModal(false)}
        />
      )}
      {showLockDeviceModal && (
        <LockDeviceModal
          visible={showLockDeviceModal}
          UDID={device.UDID}
          hideLockDeviceModal={() => setShowLockDeviceModal(false)}
        />
      )}
      {showEraseDeviceModal && (
        <EraseDeviceModal
          visible={showEraseDeviceModal}
          UDID={device.UDID}
          hideEraseDeviceModal={() => setShowEraseDeviceModal(false)}
        />
      )}
    </>
  );

  return (
    <DeviceDetailBase
      query={GET_MAC}
      deviceType="mac"
      getDeviceData={(data) => data.mac}
      actionButtons={actionButtons}
      renderModals={renderModals}
      infoSections={infoSections}
    />
  );
}
