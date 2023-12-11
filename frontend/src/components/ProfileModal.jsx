import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ProfilePayload from './ProfilePayload';
import AuditSymbolCompliance from './AuditSymbolCompliance';


function ProfileModal({visible, profile, hideProfileDetails}) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideProfileDetails();
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);
  
  if (profile) {
    return (

      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{profile.PayloadDisplayName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <ProfilePayload profile={profile}/>
  
            <table className="table greyBorder">
                <tbody>
                    <tr>
                        <td>encrypted</td>
                        <td>{<AuditSymbolCompliance status={profile.IsEncrypted}/>}</td>
                    </tr>

                    <tr>
                        <td>managed</td>
                        <td>{<AuditSymbolCompliance status={profile.IsManaged}/>}</td>
                    </tr>
                    <tr>
                        <td>has removal passcode</td>
                        <td>{<AuditSymbolCompliance status={profile.HasRemovalPasscode}/>}</td>
                    </tr>
                    <tr>
                        <td>user removable</td>
                        <td>{<AuditSymbolCompliance status={!profile.PayloadRemovalDisallowed}/>}</td>
                    </tr>
                </tbody>
              </table>

            {
              (profile.PayloadContent) ? profile.PayloadContent.map((content, index) => (<div key={content.PayloadUUID + index}><hr/> <ProfilePayload  profile={content}/> </div>)): null
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
  
    </>
    )
  }
  
}

export default ProfileModal;
