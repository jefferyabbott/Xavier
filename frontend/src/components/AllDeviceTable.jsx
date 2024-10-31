import { useState, useMemo } from "react";
import AllDeviceRow from "./AllDeviceRow";
import SearchBar from "./SearchBar";

export default function AllDeviceTable({ 
  deviceData, 
  totalCount, 
  hasNextPage, 
  onLoadMore,
  loadingMore 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'DeviceName', // Default sort by name
    direction: 'asc'
  });

  // Handle sort click
  const requestSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // If clicking same column, toggle direction
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      // If clicking new column, default to ascending
      return {
        key,
        direction: 'asc'
      };
    });
  };

  // Sort devices based on sortConfig and then filter by search
  const sortedAndFilteredDevices = useMemo(() => {
    let sorted = [...deviceData];
    
    // Sort based on current config
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'SerialNumber':
          aValue = a.SerialNumber;
          bValue = b.SerialNumber;
          break;
        case 'DeviceName':
          aValue = a.QueryResponses.DeviceName;
          bValue = b.QueryResponses.DeviceName;
          break;
        case 'OSVersion':
          aValue = a.OSVersion;
          bValue = b.OSVersion;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = a.QueryResponses.DeviceName;
          bValue = b.QueryResponses.DeviceName;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Filter based on search query
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (lowerQuery) {
      sorted = sorted.filter((device) => {
        return (
          device.QueryResponses.DeviceName.toLowerCase().includes(lowerQuery) ||
          device.SerialNumber.toLowerCase().includes(lowerQuery)
        );
      });
    }

    return sorted;
  }, [deviceData, sortConfig, searchQuery]);

  // Helper function to render sort arrows
  const renderSortArrow = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <span className="text-black ml-1">↑</span> : 
      <span className="text-black ml-1">↓</span>;
  };

  // Group devices by type for pagination stats
  const deviceCounts = useMemo(() => ({
    mac: deviceData.filter(d => d.type === "mac").length,
    iphone: deviceData.filter(d => d.type === "iphone").length,
    ipad: deviceData.filter(d => d.type === "ipad").length
  }), [deviceData]);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div className="positionRightAndWithMargins">
          <SearchBar
            searchHandler={(query) => setSearchQuery(query)}
            value={searchQuery}
          />
        </div>
      </div>

      {sortedAndFilteredDevices.length === 0 ? (
        <p className="text-center my-4">No devices found</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">OS</th>
                <th 
                  scope="col" 
                  onClick={() => requestSort('SerialNumber')}
                  style={{ cursor: 'pointer' }}
                  className="select-none"
                >
                  Serial Number {renderSortArrow('SerialNumber')}
                </th>
                <th 
                  scope="col"
                  onClick={() => requestSort('DeviceName')}
                  style={{ cursor: 'pointer' }}
                  className="select-none"
                >
                  Name {renderSortArrow('DeviceName')}
                </th>
                <th scope="col">Model</th>
                <th 
                  scope="col"
                  onClick={() => requestSort('OSVersion')}
                  style={{ cursor: 'pointer' }}
                  className="select-none"
                >
                  OS Version {renderSortArrow('OSVersion')}
                </th>
                <th 
                  scope="col"
                  onClick={() => requestSort('updatedAt')}
                  style={{ cursor: 'pointer' }}
                  className="select-none"
                >
                  Checked In {renderSortArrow('updatedAt')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredDevices.map((device) => (
                <AllDeviceRow
                  key={device.SerialNumber}
                  device={device}
                />
              ))}
            </tbody>
          </table>

          <div className="mt-4 d-flex gap-3 justify-content-center">
            {['macs', 'iphones', 'ipads'].map(type => {
              const singularType = type.replace('s', '');
              const hasMore = hasNextPage[type];
              const loading = loadingMore[type];
              const count = deviceCounts[singularType];
              const total = totalCount[type];

              return hasMore && (
                <button
                  key={type}
                  onClick={() => onLoadMore(type)}
                  disabled={loading}
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                  {loading && (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Load More {type.charAt(0).toUpperCase() + type.slice(1)}
                  {total && (
                    <span className="text-muted ms-1">
                      ({count}/{total})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .select-none {
          user-select: none;
        }
      `}</style>
    </div>
  );
}
