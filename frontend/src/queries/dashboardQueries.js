import { gql } from '@apollo/client';

const GET_COMPLIANCE_DATA = gql`
    query getComplianceData($consoleUser: ID!) {
        installedMacApplications
        installediPhoneApplications
        installediPadApplications
        compliancecardprefs(consoleUser: $consoleUser) {
            complianceCardPrefs {
                type
                title
                arg
                platform
            }
        }
        macs {
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
        iphones {
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
        ipads {
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
`

const GET_MAC_ENCRYPTION_LIST = gql`
    query getMacEncryptionList($FDE_Enabled: Boolean!) {
        encryptedMacs(FDE_Enabled: $FDE_Enabled) {
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
`

const GET_MAC_SIP_LIST = gql`
    query getMacSIPList($SystemIntegrityProtectionEnabled: Boolean!) {
        sipMacs(SystemIntegrityProtectionEnabled: $SystemIntegrityProtectionEnabled) {
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
`

const GET_MDM_ENROLLED_MACS = gql`
    query getMDMEnrolledMacs($mdmProfileInstalled: Boolean!) {
        mdmEnrolledMacs(mdmProfileInstalled: $mdmProfileInstalled) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            mdmProfileInstalled
            QueryResponses {
                DeviceName
            }
            updatedAt
        }
    }
`

const GET_MACS_BY_OSVERSION = gql`
    query getMacsByOSVersion($OSVersion: String!) {
        macsByOSVersion(OSVersion: $OSVersion) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            updatedAt
        }
    }
`

const GET_IPADS_BY_OSVERSION = gql`
    query getiPadsByOSVersion($OSVersion: String!) {
        iPadsByOSVersion(OSVersion: $OSVersion) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            updatedAt
        }
    }
`

const GET_IPHONES_BY_OSVERSION = gql`
    query getiPhonesByOSVersion($OSVersion: String!) {
        iPhonesByOSVersion(OSVersion: $OSVersion) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
            updatedAt
        }
    }
`






export { GET_COMPLIANCE_DATA, GET_MAC_ENCRYPTION_LIST, GET_MAC_SIP_LIST, GET_MDM_ENROLLED_MACS, GET_MACS_BY_OSVERSION, GET_IPADS_BY_OSVERSION, GET_IPHONES_BY_OSVERSION };

