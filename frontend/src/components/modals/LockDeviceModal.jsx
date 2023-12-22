import { useState, useEffect, React } from "react";
import { Modal, Button } from "react-bootstrap";
import { lockDevice } from "../../commands/mdmCommands";

function LockDeviceModal({ visible, UDID, hideLockDeviceModal }) {
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lockScreenMessage, setLockScreenMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    hideLockDeviceModal();
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function sendLockDeviceCommand() {
    lockDevice(UDID, phoneNumber, lockScreenMessage);
    handleClose();
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lock Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className='mb-3'>
              <label for='phoneNumber' className='form-label'>
                Contact Phone Number
              </label>
              <input
                type='text'
                className='form-control'
                id='phoneNumber'
                aria-describedby='phoneNumber'
                placeholder='optional'
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
              <div id='phoneNumberHelp' className='form-text'>
                optional phone number for IT support
              </div>
            </div>
            <div className='mb-3'>
              <label for='lockScreenMessage' className='form-label'>
                Lock Screen Message
              </label>
              <input
                type='text'
                className='form-control'
                id='lockScreenMessage'
                aria-describedby='lockScreenMessage'
                placeholder='optional'
                onChange={(e) => {
                  setLockScreenMessage(e.target.value);
                }}
              />
              <div id='lockScreenMessageHelp' className='form-text'>
                optional message to display on the lock screen
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <button
            type='button'
            className='btn btn-danger'
            onClick={sendLockDeviceCommand}
          >
            Lock Device
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LockDeviceModal;
