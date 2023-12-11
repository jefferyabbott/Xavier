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

export { GET_ALL_DEVICES, GET_ALL_IPADS, GET_ALL_IPHONES, GET_ALL_MACS };
