import { useState, useEffect, React } from "react";
import { Modal, Button } from "react-bootstrap";
import { removeProfile } from "../../commands/mdmCommands";

function UninstallProfileModal({
  visible,
  UDID,
  displayName,
  identifier,
  hideUninstallProfileModal,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    hideUninstallProfileModal();
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function uninstallProfile() {
    removeProfile(UDID, identifier, displayName);
    handleClose();
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Uninstall profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure that you want to uninstall the config profile{" "}
            {displayName}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <button
            type='button'
            className='btn btn-danger'
            onClick={uninstallProfile}
          >
            Uninstall Profile
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UninstallProfileModal;
