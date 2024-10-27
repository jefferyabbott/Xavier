import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { GET_MAC_SIP_LIST } from '../../queries/dashboardQueries';

const MacSIPList = () => {
  const { SystemIntegrityProtectionEnabled } = useParams();
  
  return (
    <DeviceListBase
      query={GET_MAC_SIP_LIST}
      variables={{ 
        SystemIntegrityProtectionEnabled: SystemIntegrityProtectionEnabled === 'true' 
      }}
      dataKey="sipMacs"
      deviceType="mac"
    />
  );
};

export default MacSIPList;
