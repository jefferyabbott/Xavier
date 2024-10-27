import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { 
  GET_ALL_MACS_AND_PROFILES,
  GET_ALL_IPADS_AND_PROFILES,
  GET_ALL_IPHONES_AND_PROFILES 
} from '../../queries/allDevicesQuery';

const PROFILE_CONFIGS = {
  macos: {
    query: GET_ALL_MACS_AND_PROFILES,
    dataKey: 'macs',
    deviceType: 'mac'
  },
  ios: {
    query: GET_ALL_IPHONES_AND_PROFILES,
    dataKey: 'iphones',
    deviceType: 'iphone'
  },
  ipados: {
    query: GET_ALL_IPADS_AND_PROFILES,
    dataKey: 'ipads',
    deviceType: 'ipad'
  }
};

const InstalledProfileList = () => {
  const { deviceType, profile, value } = useParams();
  const boolValue = value === 'true';

  const config = PROFILE_CONFIGS[deviceType];
  if (!config) return null;

  const transformData = (devices) => {
    return devices
      .filter(device => {
        const hasProfile = device.Profiles.some(
          pr => pr.PayloadDisplayName === profile
        );
        return boolValue ? hasProfile : !hasProfile;
      })
      .map(device => ({
        ...device,
        type: config.deviceType
      }));
  };

  return (
    <DeviceListBase
      query={config.query}
      dataKey={config.dataKey}
      deviceType={config.deviceType}
      transformData={transformData}
    />
  );
};

export default InstalledProfileList;

