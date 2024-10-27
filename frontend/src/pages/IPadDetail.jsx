import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_IPAD } from "../queries/iPadQueries";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import AuditSymbolCompliance from "../components/AuditSymbolCompliance";
import { FaBolt } from "react-icons/fa";
import {
  updateDeviceInventory,
  restartDevice,
  clearPasscode,
} from "../commands/mdmCommands.js";
import DetailTabs from "../components/DetailTabs.jsx";
import RenameDeviceModal from "../components/modals/RenameDeviceModal.jsx";
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import EraseDeviceModal from "../components/modals/EraseDeviceModal.jsx";
import isAdministrator from "../utilities/checkPrivileges";
import timeSince from "../utilities/timeSince.js";

export default function IPadDetail() {
  const { SerialNumber } = useParams();
  const [showRenameDeviceModal, setShowRenameDeviceModal] = useState(false);
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);

  function displayRenameDeviceModal() {
    setShowRenameDeviceModal(true);
  }

  function hideRenameDeviceModal() {
    setShowRenameDeviceModal(false);
  }

  function displayInstallProfileModal() {
    setShowInstallProfileModal(true);
  }

  function hideInstallProfileModal() {
    setShowInstallProfileModal(false);
  }

  function displayEraseDeviceModal() {
    setShowEraseDeviceModal(true);
  }

  function hideEraseDeviceModal() {
    setShowEraseDeviceModal(false);
  }

  const { loading, error, data } = useQuery(GET_IPAD, {
    variables: { SerialNumber },
  });

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  const lastCheckin = timeSince(data.ipad.updatedAt);

  return (
    <>
      {!loading && !error && (
        <main className='container overflow-hidden main-content'>
          <div className='header'>
            <div>
              <h1>{data.ipad.QueryResponses.DeviceName}</h1>
              <h6>
                Last seen{" "}
                {lastCheckin}
              </h6>
            </div>

            {/* <h6>{data.ipad.modelYear}</h6> */}

            {/* conditionally render MDM actions dropdown if MDM profile is installed */}
            <div>
              {(() => {
                if (data.ipad.mdmProfileInstalled && isAdministrator()) {
                  return (
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
                        <li>
                          <button
                            className='dropdown-item'
                            href='#'
                            onClick={() =>
                              clearPasscode(data.ipad.UDID, "iPadOS")
                            }
                          >
                            Clear Passcode
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={displayEraseDeviceModal}
                          >
                            Erase Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            href='#'
                            onClick={displayInstallProfileModal}
                          >
                            Install Profile
                          </button>
                        </li>
                        <li>
                          <button className='dropdown-item' href='#'>
                            Lock Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={displayRenameDeviceModal}
                          >
                            Rename Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() => restartDevice(data.ipad.UDID)}
                          >
                            Restart Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() =>
                              updateDeviceInventory("ios", data.ipad.UDID)
                            }
                          >
                            Update Device Inventory
                          </button>
                        </li>
                      </ul>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          <div className='row gx-5'>
            <div className='col'>
              <h5>hardware</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>serial number</td>
                      <td>{data.ipad.SerialNumber}</td>
                    </tr>

                    <tr>
                      <td>product name</td>
                      <td>{data.ipad.QueryResponses.ProductName}</td>
                    </tr>
                    {/* <tr>
                        <td>model number</td>
                        <td>{data.ipad.QueryResponses.ModelNumber}</td>
                    </tr> */}
                    <tr>
                      <td>storage</td>
                      <td>
                        {Math.round(
                          (data.ipad.QueryResponses.AvailableDeviceCapacity /
                            data.ipad.QueryResponses.DeviceCapacity) *
                            100
                        )}
                        % free of {data.ipad.QueryResponses.DeviceCapacity} GB
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='col'>
              <h5>network</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    {data.ipad.QueryResponses.WiFiMAC && (
                      <tr>
                        <td>WiFi MAC address</td>
                        <td>
                          {data.ipad.QueryResponses.WiFiMAC.toUpperCase()}
                        </td>
                      </tr>
                    )}
                    {data.ipad.QueryResponses.BluetoothMAC && (
                      <tr>
                        <td>bluetooth MAC address</td>
                        <td>
                          {data.ipad.QueryResponses.BluetoothMAC.toUpperCase()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='col'>
              <h5>operating system</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>iPadOS version</td>
                      <td>{data.ipad.QueryResponses.OSVersion}</td>
                    </tr>
                    <tr>
                      <td>build version</td>
                      <td>{data.ipad.QueryResponses.BuildVersion}</td>
                    </tr>
                    <tr>
                      <td>MDM profile installed</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.ipad.mdmProfileInstalled}
                          />
                        }
                      </td>
                    </tr>

                    <tr>
                      <td>supervised</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.ipad.QueryResponses.IsSupervised}
                          />
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr />

          {/* tab controller */}
          <DetailTabs device={data.ipad}/>
          
          {showRenameDeviceModal ? (
            <RenameDeviceModal
              visible={showRenameDeviceModal}
              UDID={data.ipad.UDID}
              platform='iPadOS'
              oldName={data.ipad.QueryResponses.DeviceName}
              hideRenameDeviceModal={hideRenameDeviceModal}
            />
          ) : null}
          {showInstallProfileModal ? (
            <InstallProfileModal
              visible={showInstallProfileModal}
              UDID={data.ipad.UDID}
              currentProfiles={data.ipad.Profiles}
              configProfiles={data.configProfiles}
              hideInstallProfileModal={hideInstallProfileModal}
            />
          ) : null}
          {showEraseDeviceModal ? (
            <EraseDeviceModal
              visible={showEraseDeviceModal}
              UDID={data.ipad.UDID}
              hideEraseDeviceModal={hideEraseDeviceModal}
            />
          ) : null}
        </main>
      )}
    </>
  );
}
