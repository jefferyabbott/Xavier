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
    key: 'DeviceName',
    direction: 'asc'
  });

  const requestSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };

  const sortedAndFilteredDevices = useMemo(() => {
    if (!deviceData) return [];
    
    let sorted = [...deviceData];
    
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
        case 'Model':
          aValue = a.ProductName || '';
          bValue = b.ProductName || '';
          break;
        case 'OSVersion':
          aValue = a.OSVersion;
          bValue = b.OSVersion;
          break;
        case 'updatedAt':
          // Direct integer comparison for Unix timestamps
          aValue = parseInt(a.updatedAt) || 0;
          bValue = parseInt(b.updatedAt) || 0;
          // Return the comparison directly for timestamps
          return sortConfig.direction === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        default:
          aValue = a.QueryResponses.DeviceName;
          bValue = b.QueryResponses.DeviceName;
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

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

  const deviceCounts = useMemo(() => ({
    mac: deviceData?.filter(d => d.type === "mac").length || 0,
    iphone: deviceData?.filter(d => d.type === "iphone").length || 0,
    ipad: deviceData?.filter(d => d.type === "ipad").length || 0
  }), [deviceData]);

  const renderSortArrow = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return (
      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
    );
  };

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
                <th>OS</th>
                <th 
                  onClick={() => requestSort('SerialNumber')}
                  className="cursor-pointer select-none"
                >
                  Serial Number {renderSortArrow('SerialNumber')}
                </th>
                <th 
                  onClick={() => requestSort('DeviceName')}
                  className="cursor-pointer select-none"
                >
                  Name {renderSortArrow('DeviceName')}
                </th>
                <th 
                  onClick={() => requestSort('Model')}
                  className="cursor-pointer select-none"
                >
                  Model {renderSortArrow('Model')}
                </th>
                <th 
                  onClick={() => requestSort('OSVersion')}
                  className="cursor-pointer select-none"
                >
                  OS Version {renderSortArrow('OSVersion')}
                </th>
                <th 
                  onClick={() => requestSort('updatedAt')}
                  className="cursor-pointer select-none"
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
    </div>
  );
}
