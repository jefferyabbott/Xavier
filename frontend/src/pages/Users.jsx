import { useState, useEffect, React } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONSOLE_USERS } from "../queries/userQueries";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import ConsoleUserRow from "../components/ConsoleUserRow";
import { FaPlusCircle } from "react-icons/fa";
import CreateNewUserModal from "../components/modals/CreateNewUserModal";
import isAdministrator from "../utilities/checkPrivileges";

function Users() {

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [consoleUsers, setConsoleUsers] = useState([]);

  function hideCreateNewUserModal(newUser) {
    setShowCreateUser(false);
    const { name, email, userType } = newUser;
    setConsoleUsers([...data.consoleusers, { name, email, userType }]);
  }

  function createNewUser() {
    setShowCreateUser(true);
  }

  // let consoleUserRights;
  // const tokenStr = localStorage.getItem('user');
  // if (tokenStr) {
  //     consoleUserRights = JSON.parse(tokenStr).userType;
  // } 

  const { loading, error, data } = useQuery(GET_CONSOLE_USERS);

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  if (data) {
    return <>
    <main>
    <div className='header'>
      <h1>Console Users</h1>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>eMail</th>
            <th>Privileges</th>
          </tr>
        </thead>
        <tbody>
          {
            (consoleUsers.length > 0) ?
            consoleUsers.map((consoleUser) => (
              <ConsoleUserRow key={consoleUser.email} consoleUser={consoleUser} />
            ))
            :
            data.consoleusers.map((consoleUser) => (
              <ConsoleUserRow key={consoleUser.email} consoleUser={consoleUser} />
            ))
          }
        </tbody>
      </table>
      <div>
        { 
        (isAdministrator()) ?
          (showCreateUser) ? <CreateNewUserModal visible={showCreateUser} hideCreateNewUserModal={hideCreateNewUserModal}/> : (<button className="btn" onClick={createNewUser}><FaPlusCircle/></button>)
        : null
        }
      </div>
      
      </main>
    </>
  }
  
}



export default Users;
