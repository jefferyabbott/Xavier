import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { 
  GET_MACS_WITH_APP_VERSION,
  GET_IPADS_WITH_APP_VERSION,
  GET_IPHONES_WITH_APP_VERSION 
} from '../../queries/dashboardQueries';

const DEVICE_CONFIGS = {
  macos: {
    query: GET_MACS_WITH_APP_VERSION,
    dataKey: 'macsWithAppVersion',
    deviceType: 'mac'
  },
  ipados: {
    query: GET_IPADS_WITH_APP_VERSION,
    dataKey: 'iPadsWithAppVersion',
    deviceType: 'ipados'
  },
  ios: {
    query: GET_IPHONES_WITH_APP_VERSION,
    dataKey: 'iPhonesWithAppVersion',
    deviceType: 'iphone'
  }
};

const AppVersionsList = () => {
  const { deviceType, Name, Version } = useParams();

  const config = DEVICE_CONFIGS[deviceType];
  if (!config) return null;

  return (
    <DeviceListBase
      {...config}
      variables={{ Name, Version }}
    />
  );
};

export default AppVersionsList;
