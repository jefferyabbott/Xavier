import { useParams } from 'react-router-dom';
import DeviceListBase from './DeviceListBase';
import {
  GET_MAC_ENCRYPTION_LIST,
  GET_MAC_SIP_LIST,
  GET_MDM_ENROLLED_MACS,
  GET_MACS_BY_OSVERSION,
  GET_IPADS_BY_OSVERSION,
  GET_IPHONES_BY_OSVERSION,
  GET_MACS_WITH_APP_VERSION,
  GET_IPADS_WITH_APP_VERSION,
  GET_IPHONES_WITH_APP_VERSION,
  GET_MACS_WITH_PROFILES,
    GET_IPHONES_WITH_PROFILES,
    GET_IPADS_WITH_PROFILES
} from '../../queries/dashboardQueries';

const ITEMS_PER_PAGE = 100;

// Device type mapping
const DEVICE_TYPE_MAP = {
  'macos': 'mac',
  'mac': 'mac',
  'ios': 'iPhone',
  'iPhone': 'iPhone',
  'ipados': 'iPad',
  'iPad': 'iPad'
};

// Configuration for which queries use pagination
const USES_PAGINATION = {
  'encryption': true,
  'sip': true,
  'mdm': true,
  'osversion': true,
  'appversion': false,
  'profile': true
};

const FILTER_CONFIGS = {
  'encryption': {
    query: GET_MAC_ENCRYPTION_LIST,
    dataKey: 'encryptedMacs',
    deviceType: 'mac',
    getVariables: (params) => { 
      const value = params.value;
      const boolValue = value === 'true';
      return { 
        FDE_Enabled: boolValue,
        first: ITEMS_PER_PAGE,
        after: null
      };
    }
  },
  'sip': {
    query: GET_MAC_SIP_LIST,
    dataKey: 'sipMacs',
    deviceType: 'mac',
    getVariables: (params) => {
      const value = params.value;     
      const boolValue = value === 'true';
     return { 
        SystemIntegrityProtectionEnabled: boolValue,
        first: ITEMS_PER_PAGE,
        after: null
      };
    }
  },
  'mdm': {
    query: GET_MDM_ENROLLED_MACS,
    dataKey: 'mdmEnrolledMacs',
    deviceType: 'mac',
    getVariables: (params) => { 
      const value = params.value;
      const boolValue = value === 'true';    
      return { 
        mdmProfileInstalled: boolValue,
        first: ITEMS_PER_PAGE,
        after: null
      };
    }
  },
  'osversion': {
    getConfig: (deviceType) => {
      const normalizedDeviceType = DEVICE_TYPE_MAP[deviceType];
      return {
        'mac': {
          query: GET_MACS_BY_OSVERSION,
          dataKey: 'macs',
          deviceType: 'mac',
          getVariables: (params) => ({ 
            OSVersion: params.OSVersion,
            first: ITEMS_PER_PAGE,
            after: null
          })
        },
        'iPad': {
          query: GET_IPADS_BY_OSVERSION,
          dataKey: 'ipads',
          deviceType: 'ipad',
          getVariables: (params) => ({ 
            OSVersion: params.OSVersion,
            first: ITEMS_PER_PAGE,
            after: null
          })
        },
        'iPhone': {
          query: GET_IPHONES_BY_OSVERSION,
          dataKey: 'iphones',
          deviceType: 'iphone',
          getVariables: (params) => ({ 
            OSVersion: params.OSVersion,
            first: ITEMS_PER_PAGE,
            after: null
          })
        }
      }[normalizedDeviceType];
    }
  },
  'appversion': {
    getConfig: (deviceType) => {
      const normalizedDeviceType = DEVICE_TYPE_MAP[deviceType];     
      return {
        'mac': {
          query: GET_MACS_WITH_APP_VERSION,
          dataKey: 'macsWithAppVersion',
          deviceType: 'mac',
          getVariables: (params) => {
            return { 
              Name: params.Name,
              Version: params.Version
            };
          }
        },
        'iPad': {
          query: GET_IPADS_WITH_APP_VERSION,
          dataKey: 'iPadsWithAppVersion',
          deviceType: 'ipad',
          getVariables: (params) => ({ 
            Name: params.Name,
            Version: params.Version
          })
        },
        'iPhone': {
          query: GET_IPHONES_WITH_APP_VERSION,
          dataKey: 'iPhonesWithAppVersion',
          deviceType: 'iphone',
          getVariables: (params) => ({ 
            Name: params.Name,
            Version: params.Version
          })
        }
      }[normalizedDeviceType];
    }
  },
  'profile': {
        getConfig: (deviceType) => {
            const normalizedDeviceType = DEVICE_TYPE_MAP[deviceType];
            return {
                'mac': {
                    query: GET_MACS_WITH_PROFILES,
                    dataKey: 'macs',
                    deviceType: 'mac',
                    getVariables: () => ({
                        first: ITEMS_PER_PAGE,
                        after: null
                    })
                },
                'iPhone': {
                    query: GET_IPHONES_WITH_PROFILES,
                    dataKey: 'iphones',
                    deviceType: 'iphone',
                    getVariables: () => ({
                        first: ITEMS_PER_PAGE,
                        after: null
                    })
                },
                'iPad': {
                    query: GET_IPADS_WITH_PROFILES,
                    dataKey: 'ipads',
                    deviceType: 'ipad',
                    getVariables: () => ({
                        first: ITEMS_PER_PAGE,
                        after: null
                    })
                }
            }[normalizedDeviceType];
        }
    }
};

const getFilterTypeFromPath = (path) => {
  const segments = path.split('/');
  return segments[2];
};

const FilteredDeviceList = () => {
  const params = useParams();
  const filterType = getFilterTypeFromPath(window.location.pathname);
  const { deviceType } = params;

  let config = FILTER_CONFIGS[filterType];
  if (config?.getConfig) {
    config = config.getConfig(deviceType);
  }

  if (!config) {
    console.error('No config found for filter type:', filterType);
    console.error('Device type:', deviceType);
    return <div>Invalid filter type</div>;
  }

  const transformData = (data) => {
    if (!data || !data[config.dataKey]) {
        return [];
    }

    let devices;
    if (USES_PAGINATION[filterType]) {
        devices = data[config.dataKey].edges?.map(edge => edge.node) || [];
    } else {
        devices = Array.isArray(data[config.dataKey]) ? data[config.dataKey] : [];
    }

    // Handle profile filtering
    if (filterType === 'profile' && params.profile) {
        const wantProfileInstalled = params.value === 'true';

        devices = devices.filter(device => {

            // Check if the device has the profile
            const hasProfile = device.Profiles?.some(pr => {
                const matches = pr.PayloadDisplayName === params.profile;
                return matches;
            }) || false;

            const keepDevice = hasProfile === wantProfileInstalled;
            
            return keepDevice;
        });
    }

    const transformedDevices = devices.map(device => ({
        ...device,
        type: config.deviceType
    }));

    return transformedDevices;
};

  const queryVariables = config.getVariables(params);

  return (
    <DeviceListBase
      query={config.query}
      dataKey={config.dataKey}
      deviceType={config.deviceType}
      transformData={transformData}
      queryOptions={{
        variables: queryVariables,
        fetchPolicy: 'network-only'
      }}
      paginationConfig={{
        itemsPerPage: ITEMS_PER_PAGE,
        getPageInfo: (data) => USES_PAGINATION[filterType] ? data?.[config.dataKey]?.pageInfo : null,
        getTotalCount: (data) => USES_PAGINATION[filterType] 
          ? data?.[config.dataKey]?.totalCount 
          : (data?.[config.dataKey]?.length || 0)
      }}
    />
  );
};

export default FilteredDeviceList;
