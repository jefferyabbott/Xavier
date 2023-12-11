import { gql } from '@apollo/client';

const GET_COMPLIANCE_DATA = gql`
    query getComplianceData($consoleUser: ID!) {
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
                Identifier
                Name
                Version
            }
            Profiles {
                PayloadDisplayName
                PayloadUUID
            }
        }
        iphones {
            SerialNumber
            mdmProfileInstalled
            QueryResponses {
                OSVersion
            }
            Applications {
                Identifier
                Name
                Version
            }
            Profiles {
                PayloadDisplayName
                PayloadUUID
            }
        }
        ipads {
            SerialNumber
            mdmProfileInstalled
            QueryResponses {
                OSVersion
            }
            Applications {
                Identifier
                Name
                Version
            }
            Profiles {
                PayloadDisplayName
                PayloadUUID
            }
        }
    }
`

export { GET_COMPLIANCE_DATA };

