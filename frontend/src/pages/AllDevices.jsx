import { useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AllDeviceTable from "../components/AllDeviceTable";
import { useQuery } from "@apollo/client";
import { GET_ALL_DEVICES } from "../queries/allDevicesQuery";
import Spinner from "../components/Spinner";

export default function AllDevices() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { loading, error, data } = useQuery(GET_ALL_DEVICES);
  const combinedData = [];

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;
  if (data) {
    data.macs.forEach((device) => {
      const newObject = Object.assign({}, device, { type: "mac" });
      combinedData.push(newObject);
    });

    data.iphones.forEach((device) => {
      const newObject = Object.assign({}, device, { type: "iphone" });
      combinedData.push(newObject);
    });

    data.ipads.forEach((device) => {
      const newObject = Object.assign({}, device, { type: "ipad" });
      combinedData.push(newObject);
    });
  }

  if (!loading && !error) {
    return <AllDeviceTable deviceData={combinedData} />;
  }
}
