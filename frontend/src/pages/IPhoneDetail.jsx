import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_IPHONE } from "../queries/iPhoneQueries";
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
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import EraseDeviceModal from "../components/modals/EraseDeviceModal.jsx";
import isAdministrator from "../utilities/checkPrivileges";
import timeSince from "../utilities/timeSince.js";

export default function IPhoneDetail() {
  const { SerialNumber } = useParams();
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);

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

  const { loading, error, data } = useQuery(GET_IPHONE, {
    variables: { SerialNumber },
  });

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  const lastCheckin = timeSince(new Date(Number(data.iphone.updatedAt)));


  return (
    <>
      {!loading && !error && (
        <main className='container overflow-hidden main-content'>
          <div className='header'>
            <div>
              <h1>{data.iphone.QueryResponses.DeviceName}</h1>
              <h6>
                Last seen{" "}
                {lastCheckin === "0 second" ? "just now" : lastCheckin}
              </h6>
            </div>
            {/* <h6>{data.iphone.modelYear}</h6> */}

            {/* conditionally render MDM actions dropdown if MDM profile is installed */}
            <div>
              {(() => {
                if (data.iphone.mdmProfileInstalled && isAdministrator()) {
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
                              clearPasscode(data.iphone.UDID, "iOS")
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
                            onClick={() => restartDevice(data.iphone.UDID)}
                          >
                            Restart Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() =>
                              updateDeviceInventory("ios", data.iphone.UDID)
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
                      <td>{data.iphone.SerialNumber}</td>
                    </tr>
                    <tr>
                      <td>product name</td>
                      <td>{data.iphone.QueryResponses.ProductName}</td>
                    </tr>
                    <tr>
                      <td>model number</td>
                      <td>{data.iphone.QueryResponses.ModelNumber}</td>
                    </tr>
                    <tr>
                      <td>storage</td>
                      <td>
                        {Math.round(
                          (data.iphone.QueryResponses.AvailableDeviceCapacity /
                            data.iphone.QueryResponses.DeviceCapacity) *
                            100
                        )}
                        % free of {data.iphone.QueryResponses.DeviceCapacity} GB
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
                  <tr>
                    <td>Celluar Network</td>
                    <td>
                      {data.iphone.QueryResponses.ServiceSubscriptions[0].SubscriberCarrierNetwork}
                    </td>
                  </tr>
                  <tr>
                    <td>Phone Number</td>
                    <td>
                      {data.iphone.QueryResponses.ServiceSubscriptions[0].PhoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      IMEI
                    </td>
                    <td>
                      {data.iphone.QueryResponses.ServiceSubscriptions[0].IMEI}
                    </td>
                  </tr>
                    {data.iphone.QueryResponses.WiFiMAC && (
                      <tr>
                        <td>WiFi MAC address</td>
                        <td>
                          {data.iphone.QueryResponses.WiFiMAC.toUpperCase()}
                        </td>
                      </tr>
                    )}
                    {data.iphone.QueryResponses.BluetoothMAC && (
                      <tr>
                        <td>bluetooth MAC address</td>
                        <td>
                          {data.iphone.QueryResponses.BluetoothMAC.toUpperCase()}
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
                      <td>iOS version</td>
                      <td>{data.iphone.QueryResponses.OSVersion}</td>
                    </tr>
                    <tr>
                      <td>build version</td>
                      <td>{data.iphone.QueryResponses.BuildVersion}</td>
                    </tr>
                    <tr>
                      <td>MDM profile installed</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.iphone.mdmProfileInstalled}
                          />
                        }
                      </td>
                    </tr>

                    <tr>
                      <td>supervised</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.iphone.QueryResponses.IsSupervised}
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
          <DetailTabs device={data.iphone}/>
          
          {showInstallProfileModal ? (
            <InstallProfileModal
              visible={showInstallProfileModal}
              UDID={data.iphone.UDID}
              currentProfiles={data.iphone.Profiles}
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
