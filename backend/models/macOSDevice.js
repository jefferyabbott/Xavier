import mongoose from 'mongoose';

const macOSDeviceSchema = new mongoose.Schema({
  SerialNumber: {
    type: String
  },
  UDID: {
    type: String
  },
  mdmProfileInstalled: {
    type: Boolean
  },

  // these are from Authenticate and are here as a placeholder while troubleshooting iOS QueryResponses
  BuildVersion: {
    type: String
  },
  IMEI: {
    type: String
  },
  OSVersion: {
    type: String
  },
  ProductName: {
    type: String
  },
  Topic: {
    type: String
  },
  unlockPins: [ 
    {
      pin: {
        type: String
      }
    }
  ],
  QueryResponses: {
    // ActiveManagedUsers: [],
    // AutoSetupAdminAccounts: [],
    AvailableDeviceCapacity: {
      type: Number
    },
    AwaitingConfiguration: {
      type: Boolean
    },
    BatteryLevel: {
      type: Number
    },
    BluetoothMAC: {
      type: String
    },
    BuildVersion: {
      type: String
    },
    DeviceCapacity: {
      type: Number
    },
    DeviceName: {
      type: String
    },
    EACSPreflight: {
      type: String
    },
    EthernetMAC: {
      type: String
    },
    HasBattery: {
      type: Boolean
    },
    HostName: {
      type: String
    },
    IsActivationLockEnabled: {
      type: Boolean
    },
    IsActivationLockSupported: {
      type: Boolean
    },
    IsAppleSilicon: {
      type: Boolean
    },
    IsSupervised: {
      type: Boolean
    },
    LocalHostName: {
      type: String
    },
    // MDMOptions: {},
    Model: {
      type: String
    },
    ModelName: {
      type: String
    },
    ModelNumber: {
      type: String
    },
    OSUpdateSettings: {
        AutoCheckEnabled: {
          type: Boolean
        },
        AutomaticAppInstallationEnabled: {
          type: Boolean
        },
        AutomaticOSInstallationEnabled: {
          type: Boolean
        },
        AutomaticSecurityUpdatesEnabled: {
          type: Boolean
        },
        BackgroundDownloadEnabled: {
          type: Boolean
        },
        CatalogURL: {
          type: String
        },
        IsDefaultCatalog: {
          type: Boolean
        },
        PreviousScanDate: {
          type: String
        },
        PreviousScanResult: {
          type: Number
        },
    },
    OSVersion: {
      type: String
    },
    OSXSoftwareUpdateStatus: {
        AutoCheckEnabled: {
          type: Boolean
        },
        AutomaticAppInstallationEnabled: {
          type: Boolean
        },
        AutomaticOSInstallationEnabled: {
          type: Boolean
        },
        AutomaticSecurityUpdatesEnabled: {
          type: Boolean
        },
        BackgroundDownloadEnabled: {
          type: Boolean
        },
        CatalogURL: {
          type: String
        },
        IsDefaultCatalog: {
          type: Boolean
        },
        PreviousScanDate: {
          type: String
        },
        PreviousScanResult: {
          type: Number
        },
    },
    PINRequiredForDeviceLock: {
      type: Boolean
    },
    PINRequiredForEraseDevice: {
      type: Boolean
    },
    ProductName: {
      type: String
    },
    ProvisioningUDID: {
      type: String
    },
    SerialNumber: {
      type: String
    },
    SoftwareUpdateDeviceID: {
      type: String
    },
    SupplementalBuildVersion: {
      type: String
    },
    SupportsLOMDevice: {
      type: Boolean
    },
    SupportsiOSAppInstalls: {
      type: Boolean
    },
    SystemIntegrityProtectionEnabled: {
      type: Boolean
    },
    UDID: {
      type: String
    },
    WiFiMAC: {
      type: String
    },
    XsanConfiguration: {
        role: {
          type: String
        }
    } 
  },
  SecurityInfo: {
    AuthenticatedRootVolumeEnabled: {
      type: Boolean
    },
    BootstrapTokenAllowedForAuthentication: {
      type: String
    },
    BootstrapTokenRequiredForKernelExtensionApproval: {
      type: Boolean
    },
    BootstrapTokenRequiredForSoftwareUpdate: {
      type: Boolean
    },
    FDE_Enabled: {
      type: Boolean
    },
    FDE_HasInstitutionalRecoveryKey: {
      type: Boolean
    },
    FDE_HasPersonalRecoveryKey: {
      type: Boolean
    },
    AllowSigned: {
      type: Boolean
    },
    AllowSignedApp: {
      type: Boolean
    },
    BlockAllIncoming: {
      type: Boolean
    },
    FirewallEnabled: {
      type: Boolean
    },
    LoggingEnabled: {
      type: Boolean
    },
    LoggingOption: {
      type: String
    },
    StealthMode: {
      type: Boolean
    },
    IsRecoveryLockEnabled: {
      type: Boolean
    },
    EnrolledViaDEP: {
      type: Boolean
    },
    IsActivationLockManageable: {
      type: Boolean
    },
    IsUserEnrollment: {
      type: Boolean
    },
    UserApprovedEnrollment: {
      type: Boolean
    },
    RemoteDesktopEnabled: {
      type: Boolean
    },
  
    ExternalBootLevel: {
      type: String
    },
    SecureBootLevel: {
      type: String
    },
    WindowsBootLevel: {
      type: String
    },
  },
  Applications: [
    {
      BundleSize: {
        type: Number  
      },
      Identifier: {
        type: String
      },
      Installing: {
        type: Boolean
      },
      Name: {
        type: String
      },
      ShortVersion: {
        type: String
      },
      Version: {
        type: String
      }
    }
  ],
  Profiles: [
    {
      HasRemovalPasscode: {
        type: Boolean
      },
      IsEncrypted: {
        type: Boolean
      },
      IsManaged: {
        type: Boolean
      },
      PayloadDescription: {
        type: String
      },
      PayloadDisplayName: {
        type: String
      },
      PayloadIdentifier: {
        type: String
      },
      PayloadOrganization: {
        type: String
      },
      PayloadType: {
        type: String
      },
      PayloadUUID: {
        type: String
      },
      PayloadVersion: {
        type: Number
      },
      PayloadRemovalDisallowed: {
        type: Boolean
      },
      PayloadContent: [
        {
          PayloadDescription: {
            type: String
          },
          PayloadDisplayName: {
            type: String
          },
          PayloadIdentifier: {
            type: String
          },
          PayloadOrganization: {
            type: String
          },
          PayloadType: {
            type: String
          },
          PayloadUUID: {
            type: String
          },
          PayloadVersion: {
            type: Number
          }
        }
      ],
    },
  ],
  CertificateList: [
    {
      CommonName: {
        type: String
      },
      IsIdentity: {
        type: Boolean
      }
    }
  ],
  lastCheckedIn: {
    type: Date,
    default: Date.now,
  },

});

const macOSDevice = mongoose.model('macOSDevices', macOSDeviceSchema);

export default macOSDevice;



