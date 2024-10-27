import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { 
  GET_MACS_BY_OSVERSION, 
  GET_IPADS_BY_OSVERSION, 
  GET_IPHONES_BY_OSVERSION 
} from '../../queries/dashboardQueries';

const OS_VERSION_CONFIGS = {
  mac: {
    query: GET_MACS_BY_OSVERSION,
    dataKey: 'macsByOSVersion',
    deviceType: 'mac'
  },
  iPad: {
    query: GET_IPADS_BY_OSVERSION,
    dataKey: 'iPadsByOSVersion',
    deviceType: 'ipad'
  },
  iPhone: {
    query: GET_IPHONES_BY_OSVERSION,
    dataKey: 'iPhonesByOSVersion',
    deviceType: 'iphone'
  }
};

const DeviceByOsVersionList = () => {
  const { deviceType, OSVersion } = useParams();

  const config = OS_VERSION_CONFIGS[deviceType];
  if (!config) {
    return (
      <div className="alert alert-danger m-3">
        Invalid device type: {deviceType}
      </div>
    );
  }

  return (
    <DeviceListBase
      {...config}
      variables={{ OSVersion }}
    />
  );
};

export default DeviceByOsVersionList;
