import React, { useState } from "react";
import { GET_IPHONE } from "../queries/iPhoneQueries";
import DeviceDetailBase from "../components/DeviceDetailBase";
import {
  updateDeviceInventory,
  restartDevice,
  clearPasscode,
} from "../commands/mdmCommands.js";
import InstallProfileModal from '../components/modals/InstallProfileModal.jsx';
import EraseDeviceModal from '../components/modals/EraseDeviceModal.jsx';
import { calculateStoragePercentage, formatMacAddress } from '../components/DeviceDetailBase';

export default function IPhoneDetail() {
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);

  const actionButtons = [
    {
      label: "Clear Passcode",
      onClick: (device) => clearPasscode(device.UDID, "iOS"),
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
      onClick: () => {}, // TODO: Implement lock device
    },
    {
      label: "Restart Device",
      onClick: (device) => restartDevice(device.UDID),
    },
    {
      label: "Update Device Inventory",
      onClick: (device) => updateDeviceInventory("ios", device.UDID),
    },
  ];

  const infoSections = [
    {
      title: 'hardware',
      getData: (device) => ({
        "serial number": device.SerialNumber,
        "product name": device.QueryResponses.ProductName,
        "model number": device.QueryResponses.ModelNumber,
        "storage": calculateStoragePercentage(device),
      })
    },
    {
      title: 'network',
      getData: (device) => ({
        "Cellular Network": device.QueryResponses.ServiceSubscriptions[0].SubscriberCarrierNetwork,
        "Phone Number": device.QueryResponses.ServiceSubscriptions[0].PhoneNumber,
        "IMEI": device.QueryResponses.ServiceSubscriptions[0].IMEI,
        "WiFi MAC address": formatMacAddress(device.QueryResponses.WiFiMAC),
        "bluetooth MAC address": formatMacAddress(device.QueryResponses.BluetoothMAC),
      })
    },
    {
      title: 'operating system',
      getData: (device) => ({
        "iOS version": device.QueryResponses.OSVersion,
        "build version": device.QueryResponses.BuildVersion,
        "MDM profile installed": device.mdmProfileInstalled,
        "supervised": device.QueryResponses.IsSupervised,
      })
    },
  ];

  const renderModals = (device) => (
    <>
      {showInstallProfileModal && (
        <InstallProfileModal
          visible={showInstallProfileModal}
          UDID={device.UDID}
          currentProfiles={device.Profiles}
          configProfiles={device.configProfiles}
          hideInstallProfileModal={() => setShowInstallProfileModal(false)}
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
      query={GET_IPHONE}
      deviceType="iphone"
      getDeviceData={(data) => data.iphone}
      actionButtons={actionButtons}
      renderModals={renderModals}
      infoSections={infoSections}
    />
  );
}
