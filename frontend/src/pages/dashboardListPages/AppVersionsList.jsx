import { useEffect, React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_MACS_WITH_APP_VERSION, GET_IPADS_WITH_APP_VERSION, GET_IPHONES_WITH_APP_VERSION } from "../../queries/dashboardQueries";
import Spinner from "../../components/Spinner";

export default function AppVersionsList() {
  let { deviceType, Name, Version } = useParams();
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  let queryType;
  if (deviceType === 'macos') {
    queryType = GET_MACS_WITH_APP_VERSION;
  } else if (deviceType === 'ipados') {
    queryType = GET_IPADS_WITH_APP_VERSION;
  } else if (deviceType === 'ios') {
    queryType = GET_IPHONES_WITH_APP_VERSION;
  }

  const { loading, error, data } = useQuery(queryType, {
    variables: { Name, Version }
  });

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  if (data) {
    if (deviceType === 'macos') {
        data.macsWithAppVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "mac" });
            combinedData.push(newObject);
          });
      } else if (deviceType === 'ipados') {
        data.iPadsWithAppVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "ipados" });
            combinedData.push(newObject);
          });
      } else if (deviceType === 'ios') {
        data.iPhonesWithAppVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "iphone" });
            combinedData.push(newObject);
          });
      }
  }

  if (!loading && !error) {
    return <AllDeviceTable deviceData={combinedData} />;
  }
}

