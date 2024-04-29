import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_MAC } from "../queries/macQueries";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import AuditSymbolCompliance from "../components/AuditSymbolCompliance";
import SoftwareUpdatesTable from "../components/SoftwareUpdatesTable.jsx";
import ApplicationsTable from "../components/ApplicationsTable";
import CertificateListTable from "../components/CertificateListTable";
import ProfilesTable from "../components/ProfilesTable";
import MDMLogTable from "../components/MDMLogTable.jsx";
import { FaBolt } from "react-icons/fa";
import {
  enableRemoteDesktop,
  disableRemoteDesktop,
  updateDeviceInventory,
  getAvailableSoftwareUpdates,
} from "../commands/mdmCommands.js";
import RestartDeviceModal from "../components/modals/RestartDeviceModal.jsx";
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import RenameDeviceModal from "../components/modals/RenameDeviceModal.jsx";
import ShutdownDeviceModal from "../components/modals/ShutdownDeviceModal.jsx";
import LockDeviceModal from "../components/modals/LockDeviceModal.jsx";
import EraseDeviceModal from "../components/modals/EraseDeviceModal.jsx";
import PinHistoryTable from "../components/PinHistoryTable.jsx";
import isAdministrator from "../utilities/checkPrivileges";
import timeSince from "../utilities/timeSince.js";

export default function MacDetail() {

  let softwareUpdates = 0;

  const { SerialNumber } = useParams();
  const [activeTab, setActiveTab] = useState("Applications");
  const [showRestartDeviceModal, setShowRestartDeviceModal] = useState(false);
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showRenameDeviceModal, setShowRenameDeviceModal] = useState(false);
  const [showShutdownDeviceModal, setShowShutdownDeviceModal] = useState(false);
  const [showLockDeviceModal, setShowLockDeviceModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);
  const [showPinHistory, setShowPinHistory] = useState(false);
  const [numberOfSoftwareUpdates, setNumberOfSoftwareUpdates] = useState(softwareUpdates);
  const hasAdminRights = isAdministrator();

  // tabs
  const softwareUpdatesTabLabel = useRef(null);
  const applicationsTabLabel = useRef(null);
  const profilesTabLabel = useRef(null);
  const certificateListTabLabel = useRef(null);
  const mdmLogTabLabel = useRef(null);

  const allTabs = [
    softwareUpdatesTabLabel,
    applicationsTabLabel,
    profilesTabLabel,
    certificateListTabLabel,
    mdmLogTabLabel,
  ];
 
  useEffect(() => {
    if (softwareUpdates > 0 && numberOfSoftwareUpdates !== softwareUpdates) {
      setNumberOfSoftwareUpdates(softwareUpdates);
    }
    if (numberOfSoftwareUpdates > 0) {
      setActiveTab("Software Updates");
    }
  }, [softwareUpdates, numberOfSoftwareUpdates]);

  function clearTabs() {
    allTabs.forEach((tab) => tab.current.classList.remove("active"));
    allTabs.forEach((tab) => tab.current.classList.add("cursor"));
  }

  function switchTab(e, target) {
    e.preventDefault();
    setActiveTab(target);
    clearTabs();
    switch (target) {
      case "Software Updates":
        softwareUpdatesTabLabel.current.classList.add("active");
        softwareUpdatesTabLabel.current.classList.remove("cursor");
        break;
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
    if (activeTab === "Software Updates") {
      return <SoftwareUpdatesTable Updates={data.mac.AvailableSoftwareUpdates} />;
    } else if (activeTab === "Applications") {
      return <ApplicationsTable Applications={data.mac.Applications} />;
    } else if (activeTab === "Profiles") {
      return (
        <ProfilesTable
          Profiles={data.mac.Profiles}
          Administrator={hasAdminRights}
          UDID={data.mac.UDID}
        />
      );
    } else if (activeTab === "Certificates") {
      return <CertificateListTable Certificates={data.mac.CertificateList} />;
    } else if (activeTab === "MDM Log") {
      return <MDMLogTable DeviceUDID={data.mac.UDID} />;
    }
  }

  function displayRestartDeviceModal() {
    setShowRestartDeviceModal(true);
  }

  function hideRestartDeviceModal() {
    setShowRestartDeviceModal(false);
  }

  function displayInstallProfileModal() {
    setShowInstallProfileModal(true);
  }

  function hideInstallProfileModal() {
    setShowInstallProfileModal(false);
  }

  function displayRenameDeviceModal() {
    setShowRenameDeviceModal(true);
  }

  function hideRenameDeviceModal() {
    setShowRenameDeviceModal(false);
  }

  function displayShutdownDeviceModal() {
    setShowShutdownDeviceModal(true);
  }

  function hideShutdownDeviceModal() {
    setShowShutdownDeviceModal(false);
  }

  function displayLockDeviceModal() {
    setShowLockDeviceModal(true);
  }

  function hideLockDeviceModal() {
    setShowLockDeviceModal(false);
  }

  function displayEraseDeviceModal() {
    setShowEraseDeviceModal(true);
  }

  function hideEraseDeviceModal() {
    setShowEraseDeviceModal(false);
  }

  function hideShowPinHistoryTable() {
    setShowPinHistory(false);
  }

  const { loading, error, data } = useQuery(GET_MAC, {
    variables: { SerialNumber },
  });

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  const lastCheckin = timeSince(new Date(Number(data.mac.updatedAt)));

  if (data.mac.AvailableSoftwareUpdates.length > 0) {
    softwareUpdates = data.mac.AvailableSoftwareUpdates.length;
  }

  return (
    <>
      {!loading && !error && (
        <main>
          <div className='header'>
            <div>
              <h1>{data.mac.QueryResponses.DeviceName}</h1>
              <h6>
                Last seen{" "}
                {lastCheckin === "0 second" ? "just now" : lastCheckin}
              </h6>
            </div>

            {/* <h6>{data.mac.modelYear}</h6> */}

            {/* conditionally render MDM actions dropdown if MDM profile is installed */}
            <div>
              {(() => {
                if (data.mac.mdmProfileInstalled && isAdministrator()) {
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
                            onClick={() =>
                              getAvailableSoftwareUpdates(data.mac.UDID)
                            }
                          >
                            Check for available software updates
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
                          <button
                            className='dropdown-item'
                            onClick={displayLockDeviceModal}
                          >
                            Lock Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() =>
                              data.mac.SecurityInfo.RemoteDesktopEnabled
                                ? disableRemoteDesktop(data.mac.UDID)
                                : enableRemoteDesktop(data.mac.UDID)
                            }
                          >
                            {data.mac.SecurityInfo.RemoteDesktopEnabled
                              ? "Disable"
                              : "Enable"}{" "}
                            Remote Desktop
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={displayRestartDeviceModal}
                          >
                            Restart Device
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
                            onClick={displayShutdownDeviceModal}
                          >
                            Shutdown Device
                          </button>
                        </li>
                        <li>
                          <button
                            className='dropdown-item'
                            onClick={() =>
                              updateDeviceInventory("mac", data.mac.UDID)
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
            <div className='col col-sm-12 col-md-6 col-xl-4'>
              <h5>hardware</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>serial number</td>
                      <td>{data.mac.SerialNumber}</td>
                    </tr>

                    <tr>
                      <td>architecture</td>
                      <td>
                        {data.mac.QueryResponses.IsAppleSilicon
                          ? "Apple Silicon"
                          : "Intel"}
                      </td>
                    </tr>

                    <tr>
                      <td>product name</td>
                      <td>{data.mac.QueryResponses.ProductName}</td>
                    </tr>
                    <tr>
                      <td>model number</td>
                      <td>{data.mac.QueryResponses.ModelNumber}</td>
                    </tr>
                    <tr>
                      <td>storage</td>
                      <td>
                        {Math.round(
                          (data.mac.QueryResponses.AvailableDeviceCapacity /
                            data.mac.QueryResponses.DeviceCapacity) *
                            100
                        )}
                        % free of {data.mac.QueryResponses.DeviceCapacity} GB
                      </td>
                    </tr>

                    <tr>
                      <td>enrolled via DEP</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.SecurityInfo.EnrolledViaDEP}
                          />
                        }
                      </td>
                    </tr>

                    <tr>
                      <td>FileVault encryption</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.SecurityInfo.FDE_Enabled}
                          />
                        }
                      </td>
                    </tr>

                    {data.mac.unlockPins && data.mac.unlockPins.length > 0 && (
                      <tr>
                        <td>unlock PIN</td>
                        {showPinHistory ? (
                          <PinHistoryTable
                            data={data.mac.unlockPins}
                            hideShowPinHistoryTable={hideShowPinHistoryTable}
                          />
                        ) : (
                          <div onClick={() => setShowPinHistory(true)}>
                            click to view
                          </div>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='col col-sm-12 col-md-6 col-xl-4'>
              <h5>network</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>hostname</td>
                      <td>{data.mac.QueryResponses.HostName}</td>
                    </tr>
                    <tr>
                      <td>local hostname</td>
                      <td>{data.mac.QueryResponses.LocalHostName}</td>
                    </tr>

                    {data.mac.QueryResponses.WiFiMAC && (
                      <tr>
                        <td>WiFi MAC address</td>
                        <td>{data.mac.QueryResponses.WiFiMAC.toUpperCase()}</td>
                      </tr>
                    )}
                    {data.mac.QueryResponses.EthernetMAC && (
                      <tr>
                        <td>ethernet MAC address</td>
                        <td>
                          {data.mac.QueryResponses.EthernetMAC.toUpperCase()}
                        </td>
                      </tr>
                    )}
                    {data.mac.QueryResponses.BluetoothMAC && (
                      <tr>
                        <td>bluetooth MAC address</td>
                        <td>
                          {data.mac.QueryResponses.BluetoothMAC.toUpperCase()}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>firewall</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.SecurityInfo.FirewallEnabled}
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>firewall: block all incoming traffic</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.SecurityInfo.BlockAllIncoming}
                          />
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='col col-sm-12 col-md-6 col-xl-4'>
              <h5>operating system</h5>
              <div className='p-3 border bg-light'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <td>macOS version</td>
                      <td>{data.mac.QueryResponses.OSVersion}</td>
                    </tr>

                    <tr>
                      <td>build version</td>
                      <td>{data.mac.QueryResponses.BuildVersion}</td>
                    </tr>
                    <tr>
                      <td>MDM profile installed</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.mdmProfileInstalled}
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>SIP enabled</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses
                                .SystemIntegrityProtectionEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>supervised</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.QueryResponses.IsSupervised}
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>check for updates</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses.OSUpdateSettings
                                .AutoCheckEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>download updates in background</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses.OSUpdateSettings
                                .BackgroundDownloadEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>install macOS updates</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses.OSUpdateSettings
                                .AutomaticOSInstallationEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>install App Store updates</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses.OSUpdateSettings
                                .AutomaticAppInstallationEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>install security updates</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={
                              data.mac.QueryResponses.OSUpdateSettings
                                .AutomaticSecurityUpdatesEnabled
                            }
                          />
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>remote desktop</td>
                      <td>
                        {
                          <AuditSymbolCompliance
                            status={data.mac.SecurityInfo.RemoteDesktopEnabled}
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
            { numberOfSoftwareUpdates > 0 && (
              <>
               <li className='nav-item'>
               <a
                 className='nav-link active tabText'
                 aria-current='page'
                 ref={softwareUpdatesTabLabel}
                 onClick={(e) => {
                   switchTab(e, "Software Updates");
                 }}
               >
                 Software Updates <span className="badge text-bg-danger" style={{color: "red"}}>{numberOfSoftwareUpdates}</span>
               </a>
             </li>
             

             <li className='nav-item'>
              <a
                className='nav-link cursor tabText'
                aria-current='page'
                ref={applicationsTabLabel}
                onClick={(e) => {
                  switchTab(e, "Applications");
                }}
              >
                Applications
              </a>
            </li>
             </>
            )}

            { numberOfSoftwareUpdates === 0 && (
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
            )}
            
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
          {showRestartDeviceModal ? (
            <RestartDeviceModal
              visible={showRestartDeviceModal}
              UDID={data.mac.UDID}
              hideRestartDeviceModal={hideRestartDeviceModal}
            />
          ) : null}
          {showInstallProfileModal ? (
            <InstallProfileModal
              visible={showInstallProfileModal}
              UDID={data.mac.UDID}
              currentProfiles={data.mac.Profiles}
              configProfiles={data.configProfiles}
              hideInstallProfileModal={hideInstallProfileModal}
            />
          ) : null}
          {showRenameDeviceModal ? (
            <RenameDeviceModal
              visible={showRenameDeviceModal}
              UDID={data.mac.UDID}
              platform='macOS'
              oldName={data.mac.QueryResponses.DeviceName}
              hideRenameDeviceModal={hideRenameDeviceModal}
            />
          ) : null}
          {showShutdownDeviceModal ? (
            <ShutdownDeviceModal
              visible={showShutdownDeviceModal}
              UDID={data.mac.UDID}
              hideShutdownDeviceModal={hideShutdownDeviceModal}
            />
          ) : null}
          {showLockDeviceModal ? (
            <LockDeviceModal
              visible={showLockDeviceModal}
              UDID={data.mac.UDID}
              hideLockDeviceModal={hideLockDeviceModal}
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
