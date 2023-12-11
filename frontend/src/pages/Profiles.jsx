import { useState, useEffect, React } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONFIG_PROFILES } from "../queries/configProfilesQueries";
import ProfileUploader from "../components/ProfileUploader";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import ConfigProfileRow from "../components/ConfigProfileRow.jsx";
import { FaPlusCircle } from "react-icons/fa";
import { uploadProfile } from '../commands/mdmCommands';

function Profiles() {

  const [base64Profile, setBase64Profile] = useState();
  const [addProfile, setAddProfile] = useState(false);

  // TODO - set useEffect to upload a profile
  // TODO - check if the profile has already been uploaded

  function returnBase64String(str) {
    setBase64Profile(str);
  }

  function allowProfileUpload() {
    setAddProfile(true);
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
        { (addProfile) ? <ProfileUploader returnBase64String={returnBase64String}/> : (<button className="btn" onClick={allowProfileUpload}><FaPlusCircle/></button>)}
      </div>
      
      </main>
    </>
  }
  
}



export default Profiles;
