import { gql } from '@apollo/client';

// Base compliance data query
const GET_COMPLIANCE_DATA = gql`
    query getComplianceData($consoleUser: ID!, $first: Int, $after: String) {
        installedMacApplications
        installediPhoneApplications
        installediPadApplications
        installedMacProfiles
        installediPhoneProfiles
        installediPadProfiles
        compliancecardprefs(consoleUser: $consoleUser) {
            complianceCardPrefs {
                type
                title
                arg
                platform
            }
        }
        macs(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    mdmProfileInstalled
                    QueryResponses {
                        OSVersion
                        SystemIntegrityProtectionEnabled
                    }
                    SecurityInfo {
                        FDE_Enabled
                    }
                    Applications {
                        Name
                        Version
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
        iphones(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    mdmProfileInstalled
                    QueryResponses {
                        OSVersion
                    }
                    Applications {
                        Name
                        Version
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
        ipads(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    mdmProfileInstalled
                    QueryResponses {
                        OSVersion
                    }
                    Applications {
                        Name
                        Version
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

// Device security queries
const GET_MAC_ENCRYPTION_LIST = gql`
    query getMacEncryptionList($FDE_Enabled: Boolean!, $first: Int, $after: String) {
        encryptedMacs(FDE_Enabled: $FDE_Enabled, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                    }
                    SecurityInfo {
                        FDE_Enabled
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_MAC_SIP_LIST = gql`
    query getMacSIPList($SystemIntegrityProtectionEnabled: Boolean!, $first: Int, $after: String) {
        sipMacs(SystemIntegrityProtectionEnabled: $SystemIntegrityProtectionEnabled, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        SystemIntegrityProtectionEnabled
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;


const GET_MDM_ENROLLED_MACS = gql`
    query getMDMEnrolledMacs($mdmProfileInstalled: Boolean!, $first: Int, $after: String) {
        mdmEnrolledMacs(mdmProfileInstalled: $mdmProfileInstalled, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    mdmProfileInstalled
                    QueryResponses {
                        DeviceName
                    }
                    Profiles {
                        PayloadDisplayName
                        IsManaged
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

// OS Version queries
const GET_MACS_BY_OSVERSION = gql`
    query getMacsByOSVersion($OSVersion: String!, $first: Int, $after: String) {
        macs(filter: { OSVersion: $OSVersion }, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_IPADS_BY_OSVERSION = gql`
    query getiPadsByOSVersion($OSVersion: String!, $first: Int, $after: String) {
        ipads(filter: { OSVersion: $OSVersion }, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_IPHONES_BY_OSVERSION = gql`
    query getiPhonesByOSVersion($OSVersion: String!, $first: Int, $after: String) {
        iphones(filter: { OSVersion: $OSVersion }, first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    Profiles {
                        PayloadDisplayName
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;


// Application version queries
const GET_MACS_WITH_APP_VERSION = gql`
    query getMacsWithAppVersion($Name: String!, $Version: String!) {
        macsWithAppVersion(Name: $Name, Version: $Version) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            Applications {
                Name
                Version
                ShortVersion
                BundleSize
                Installing
            }
            Profiles {
                PayloadDisplayName
            }
            updatedAt
        }
    }
`;


const GET_IPADS_WITH_APP_VERSION = gql`
    query getiPadsWithAppVersion($Name: String!, $Version: String!) {
        iPadsWithAppVersion(Name: $Name, Version: $Version) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            Applications {
                Name
                Version
                ShortVersion
                BundleSize
                Installing
            }
            Profiles {
                PayloadDisplayName
            }
            updatedAt
        }
    }
`;

const GET_IPHONES_WITH_APP_VERSION = gql`
    query getiPhonesWithAppVersion($Name: String!, $Version: String!) {
        iPhonesWithAppVersion(Name: $Name, Version: $Version) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            Applications {
                Name
                Version
                ShortVersion
                BundleSize
                Installing
            }
            Profiles {
                PayloadDisplayName
            }
            updatedAt
        }
    }
`;

// Application distribution query
const GET_MAC_APP_DISTRIBUTION = gql`
    query getMacAppDistribution($Name: String!) {
        macApplicationVersionDistribution(applicationName: $Name) {
            version
            deviceCount
        }
    }
`;

// Profile queries for each device type


const GET_MACS_WITH_PROFILES = gql`
    query getMacsWithProfiles($first: Int, $after: String) {
        macs(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                    }
                    Profiles {
                        PayloadDisplayName
                        PayloadIdentifier
                        PayloadUUID
                        PayloadVersion
                        IsManaged
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_IPHONES_WITH_PROFILES = gql`
    query getIPhonesWithProfiles($first: Int, $after: String) {
        iphones(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                    }
                    Profiles {
                        PayloadDisplayName
                        PayloadIdentifier
                        PayloadUUID
                        PayloadVersion
                        IsManaged
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_IPADS_WITH_PROFILES = gql`
    query getIPadsWithProfiles($first: Int, $after: String) {
        ipads(first: $first, after: $after) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                    }
                    Profiles {
                        PayloadDisplayName
                        PayloadIdentifier
                        PayloadUUID
                        PayloadVersion
                        IsManaged
                    }
                    updatedAt
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

const GET_OPTIMIZED_COMPLIANCE_DATA = gql`
  query getOptimizedComplianceData(
    $consoleUser: ID!,
    $first: Int,
    $after: String
  ) {
    installedMacApplications
    installediPhoneApplications
    installediPadApplications
    installedMacProfiles
    installediPhoneProfiles
    installediPadProfiles
    compliancecardprefs(consoleUser: $consoleUser) {
      complianceCardPrefs {
        type
        title
        arg
        platform
      }
    }
    macs(first: $first, after: $after) {
      edges {
        node {
          SerialNumber
          UDID
          mdmProfileInstalled
          BuildVersion
          OSVersion
          ProductName
          QueryResponses {
            OSVersion
            SystemIntegrityProtectionEnabled
            DeviceName
          }
          SecurityInfo {
            FDE_Enabled
          }
          Applications {
            Name
            Version
            ShortVersion
            BundleSize
            Installing
          }
          Profiles {
            PayloadDisplayName
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
    iphones(first: $first, after: $after) {
      edges {
        node {
          SerialNumber
          UDID
          mdmProfileInstalled
          BuildVersion
          OSVersion
          ProductName
          QueryResponses {
            OSVersion
            DeviceName
          }
          Applications {
            Name
            Version
            ShortVersion
            BundleSize
            Installing
          }
          Profiles {
            PayloadDisplayName
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
    ipads(first: $first, after: $after) {
      edges {
        node {
          SerialNumber
          UDID
          mdmProfileInstalled
          BuildVersion
          OSVersion
          ProductName
          QueryResponses {
            OSVersion
            DeviceName
          }
          Applications {
            Name
            Version
            ShortVersion
            BundleSize
            Installing
          }
          Profiles {
            PayloadDisplayName
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export {
    GET_COMPLIANCE_DATA,
    GET_MAC_ENCRYPTION_LIST,
    GET_MAC_SIP_LIST,
    GET_MDM_ENROLLED_MACS,
    GET_MACS_BY_OSVERSION,
    GET_IPADS_BY_OSVERSION,
    GET_IPHONES_BY_OSVERSION,
    GET_MACS_WITH_APP_VERSION,
    GET_IPADS_WITH_APP_VERSION,
    GET_IPHONES_WITH_APP_VERSION,
    GET_MAC_APP_DISTRIBUTION,
    GET_MACS_WITH_PROFILES,
    GET_IPADS_WITH_PROFILES,
    GET_IPHONES_WITH_PROFILES,
    GET_OPTIMIZED_COMPLIANCE_DATA
};
