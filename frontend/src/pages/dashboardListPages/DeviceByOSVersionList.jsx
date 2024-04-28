import { useEffect, React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_MACS_BY_OSVERSION, GET_IPADS_BY_OSVERSION, GET_IPHONES_BY_OSVERSION } from "../../queries/dashboardQueries";
import Spinner from "../../components/Spinner";

export default function DeviceByOSVersionList() {
  let { deviceType, OSVersion } = useParams();
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  let queryType;
  if (deviceType === 'mac') {
    queryType = GET_MACS_BY_OSVERSION;
  } else if (deviceType === 'iPad') {
    queryType = GET_IPADS_BY_OSVERSION;
  } else if (deviceType === 'iPhone') {
    queryType = GET_IPHONES_BY_OSVERSION;
  }

  const { loading, error, data } = useQuery(queryType, {
    variables: { OSVersion }
  });

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  if (data) {
    if (deviceType === 'mac') {
        data.macsByOSVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "mac" });
            combinedData.push(newObject);
          });
      } else if (deviceType === 'iPad') {
        data.iPadsByOSVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "ipad" });
            combinedData.push(newObject);
          });
      } else if (deviceType === 'iPhone') {
        data.iPhonesByOSVersion.forEach((device) => {
            const newObject = Object.assign({}, device, { type: "iphone" });
            combinedData.push(newObject);
          });
      }
  }

  if (!loading && !error) {
    return <AllDeviceTable deviceData={combinedData} />;
  }
}

