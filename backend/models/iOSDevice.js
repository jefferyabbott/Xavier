import mongoose from 'mongoose';

const iOSDeviceSchema = new mongoose.Schema({
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
  UnlockToken: {
    type: String
  },


  QueryResponses: {
    // ActiveManagedUsers: [],
    // AutoSetupAdminAccounts: [],
    AppAnalyticsEnabled: {
        type: Boolean
    }, // CONFIRM
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
    CellularTechnology: {
        type: Number
    }, // CONFIRM
    DataRoamingEnabled: {
        type: Boolean
    }, // CONFIRM
    DeviceCapacity: {
      type: Number
    },
    DeviceName: {
      type: String
    },
    IsActivationLockEnabled: {
      type: Boolean
    },
    IsCloudBackupEnabled: {
        type: Boolean
    }, // CONFIRM
    IsDeviceLocatorServiceEnabled: {
        type: Boolean
    }, // CONFIRM
    IsDoNotDisturbInEffect: {
        type: Boolean
    }, // CONFIRM
    IsSupervised: {
      type: Boolean
    },
    LastCloudBackupDate: {
        type: Date
    }, // CONFIRM
    Model: {
      type: String
    },
    ModelName: {
      type: String
    },
    ModelNumber: {
      type: String
    },
    OSVersion: {
      type: String
    },
    PersonalHotspotEnabled: {
        type: Boolean
    }, // CONFIRM
    ProductName: {
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
    TimeZone: {
      type: String
    }, // CONFIRM
    UDID: {
      type: String
    },
    WiFiMAC: {
      type: String
    },
    ServiceSubscriptions: [
      {
        CarrierSettingsVersion: {
          type: String
        },
        CurrentCarrierNetwork: {
          type: String
        },
        CurrentMCC: {
          type: String
        },
        CurrentMNC: {
          type: String
        },
        EID: {
          type: String
        },
        ICCID: {
          type: String
        },
        IMEI: {
          type: String
        },
        IsDataPreferred: {
          type: Boolean
        },
        IsRoaming: {
          type: Boolean
        },
        IsVoicePreferred: {
          type: Boolean
        },
        Label: {
          type: String
        },
        LabelID: {
          type: String
        },
        PhoneNumber: {
          type: String
        },
        Slot: {
          type: String
        },
        SubscriberCarrierNetwork: {
          type: String
        }
      }
    ]
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
  SecurityInfo: {
    HardwareEncryptionCaps: {
      type: Number
    },
    ManagementStatus: { 
      IsUserEnrollment: {
        type: Boolean
      } 
    },
    PasscodeCompliant: {
      type: Boolean
    },
    PasscodeCompliantWithProfiles: {
      type: Boolean
    },
    PasscodeLockGracePeriod: {
      type: Number
    },
    PasscodeLockGracePeriodEnforced: {
      type: Number
    },
    PasscodePresent: {
      type: Boolean
    }
  }
}, {
  timestamps: true
});

const iOSDevice = mongoose.model('iOSDevices', iOSDeviceSchema);

export default iOSDevice;
