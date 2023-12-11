import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shutdownDevice } from '../../commands/mdmCommands';


function ShutdownDeviceModal({visible, UDID, hideShutdownDeviceModal}) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideShutdownDeviceModal();
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function shutdown() {
    shutdownDevice(UDID);
    handleClose();
  }
  
    return (

      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Shutdown Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Shutting down a device can be disruptive for the user.</p>
            <p>This action requires supervisor approval.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <button type="button" class="btn btn-danger" onClick={shutdown}>Shutdown</button>
          </Modal.Footer>
        </Modal>
  
    </>
    )
}

export default ShutdownDeviceModal;
