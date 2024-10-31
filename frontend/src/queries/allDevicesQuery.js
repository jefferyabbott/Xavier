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

const GET_ALL_MACS_AND_PROFILES = gql`
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

const GET_ALL_IPADS_AND_PROFILES = gql`
    query getAllDevices($first: Int, $after: String) {
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

const GET_ALL_IPHONES_AND_PROFILES = gql`
    query getAllDevices($first: Int, $after: String) {
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

export { GET_ALL_DEVICES, GET_ALL_IPADS_AND_PROFILES, GET_ALL_MACS_AND_PROFILES, GET_ALL_IPHONES_AND_PROFILES };
