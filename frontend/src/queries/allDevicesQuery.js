import { gql } from '@apollo/client';

const GET_ALL_DEVICES = gql`
    query getAllDevices {
        macs {
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
        iphones {
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
        ipads {
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
    }
`

const GET_ALL_MACS = gql`
    query getAllDevices {
        macs {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
        }
    }
`

const GET_ALL_IPADS = gql`
    query getAllDevices {
        ipads {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
        }
    }
`

const GET_ALL_IPHONES = gql`
    query getAllDevices {
        iphones {
            SerialNumber
            ProductName
            OSVersion
            UDID
            QueryResponses {
                DeviceName
            }
        }
    }
`

const GET_ALL_MACS_AND_PROFILES = gql`
    query getAllDevices {
        macs {
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
`

const GET_ALL_IPADS_AND_PROFILES = gql`
    query getAllDevices {
        ipads {
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
`

const GET_ALL_IPHONES_AND_PROFILES = gql`
    query getAllDevices {
        iphones {
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
`

export { GET_ALL_DEVICES, GET_ALL_IPADS, GET_ALL_IPHONES, GET_ALL_MACS, GET_ALL_MACS_AND_PROFILES, GET_ALL_IPADS_AND_PROFILES, GET_ALL_IPHONES_AND_PROFILES };
