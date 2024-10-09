import { useState, useMemo } from "react";
import AllDeviceRow from "./AllDeviceRow";
import SearchBar from "./SearchBar";

export default function AllDeviceTable({ deviceData }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sort devices once on initial render
  const sortedDevices = useMemo(() => {
    return [...deviceData].sort((a, b) => 
      a.QueryResponses.DeviceName.localeCompare(b.QueryResponses.DeviceName)
    );
  }, [deviceData]);
  
  // Filter devices based on search query
  const searchedDevices = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    if (!lowerQuery) return sortedDevices;
    
    return sortedDevices.filter((device) => {
      return (
        device.QueryResponses.DeviceName.toLowerCase().includes(lowerQuery) || 
        device.SerialNumber.toLowerCase().includes(lowerQuery)
      );
    });
  }, [sortedDevices, searchQuery]);

  return (
    <div className="container">
      <div className="positionRightAndWithMargins">
        <SearchBar 
          searchHandler={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
      </div>
      
      {searchedDevices.length === 0 ? (
        <p className="text-center my-4">No devices found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">OS</th>
              <th scope="col">Serial Number</th>
              <th scope="col">Name</th>
              <th scope="col">Model</th>
              <th scope="col">OS Version</th>
              <th scope="col">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {searchedDevices.map((device) => (
              <AllDeviceRow 
                key={device.SerialNumber} 
                device={device} 
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
