import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FaBolt } from "react-icons/fa";
import Spinner from "./Spinner";
import NotFound from "../pages/NotFound";
import AuditSymbolCompliance from "./AuditSymbolCompliance";
import DetailTabs from "../components/DetailTabs";
import isAdministrator from "../utilities/checkPrivileges";
import timeSince from "../utilities/timeSince.js";

/**
 * Renders the header section of the device detail page
 */
const DeviceHeader = ({ deviceName, lastCheckin, showActions, actionButtons, device }) => (
  <div className='header'>
    <div>
      <h1>{deviceName}</h1>
      <h6>Last seen {lastCheckin}</h6>
    </div>
    {showActions && (
      <div className='dropdown'>
        <button
          className='btn dropdown-toggle'
          type='button'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          <FaBolt />
        </button>
        <ul className='dropdown-menu hide'>
          {actionButtons.map((action, index) => (
            <li key={index}>
              <button
                className='dropdown-item'
                onClick={() => action.onClick(device)}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

/**
 * Renders a section of device information in a table format
 */
const DeviceInfoSection = ({ title, data }) => (
  <div className='col col-sm-12 col-md-6 col-xl-4'>
    <h5>{title}</h5>
    <div className='p-3 border bg-light'>
      <table className='table'>
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            if (value === undefined) return null;
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {typeof value === 'boolean' ? (
                    <AuditSymbolCompliance status={value} />
                  ) : (
                    value
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * Base component for device detail pages (Mac, iPhone, iPad)
 * @param {Object} props
 * @param {Object} props.query - GraphQL query for fetching device data
 * @param {string} props.deviceType - Type of device ('mac', 'iphone', 'ipad')
 * @param {Function} props.getDeviceData - Function to extract device data from query response
 * @param {Array} props.actionButtons - Array of action button configurations
 * @param {Function} props.renderModals - Function to render device-specific modals
 * @param {Array} props.infoSections - Array of info section configurations
 */
export const DeviceDetailBase = ({ 
  query, 
  deviceType,
  getDeviceData,
  actionButtons,
  renderModals,
  infoSections 
}) => {
  const { SerialNumber } = useParams();
  
  const { loading, error, data } = useQuery(query, {
    variables: { SerialNumber },
  });

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  const device = getDeviceData(data);
  const lastCheckin = timeSince(device.updatedAt);

  return (
    <>
      {!loading && !error && (
        <main className='container overflow-hidden main-content'>
          <DeviceHeader 
            deviceName={device.QueryResponses.DeviceName}
            lastCheckin={lastCheckin}
            showActions={device.mdmProfileInstalled && isAdministrator()}
            actionButtons={actionButtons}
            device={device}
          />

          <div className='row gx-5'>
            {infoSections.map((section, index) => (
              <DeviceInfoSection
                key={index}
                title={section.title}
                data={section.getData(device)}
              />
            ))}
          </div>

          <hr />
          <DetailTabs device={device} />
          {renderModals && renderModals(device)}
        </main>
      )}
    </>
  );
};

/**
 * Utility function to calculate storage percentage
 */
export const calculateStoragePercentage = (device) => {
  return `${Math.round(
    (device.QueryResponses.AvailableDeviceCapacity /
      device.QueryResponses.DeviceCapacity) *
      100
  )}% free of ${device.QueryResponses.DeviceCapacity} GB`;
};

/**
 * Utility function to format MAC addresses
 */
export const formatMacAddress = (mac) => {
  return mac ? mac.toUpperCase() : undefined;
};

export default DeviceDetailBase;
