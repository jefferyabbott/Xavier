import { useEffect, React } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_MDM_ENROLLED_MACS  } from "../../queries/dashboardQueries";
import Spinner from "../../components/Spinner";

export default function MacMDMEnrolledList() {
  let { mdmProfileInstalled } = useParams();
  mdmProfileInstalled = (mdmProfileInstalled === 'true');
  
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { loading, error, data } = useQuery(GET_MDM_ENROLLED_MACS, {
    variables: { mdmProfileInstalled }
  });

  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  if (data) {
    data.mdmEnrolledMacs.forEach((device) => {
      const newObject = Object.assign({}, device, { type: "mac" });
      combinedData.push(newObject);
    });
  }

  if (!loading && !error) {
    return <AllDeviceTable deviceData={combinedData} />;
  }
}

