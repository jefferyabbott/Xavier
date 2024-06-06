import { useEffect, React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_ALL_MACS_AND_PROFILES, GET_ALL_IPADS_AND_PROFILES, GET_ALL_IPHONES_AND_PROFILES } from "../../queries/allDevicesQuery";
import Spinner from "../../components/Spinner";

export default function InstalledProfileList() {
  let { deviceType, profile, value } = useParams();
  value = value === 'true';
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  let query = '';
  let type;
  switch (deviceType) {
    case 'macos':
        query = GET_ALL_MACS_AND_PROFILES;
        type = 'mac';
        break;
    case 'ios':
        query = GET_ALL_IPHONES_AND_PROFILES;
        type = 'iphone';
        break;
    case 'ipados':
        query = GET_ALL_IPADS_AND_PROFILES;
        type = 'ipad';
        break;
    default:
        break;
  }
  const { loading, error, data } = useQuery(query);

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  if (data) {
    let devicesWithProfile = [];
    if (deviceType === 'macos') {
        devicesWithProfile = data.macs.filter((mac) => {
          let profileInstalled = false;
            mac.Profiles.forEach((pr) => {
                if (pr.PayloadDisplayName === profile) {
                    profileInstalled = true;
                }
            })
            if (value === true) {
              return profileInstalled;
            } else {
              return !profileInstalled;
            }
        });
    } else if (deviceType === 'ios') {
      devicesWithProfile = data.iphones.filter((iphone) => {
        let profileInstalled = false;
          iphone.Profiles.forEach((pr) => {
              if (pr.PayloadDisplayName === profile) {
                  profileInstalled = true;
              }
          })
          if (value === true) {
            return profileInstalled;
          } else {
            return !profileInstalled;
          }
      });
    } else if (deviceType === 'ipados') {
      devicesWithProfile = data.ipads.filter((ipad) => {
        let profileInstalled = false;
          ipad.Profiles.forEach((pr) => {
              if (pr.PayloadDisplayName === profile) {
                  profileInstalled = true;
              }
          })
          if (value === true) {
            return profileInstalled;
          } else {
            return !profileInstalled;
          }
      });
    }
    devicesWithProfile.forEach((device) => {
      const newObject = Object.assign({}, device, { type: type });
      combinedData.push(newObject);
    });
  }

  if (!loading && !error) {
    return <AllDeviceTable deviceData={combinedData} />;
  }
}

