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

export { GET_COMPLIANCE_DATA };

