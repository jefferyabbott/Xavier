import React, { useState, useRef } from "react";
import SoftwareUpdatesTable from "./SoftwareUpdatesTable.jsx";
import ApplicationsTable from "./ApplicationsTable.jsx";
import CertificateListTable from "./CertificateListTable.jsx";
import ProfilesTable from "./ProfilesTable.jsx";
import MDMLogTable from "./MDMLogTable.jsx";
import isAdministrator from "../utilities/checkPrivileges.js";


export default function DetailTabs({device}) {

    const numberOfSoftwareUpdates = device.AvailableSoftwareUpdates ? device.AvailableSoftwareUpdates.length : 0;
    const hasAdminRights = isAdministrator();

    const [activeTab, setActiveTab] = useState("Applications");


    // tabs
  const softwareUpdatesTabLabel = useRef(null);
  const applicationsTabLabel = useRef(null);
  const profilesTabLabel = useRef(null);
  const certificateListTabLabel = useRef(null);
  const mdmLogTabLabel = useRef(null);

  const allTabs = numberOfSoftwareUpdates > 0 ? [
    softwareUpdatesTabLabel,
    applicationsTabLabel,
    profilesTabLabel,
    certificateListTabLabel,
    mdmLogTabLabel,
  ] :
  [
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
      return <SoftwareUpdatesTable Updates={device.AvailableSoftwareUpdates} />;
    } else if (activeTab === "Applications") {
      return <ApplicationsTable Applications={device.Applications} />;
    } else if (activeTab === "Profiles") {
      return (
        <ProfilesTable
          Profiles={device.Profiles}
          Administrator={hasAdminRights}
          UDID={device.UDID}
        />
      );
    } else if (activeTab === "Certificates") {
      return <CertificateListTable Certificates={device.CertificateList} />;
    } else if (activeTab === "MDM Log") {
      return <MDMLogTable DeviceUDID={device.UDID} />;
    }
  }

  return (
    <>
    
    <ul className='nav nav-tabs'>
  
              <li className='nav-item'>
              <button
                className='nav-link active tabText'
                aria-current='page'
                ref={applicationsTabLabel}
                onClick={(e) => {
                  switchTab(e, "Applications");
                }}
              >
                Applications
              </button>
            </li>
            
            
            <li className='nav-item'>
              <button
                className='nav-link cursor tabText'
                ref={profilesTabLabel}
                onClick={(e) => {
                  switchTab(e, "Profiles");
                }}
              >
                Profiles
              </button>
            </li>
            <li className='nav-item'>
              <button
                className='nav-link cursor tabText'
                ref={certificateListTabLabel}
                onClick={(e) => {
                  switchTab(e, "Certificates");
                }}
              >
                Certificates
              </button>
            </li>
            <li className='nav-item'>
              <button
                className='nav-link cursor tabText'
                ref={mdmLogTabLabel}
                onClick={(e) => {
                  switchTab(e, "MDM Log");
                }}
              >
                MDM Log
              </button>
            </li>

            { numberOfSoftwareUpdates > 0 && (
               <li className='nav-item'>
               <button
                 className='nav-link cursor tabText'
                 aria-current='page'
                 ref={softwareUpdatesTabLabel}
                 onClick={(e) => {
                   switchTab(e, "Software Updates");
                 }}
               >
                 Software Updates <span className="badge text-bg-danger" style={{color: "red"}}>{numberOfSoftwareUpdates}</span>
               </button>
             </li>
            )}

          </ul>

          <div>{renderSelectedTab(activeTab)}</div>

    </>
  )

}