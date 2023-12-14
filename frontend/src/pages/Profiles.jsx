import { useState, useEffect, React } from "react";
import { useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import ConfigProfileRow from "../components/ConfigProfileRow.jsx";
import { FaPlusCircle } from "react-icons/fa";
import isAdministrator from "../utilities/checkPrivileges";
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import { GET_CONFIG_PROFILES } from "../queries/configProfilesQueries.js";

function Profiles() {

  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);

  function displayInstallProfileModal() {
    setShowInstallProfileModal(true);
  }

  function hideInstallProfileModal() {
    setShowInstallProfileModal(false);
  }

  const { loading, error, data } = useQuery(GET_CONFIG_PROFILES);

  if (loading) return <Spinner />;
  if (error) return <NotFound />;

  if (data) {
    return <>
    <main>
    <div className='header'>
      <h1>Config Profile Library</h1>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Organization</th>
          </tr>
        </thead>
        <tbody>
          {data.configProfiles.map((profile) => (
            <ConfigProfileRow key={profile.PayloadIdentifier} profile={profile} />
          ))}
        </tbody>
      </table>
      <div>
        { 
          (isAdministrator()) ?
          (showInstallProfileModal) ?
              <InstallProfileModal
                visible={showInstallProfileModal}
                UDID={null}
                currentProfiles={null}
                configProfiles={data.configProfiles}
                hideInstallProfileModal={hideInstallProfileModal}
              />
            : 
            <button className="btn" onClick={displayInstallProfileModal}><FaPlusCircle/></button>
          : null
        }
      </div>
      
      

      </main>
    </>
  }
  
}



export default Profiles;
