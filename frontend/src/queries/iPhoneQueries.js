import { gql } from '@apollo/client';

const GET_IPHONE = gql`
    query getiPhone($SerialNumber: String!) {
        configProfiles {
            PayloadDisplayName
            PayloadDescription
            PayloadOrganization
            PayloadIdentifier
            PayloadUUID
            MobileConfigData
        }
        iphone(SerialNumber: $SerialNumber) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            mdmProfileInstalled
            QueryResponses {
                AppAnalyticsEnabled
                AvailableDeviceCapacity
                AwaitingConfiguration
                BatteryLevel
                BluetoothMAC
                BuildVersion
                CellularTechnology
                DataRoamingEnabled
                DeviceCapacity
                DeviceName
                IsActivationLockEnabled
                IsCloudBackupEnabled
                IsDeviceLocatorServiceEnabled
                IsDoNotDisturbInEffect
                IsSupervised
                Model
                ModelName
                ModelNumber
                OSVersion
                PersonalHotspotEnabled
                ProductName
                SerialNumber
                SoftwareUpdateDeviceID
                SupplementalBuildVersion
                TimeZone
                UDID
                WiFiMAC
            }
            Applications {
              Identifier
              Name
              Version
            }
            Profiles {
                HasRemovalPasscode
                IsEncrypted
                IsManaged
                PayloadDescription
                PayloadDisplayName
                PayloadIdentifier
                PayloadOrganization
                PayloadType
                PayloadUUID
                PayloadVersion
                PayloadRemovalDisallowed
                PayloadContent {
                    PayloadDescription
                    PayloadDisplayName
                    PayloadIdentifier
                    PayloadOrganization
                    PayloadType
                    PayloadUUID
                    PayloadVersion
                }
              }
            CertificateList {
                CommonName
                IsIdentity
            }
            updatedAt
        }
    }
`

export { GET_IPHONE };
