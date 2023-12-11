import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { restartDevice } from '../../commands/mdmCommands';


function RestartDeviceModal({visible, UDID, hideRestartDeviceModal}) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideRestartDeviceModal();
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function dontnotify() {
    restartDevice(UDID, false);
    handleClose();
  }

  function notify() {
    restartDevice(UDID, true);
    handleClose();
  }
  
    return (

      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Nofity the user?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Restarting a device can be disruptive for the user.</p>
            <p>Would you like to notify the user? The restart will not be forced.</p>
            <p>Not notifying the user will force a restart, which requires supervisor approval.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <button type="button" class="btn btn-danger" onClick={dontnotify}>Don't Notify User</button>
            <button type="button" class="btn btn-success" onClick={notify}>Notify User</button>
          </Modal.Footer>
        </Modal>
  
    </>
    )
}

export default RestartDeviceModal;
