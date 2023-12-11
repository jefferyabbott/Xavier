import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { installProfile } from '../../commands/mdmCommands';
import ProfileUploader from '../ProfileUploader';
import plist from 'plist';
import ProfilePayload from '../ProfilePayload';


function InstallProfileModal({visible, UDID, currentProfiles, configProfiles, hideInstallProfileModal, returnBase64String}) {

  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState();
  const [plistData, setPlistData] = useState();
  const [profileAlreadyInstalled, setProfileAlreadyInstalled] = useState(false);
  
  
  const handleClose = () => {
    setShow(false);
    hideInstallProfileModal();
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    if (profile) {
      setPlistData(plist.parse(atob(profile)));
    }
  }, [profile]);

  useEffect(() => {
    if (plistData) {
      currentProfiles.forEach((currentProfile) => {
        console.log(`Current: ${currentProfile.PayloadIdentifier}`);
        console.log(`New: ${plistData.PayloadIdentifier}`)
        if (currentProfile.PayloadIdentifier === plistData.PayloadIdentifier) {
          setProfileAlreadyInstalled(true);
        }
      })
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
        MobileConfigData: profile
      }
      installProfile(UDID, profileObject);
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
            <Modal.Title>Install profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>

{ (!plistData) ? 
  <table className='table tableList'>
  <tbody>
    {configProfiles.filter((configProfile) => {
      let installed = false;
      currentProfiles.forEach((currentProfile) => {
        if (currentProfile.PayloadIdentifier === configProfile.PayloadIdentifier) {
          installed = true;
        }
      });
      return !installed;
    }).map((configProfile, index) => {
      return (
        <tr key={configProfile.PayloadIdentifier + index}>
          <td>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                value=''
                onChange={() => selectConfigProfile(configProfile.MobileConfigData)}
              />
              <label className='form-check-label'>{configProfile.PayloadDisplayName}</label>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
: null

}
          

            {
              (!plistData) ? <ProfileUploader returnBase64String={returnBase64String}/> : <ProfilePayload profile={plistData}/>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              (profile && profileAlreadyInstalled ? <p className="errorRed">{plistData.PayloadDisplayName} is already installed.</p> : null)
            }
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {
                (profile && !profileAlreadyInstalled) ? <button type="button" className="btn btn-success" onClick={deployProfile}>Install Profile</button> : null
            }
            
            
          </Modal.Footer>
        </Modal>
  
    </>
    )
}

export default InstallProfileModal;
