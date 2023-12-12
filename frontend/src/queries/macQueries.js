import { gql } from '@apollo/client';

const GET_MAC = gql`
    query getMac($SerialNumber: String!) {
        configProfiles {
            PayloadDisplayName
            PayloadDescription
            PayloadOrganization
            PayloadIdentifier
            PayloadUUID
            MobileConfigData
        }
        mac(SerialNumber: $SerialNumber) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            mdmProfileInstalled
            unlockPins {
                pin
            }
            QueryResponses {
                AvailableDeviceCapacity
                BluetoothMAC
                BuildVersion
                DeviceCapacity
                DeviceName
                EthernetMAC
                HostName
                IsActivationLockEnabled
                IsAppleSilicon
                IsSupervised
                LocalHostName
                Model
                ModelName
                ModelNumber
                OSUpdateSettings {
                    AutoCheckEnabled
                    AutomaticAppInstallationEnabled
                    AutomaticOSInstallationEnabled
                    AutomaticSecurityUpdatesEnabled
                    BackgroundDownloadEnabled
                }
                OSVersion
                ProductName
                SerialNumber
                SystemIntegrityProtectionEnabled
                UDID
                WiFiMAC
            }
            SecurityInfo {
                FDE_Enabled
                FDE_HasInstitutionalRecoveryKey
                FDE_HasPersonalRecoveryKey
                AllowSigned
                AllowSignedApp
                BlockAllIncoming
                FirewallEnabled
                LoggingEnabled
                LoggingOption
                StealthMode
                IsRecoveryLockEnabled
                EnrolledViaDEP
                IsActivationLockManageable
                IsUserEnrollment
                UserApprovedEnrollment
                RemoteDesktopEnabled
                ExternalBootLevel
                SecureBootLevel
                WindowsBootLevel
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
        }
    }
`

export { GET_MAC };
