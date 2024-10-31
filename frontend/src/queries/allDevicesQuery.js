import { gql } from '@apollo/client';

const GET_ALL_DEVICES = gql`
    query getAllDevices($first: Int, $after: String) {
        macs(first: $first, after: $after) {
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
                    updatedAt
                }
                cursor
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
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
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
                    ProductName
                    OSVersion
                    UDID
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;


export { GET_ALL_DEVICES };
