import React, { useState, useRef } from "react";
import AuditSymbolCompliance from "./AuditSymbolCompliance.jsx";
import SearchBar from "./SearchBar";
import ProfileModal from "./modals/ProfileModal.jsx";

function sortProfiles(Profiles) {
  let appArray = [...Profiles];
  return appArray.sort((a, b) => {
    return a.PayloadDisplayName.toLowerCase() >
      b.PayloadDisplayName.toLowerCase()
      ? 1
      : -1;
  });
}

export default function ProfilesTable({ Profiles }) {
  const [searchedProfiles, setSearchedProfiles] = useState(Profiles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
          </tr>
        </thead>
        <tbody>
          {sortProfiles(searchedProfiles).map((profile, index) => {
            return (
              <tr
                key={profile.PayloadDisplayName + index}
                onClick={() => showProfileDetails(profile)}
              >
                <td>{profile.PayloadDisplayName}</td>
                <td>{profile.PayloadIdentifier}</td>
                <td>
                  {<AuditSymbolCompliance status={profile.IsEncrypted} />}
                </td>
                <td>
                  {
                    <AuditSymbolCompliance
                      status={!profile.PayloadRemovalDisallowed}
                    />
                  }
                </td>
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
    </div>
  );
}
