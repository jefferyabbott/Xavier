import { useState, useEffect, React } from "react";
import { Modal, Button } from "react-bootstrap";
import { renameDevice } from "../../commands/mdmCommands.js";

function RenameDeviceModal({
  visible,
  UDID,
  platform,
  oldName,
  hideRenameDeviceModal,
}) {
  const [show, setShow] = useState(false);
  const [newName, setNewName] = useState("");

  const handleClose = () => {
    setShow(false);
    hideRenameDeviceModal();
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function action() {
    renameDevice(UDID, platform, newName, oldName);
    handleClose();
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Update {oldName}:</p>
          <div className='form-outline'>
            <input
              type='text'
              className='form-control'
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              placeholder='enter a new name'
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <button type='button' class='btn btn-success' onClick={action}>
            Rename Device
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RenameDeviceModal;
