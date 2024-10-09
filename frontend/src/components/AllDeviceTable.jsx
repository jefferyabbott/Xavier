import { useState, React } from "react";
import AllDeviceRow from "./AllDeviceRow";
import SearchBar from "./SearchBar";

export default function AllDeviceTable({ deviceData }) {
  const [searchedDevices, setSearchedDevices] = useState(
    deviceData.sort((a, b) =>
      a.QueryResponses.DeviceName > b.QueryResponses.DeviceName ? 1 : -1
    )
  );

  function searchHandler(query) {
    const lowerQuery = query.toLowerCase();
    setSearchedDevices(
      deviceData.filter((device) => {
        return device.QueryResponses.DeviceName.toLowerCase().includes(lowerQuery) || device.SerialNumber.toLowerCase().includes(lowerQuery);
      })
    );
  }

  return (
    <div className='container'>
      <div className='positionRightAndWithMargins'>
        <SearchBar searchHandler={searchHandler} />
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th>OS</th>
            <th>serial number</th>
            <th>name</th>
            <th>model</th>
            <th>OS version</th>
            <th>checked in</th>
          </tr>
        </thead>
        <tbody>
          {searchedDevices.map((device) => (
            <AllDeviceRow key={device.SerialNumber} device={device} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
