import { useState, useEffect, React } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createNewUser } from '../../commands/createNewUser';

function CreateNewUserModal({visible, hideCreateNewUserModal}) {

  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('consoleAuditor');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleClose = () => {
    setShow(false);
    hideCreateNewUserModal({});
  }

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  function createUser() {
    if (password !== confirmPassword) {
        console.log('Passwords do not match');
    } else {
        const success = createNewUser(name, email, password, userType);
        setShow(false);
        hideCreateNewUserModal(success ? {name, email, userType} : {});
    }
  }

    return (

      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form autocomplete="off">
                <div className="mb-3">
                    <label for="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="name" placeholder="enter user's full name" onChange={(e) => {setName(e.target.value);}}/>
                </div>
                <div className="mb-3">
                    <label for="email" className="form-label">eMail</label>
                    <input type="email" className="form-control" id="email" aria-describedby="email" placeholder="enter the user's email address" onChange={(e) => {setEmail(e.target.value);}}/>
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="password" placeholder="enter a new password" onChange={(e) => {setPassword(e.target.value);}}/>
                </div>
                <div className="mb-3">
                    <label for="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" aria-describedby="confirmPassword" placeholder="confirm password" onChange={(e) => {setConfirmPassword(e.target.value);}}/>
                    {
                        (confirmPassword && password && password !== confirmPassword) ? <div className="form-text errorRed">Passwords do not match.</div>: null
                    }
                </div>

                <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioInput'
                  id='radioAuditor'
                  checked="checked"
                  onChange={() => setUserType("consoleAuditor")}
                />
                <label className='form-check-label' htmlFor='radioAuditor'>
                  Auditor
                </label>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='radioInput'
                  id='radioAdministrator'
                  onChange={() => setUserType("consoleAdmnistrator")}
                />
                <label className='form-check-label' htmlFor='radioAdministrator'>
                  Administrator
                </label>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {
                (name && email && password && password === confirmPassword) ? <button type="button" className="btn btn-success" onClick={createUser}>Create User</button> : null
            }
          </Modal.Footer>
        </Modal>
  
    </>
    )
}

export default CreateNewUserModal;
