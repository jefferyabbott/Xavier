import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import Spinner from '../../components/Spinner.jsx';
import { Table } from 'react-bootstrap';
import timeSince from '../../utilities/timeSince.js';

const DeviceListBase = ({
  query,
  dataKey,
  deviceType,
  transformData,
  queryOptions = {},
  paginationConfig = {
    itemsPerPage: 100,
    getPageInfo: (data) => data?.[dataKey]?.pageInfo,
    getTotalCount: (data) => data?.[dataKey]?.totalCount
  }
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'QueryResponses.DeviceName',
    direction: 'ascending'
  });

  const { loading, error, data, fetchMore } = useQuery(query, {
    ...queryOptions,
    variables: {
      first: paginationConfig.itemsPerPage,
      after: null,
      ...queryOptions.variables
    }
  });

  const loadMore = async () => {
    const pageInfo = paginationConfig.getPageInfo(data);
    if (!pageInfo?.hasNextPage) return;

    await fetchMore({
      variables: {
        first: paginationConfig.itemsPerPage,
        after: pageInfo.endCursor,
        ...queryOptions.variables
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...prev,
          [dataKey]: {
            ...fetchMoreResult[dataKey],
            edges: [
              ...prev[dataKey].edges,
              ...fetchMoreResult[dataKey].edges
            ]
          }
        };
      }
    });
  };

  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending'
    }));
  }, []);

  const sortData = useCallback((devices) => {
    if (!devices) return [];

    return [...devices].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      // Handle nested properties (e.g., 'QueryResponses.DeviceName')
      sortConfig.key.split('.').forEach(key => {
        aValue = aValue?.[key];
        bValue = bValue?.[key];
      });

      if (!aValue) return 1;
      if (!bValue) return -1;

      const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
  }, [sortConfig]);

  const handleDeviceClick = useCallback((device) => {
    navigate(`/${device.type}/${device.SerialNumber}`);
  }, [navigate]);

  const transformedAndSortedData = useMemo(() => {
    if (!data) return [];
    const transformed = transformData(data);
    return sortData(transformed);
  }, [data, transformData, sortData]);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const pageInfo = paginationConfig.getPageInfo(data);
  const totalCount = paginationConfig.getTotalCount(data);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('QueryResponses.DeviceName')}
              style={{ cursor: 'pointer' }}
            >
              Device Name{getSortIndicator('QueryResponses.DeviceName')}
            </th>
            <th
              onClick={() => handleSort('SerialNumber')}
              style={{ cursor: 'pointer' }}
            >
              Serial Number{getSortIndicator('SerialNumber')}
            </th>
            <th
              onClick={() => handleSort('OSVersion')}
              style={{ cursor: 'pointer' }}
            >
              OS Version{getSortIndicator('OSVersion')}
            </th>
            <th
              onClick={() => handleSort('ProductName')}
              style={{ cursor: 'pointer' }}
            >
              Model{getSortIndicator('ProductName')}
            </th>
            <th
              onClick={() => handleSort('updatedAt')}
              style={{ cursor: 'pointer' }}
            >
              Last Check-in{getSortIndicator('updatedAt')}
            </th>
          </tr>
        </thead>
        <tbody>
          {transformedAndSortedData.map((device) => (
            <tr
              key={device.SerialNumber}
              onClick={() => handleDeviceClick(device)}
              style={{ cursor: 'pointer' }}
            >
              <td>{device.QueryResponses?.DeviceName || 'N/A'}</td>
              <td>{device.SerialNumber}</td>
              <td>{device.OSVersion}</td>
              <td>{device.ProductName}</td>
              <td>{timeSince(device.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex flex-column align-items-center mt-3">
        <div className="text-muted mb-2">
          Showing {transformedAndSortedData.length} of {totalCount} devices
        </div>
        
        {pageInfo?.hasNextPage && (
          <button 
            onClick={loadMore}
            className="btn btn-primary"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceListBase;
