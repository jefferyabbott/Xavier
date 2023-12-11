import { gql } from '@apollo/client';

const GET_CONFIG_PROFILES = gql`
query getConfigProfiles {
    configProfiles {
        PayloadDisplayName
        PayloadDescription
        PayloadOrganization
        PayloadIdentifier
        PayloadUUID
        MobileConfigData
    }
}
`

export { GET_CONFIG_PROFILES };
