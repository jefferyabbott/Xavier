import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_IPAD } from "../queries/iPadQueries";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import AuditSymbolCompliance from "../components/AuditSymbolCompliance";
import ApplicationsTable from "../components/ApplicationsTable";
import CertificateListTable from "../components/CertificateListTable";
import ProfilesTable from "../components/ProfilesTable";
import MDMLogTable from "../components/MDMLogTable.jsx";
import { FaBolt } from "react-icons/fa";
import {
  updateDeviceInventory,
  restartDevice,
  clearPasscode,
} from "../commands/mdmCommands.js";
import RenameDeviceModal from "../components/modals/RenameDeviceModal.jsx";
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import EraseDeviceModal from "../components/modals/EraseDeviceModal.jsx";
import isAdministrator from "../utilities/checkPrivileges";
import timeSince from "../utilities/timeSince.js";

export default function IPadDetail() {
  const { SerialNumber } = useParams();
  const [activeTab, setActiveTab] = useState("Applications");

  const [showRenameDeviceModal, setShowRenameDeviceModal] = useState(false);
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);

  const hasAdminRights = isAdministrator();

  // tabs
  const applicationsTabLabel = useRef(null);
  const profilesTabLabel = useRef(null);
  const certificateListTabLabel = useRef(null);
  const mdmLogTabLabel = useRef(null);

  const allTabs = [
    applicationsTabLabel,
    profilesTabLabel,
    certificateListTabLabel,
    mdmLogTabLabel,
  ];

  function clearTabs() {
    allTabs.forEach((tab) => tab.current.classList.remove("active"));
    allTabs.forEach((tab) => tab.current.classList.add("cursor"));
  }

  function switchTab(e, target) {
    e.preventDefault();
    setActiveTab(target);
    clearTabs();
    switch (target) {
      case "Applications":
        applicationsTabLabel.current.classList.add("active");
        applicationsTabLabel.current.classList.remove("cursor");
        break;
      case "Profiles":
        profilesTabLabel.current.classList.add("active");
        profilesTabLabel.current.classList.remove("cursor");
        break;
      case "Certificates":
        certificateListTabLabel.current.classList.add("active");
        certificateListTabLabel.current.classList.remove("cursor");
        break;
      case "MDM Log":
        mdmLogTabLabel.current.classList.add("active");
        mdmLogTabLabel.current.classList.remove("cursor");
        break;
      default:
        break;
    }
  }

  function renderSelectedTab(activeTab) {
    if (activeTab === "Applications") {
      return <ApplicationsTable Applications={data.ipad.Applications} />;
    } else if (activeTab === "Profiles") {
      return (
        <ProfilesTable
          Profiles={data.ipad.Profiles}
          Administrator={hasAdminRights}
          UDID={data.ipad.UDID}
        />
      );
    } else if (activeTab === "Certificates") {
      return <CertificateListTable Certificates={data.ipad.CertificateList} />;
    } else if (activeTab === "MDM Log") {
      return <MDMLogTable DeviceUDID={data.ipad.UDID} />;
    }
  }

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

  const lastCheckin = timeSince(new Date(Number(data.ipad.updatedAt)));

  return (
    <>
      {!loading && !error && (
        <main className='container overflow-hidden main-content'>
          <div className='header'>
            <div>
              <h1>{data.ipad.QueryResponses.DeviceName}</h1>
              <h6>
                Last seen{" "}
                {lastCheckin === "0 second" ? "just now" : lastCheckin}
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
          <ul className='nav nav-tabs'>
            <li className='nav-item'>
              <a
                className='nav-link active tabText'
                aria-current='page'
                ref={applicationsTabLabel}
                onClick={(e) => {
                  switchTab(e, "Applications");
                }}
              >
                Applications
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link cursor tabText'
                ref={profilesTabLabel}
                onClick={(e) => {
                  switchTab(e, "Profiles");
                }}
              >
                Profiles
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link cursor tabText'
                ref={certificateListTabLabel}
                onClick={(e) => {
                  switchTab(e, "Certificates");
                }}
              >
                Certificates
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link cursor tabText'
                ref={mdmLogTabLabel}
                onClick={(e) => {
                  switchTab(e, "MDM Log");
                }}
              >
                MDM Log
              </a>
            </li>
          </ul>

          <div>{renderSelectedTab(activeTab)}</div>
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
