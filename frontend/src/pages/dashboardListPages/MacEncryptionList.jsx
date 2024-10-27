import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { GET_MAC_ENCRYPTION_LIST } from '../../queries/dashboardQueries';

const MacEncryptionList = () => {
  const { FDE_Enabled } = useParams();
  
  return (
    <DeviceListBase
      query={GET_MAC_ENCRYPTION_LIST}
      variables={{ FDE_Enabled: FDE_Enabled === 'true' }}
      dataKey="encryptedMacs"
      deviceType="mac"
    />
  );
};

export default MacEncryptionList;
