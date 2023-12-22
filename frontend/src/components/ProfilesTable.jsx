import React, { useState } from "react";
import AuditSymbolCompliance from "./AuditSymbolCompliance.jsx";
import SearchBar from "./SearchBar";
import ProfileModal from "./modals/ProfileModal.jsx";
import { FaTrash } from "react-icons/fa";
import UninstallProfileModal from "./modals/UninstallProfileModal.jsx";

function sortProfiles(Profiles) {
  let appArray = [...Profiles];
  return appArray.sort((a, b) => {
    return a.PayloadDisplayName.toLowerCase() >
      b.PayloadDisplayName.toLowerCase()
      ? 1
      : -1;
  });
}

export default function ProfilesTable({ Profiles, Administrator, UDID }) {
  const [searchedProfiles, setSearchedProfiles] = useState(Profiles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfileDisplayName, setSelectedProfileDisplayName] =
    useState(null);
  const [selectedProfileIdentifier, setSelectedProfileIdentifier] =
    useState(null);
  const [showUninstallProfileModal, setShowUninstallModalProfile] =
    useState(false);

  function searchHandler(query) {
    setSearchedProfiles(
      Profiles.filter((profile) =>
        profile.PayloadDisplayName.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  function showProfileDetails(profile) {
    setSelectedProfile(profile);
    setIsModalVisible(true);
  }

  function hideProfileDetails() {
    setIsModalVisible(false);
  }

  function displayUninstallProfileModal(name, ident) {
    setSelectedProfileDisplayName(name);
    setSelectedProfileIdentifier(ident);
    setShowUninstallModalProfile(true);
  }

  function hideUninstallProfileModal() {
    setShowUninstallModalProfile(false);
  }

  return (
    <div>
      <table className='table tableList'>
        <thead>
          <tr>
            <th>
              <SearchBar searchHandler={searchHandler} />
            </th>
            <th>Identifier</th>
            <th>Encrypted</th>
            <th>User Removable</th>
            {Administrator ? <th>Uninstall</th> : null}
          </tr>
        </thead>
        <tbody>
          {sortProfiles(searchedProfiles).map((profile, index) => {
            return (
              <tr key={profile.PayloadDisplayName + index}>
                <td onClick={() => showProfileDetails(profile)}>
                  {profile.PayloadDisplayName}
                </td>
                <td onClick={() => showProfileDetails(profile)}>
                  {profile.PayloadIdentifier}
                </td>
                <td onClick={() => showProfileDetails(profile)}>
                  {<AuditSymbolCompliance status={profile.IsEncrypted} />}
                </td>
                <td onClick={() => showProfileDetails(profile)}>
                  {
                    <AuditSymbolCompliance
                      status={!profile.PayloadRemovalDisallowed}
                    />
                  }
                </td>
                {Administrator ? (
                  <td>
                    <FaTrash
                      onClick={() =>
                        displayUninstallProfileModal(
                          profile.PayloadDisplayName,
                          profile.PayloadIdentifier
                        )
                      }
                    />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ProfileModal
        visible={isModalVisible}
        profile={selectedProfile}
        hideProfileDetails={hideProfileDetails}
      />
      <UninstallProfileModal
        visible={showUninstallProfileModal}
        UDID={UDID}
        displayName={selectedProfileDisplayName}
        identifier={selectedProfileIdentifier}
        hideUninstallProfileModal={hideUninstallProfileModal}
      />
    </div>
  );
}
