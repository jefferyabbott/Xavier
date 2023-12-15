import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { eraseDevice } from '../../commands/mdmCommands';


function EraseDeviceModal({visible, UDID, hideEraseDeviceModal}) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideEraseDeviceModal();
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function erase() {
    eraseDevice(UDID);
    handleClose();
  }
  
    return (

      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Erase Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure about this?</p>
            <p>This action requires supervisor approval.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <button type="button" class="btn btn-danger" onClick={erase}>Erase Device</button>
          </Modal.Footer>
        </Modal>
  
    </>
    )
}

export default EraseDeviceModal;
