import { useParams } from 'react-router-dom';
import DeviceListBase from '../../components/DeviceListBase';
import { GET_MDM_ENROLLED_MACS } from '../../queries/dashboardQueries';

const MacMDMEnrolledList = () => {
  const { mdmProfileInstalled } = useParams();
  
  return (
    <DeviceListBase
      query={GET_MDM_ENROLLED_MACS}
      variables={{ mdmProfileInstalled: mdmProfileInstalled === 'true' }}
      dataKey="mdmEnrolledMacs"
      deviceType="mac"
    />
  );
};

export default MacMDMEnrolledList;
