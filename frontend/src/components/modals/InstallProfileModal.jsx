import { useState, useEffect, React } from "react";
import { Modal, Button } from "react-bootstrap";
import { installProfile, uploadProfile } from "../../commands/mdmCommands";
import ProfileUploader from "../ProfileUploader";
import plist from "plist";
import ProfilePayload from "../ProfilePayload";

function InstallProfileModal({
  visible,
  UDID,
  currentProfiles,
  configProfiles,
  hideInstallProfileModal,
}) {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState();
  const [plistData, setPlistData] = useState();
  const [profileAlreadyInstalled, setProfileAlreadyInstalled] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideInstallProfileModal();
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    if (profile) {
      try {
        console.log(profile);
        setPlistData(plist.parse(atob(profile)));
      } catch (e) {
        // profile may not be encoded
        console.error("This was an error that was caught");
        console.log(profile);
        setPlistData(plist.parse(profile));
      }
      
    }
  }, [profile]);

  useEffect(() => {
    if (plistData && UDID) {
      currentProfiles.forEach((currentProfile) => {
        if (currentProfile.PayloadIdentifier === plistData.PayloadIdentifier) {
          setProfileAlreadyInstalled(true);
        }
      });
    }
  }, [plistData]);

  function deployProfile() {
    if (profile) {
      const profileObject = {
        PayloadDisplayName: plistData.PayloadDisplayName,
        PayloadDescription: plistData.PayloadDescription,
        PayloadOrganization: plistData.PayloadOrganization,
        PayloadIdentifier: plistData.PayloadIdentifier,
        PayloadUUID: plistData.PayloadUUID,
        MobileConfigData: profile,
      };
      if (UDID) {
        installProfile(UDID, profileObject);
      } else {
        uploadProfile(profileObject);
      }
    }
    handleClose();
  }

  function returnBase64String(str) {
    setProfile(str);
  }

  function selectConfigProfile(mobileConfigData) {
    setProfile(mobileConfigData);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{UDID ? "Install" : "Upload"} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!plistData && UDID ? (
            <table className='table tableList'>
              <tbody>
                {configProfiles
                  .filter((configProfile) => {
                    let installed = false;
                    currentProfiles.forEach((currentProfile) => {
                      if (
                        currentProfile.PayloadIdentifier ===
                        configProfile.PayloadIdentifier
                      ) {
                        installed = true;
                      }
                    });
                    return !installed;
                  })
                  .map((configProfile, index) => {
                    return (
                      <tr key={configProfile.PayloadIdentifier + index}>
                        <td>
                          <div className='form-check'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              value=''
                              onChange={() =>
                                selectConfigProfile(
                                  configProfile.MobileConfigData
                                )
                              }
                            />
                            <label className='form-check-label'>
                              {configProfile.PayloadDisplayName}
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : null}

          {!plistData ? (
            <ProfileUploader returnBase64String={returnBase64String} />
          ) : (
            <ProfilePayload profile={plistData} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {profile && profileAlreadyInstalled ? (
            <p className='errorRed'>
              {plistData.PayloadDisplayName} is already installed.
            </p>
          ) : null}
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          {profile && !profileAlreadyInstalled ? (
            <Button variant='warning' onClick={deployProfile}>
              {UDID ? "Install" : "Upload"} Profile
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InstallProfileModal;
