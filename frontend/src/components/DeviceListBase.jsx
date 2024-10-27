import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import AllDeviceTable from './AllDeviceTable';
import Spinner from './Spinner';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user;
};

function DeviceListBase({ 
  query, 
  variables, 
  dataKey, 
  deviceType,
  transformData 
}) {
  const user = useAuthCheck();
  
  const { loading, error, data } = useQuery(query, {
    variables,
    skip: !user,
    fetchPolicy: 'cache-and-network'
  });

  const deviceData = useMemo(() => {
    if (!data) return [];
    
    const rawData = data[dataKey] || [];
    if (transformData) {
      return transformData(rawData);
    }
    
    return rawData.map(device => ({
      ...device,
      type: deviceType
    }));
  }, [data, dataKey, deviceType, transformData]);

  if (loading) return <Spinner />;
  
  if (error) {
    console.error('Error fetching device data:', error);
    return (
      <div className="alert alert-danger m-3">
        Error loading device data. Please try refreshing the page.
      </div>
    );
  }

  if (!deviceData.length) {
    return (
      <div className="alert alert-info m-3">
        No devices found matching the specified criteria
      </div>
    );
  }

  return <AllDeviceTable deviceData={deviceData} />;
}

export default DeviceListBase;
