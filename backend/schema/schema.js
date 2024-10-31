import { 
  GraphQLObjectType, 
  GraphQLID, 
  GraphQLString, 
  GraphQLBoolean, 
  GraphQLList, 
  GraphQLSchema, 
  GraphQLInt, 
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInterfaceType
} from 'graphql';
import DataLoader from 'dataloader';
import macOSDevice from '../models/macOSDevice.js';
import iOSDevice from '../models/iOSDevice.js';
import iPadOSDevice from '../models/iPadOSDevice.js';
import profile from '../models/profile.js';
import consoleUser from '../models/consoleUser.js';
import complianceCardPrefs from '../models/complianceCard.js';
import command from '../models/commandHistory.js';

// Input Types
const ApplicationVersionFilterInput = new GraphQLInputObjectType({
  name: 'ApplicationVersionFilter',
  fields: {
    Name: { type: GraphQLString },
    Version: { type: GraphQLString },
    minBundleSize: { type: GraphQLFloat },
    maxBundleSize: { type: GraphQLFloat }
  }
});

const DeviceFilterInput = new GraphQLInputObjectType({
  name: 'DeviceFilter',
  fields: {
    OSVersion: { type: GraphQLString },
    mdmProfileInstalled: { type: GraphQLBoolean },
    SystemIntegrityProtectionEnabled: { type: GraphQLBoolean }
  }
});

// Basic Types
const ApplicationVersionInfoType = new GraphQLObjectType({
  name: 'applicationVersionInfo',
  fields: () => ({
    deviceSerialNumber: { type: GraphQLString },
    deviceName: { type: GraphQLString },
    deviceModel: { type: GraphQLString },
    osVersion: { type: GraphQLString },
    appVersion: { type: GraphQLString },
    appShortVersion: { type: GraphQLString },
    bundleSize: { type: GraphQLFloat },
    installing: { type: GraphQLBoolean }
  })
});

const ApplicationType = new GraphQLObjectType({
  name: 'application',
  fields: () => ({
    BundleSize: { type: GraphQLFloat },
    Identifier: { type: GraphQLString },
    Installing: { type: GraphQLBoolean },
    Name: { type: GraphQLString },
    ShortVersion: { type: GraphQLString },
    Version: { type: GraphQLString },
  })
});

const ProfilePayloadType = new GraphQLObjectType({
  name: "profilePayload",
  fields: () => ({
    PayloadDescription: { type: GraphQLString },
    PayloadDisplayName: { type: GraphQLString },
    PayloadIdentifier: { type: GraphQLString },
    PayloadOrganization: { type: GraphQLString },
    PayloadType: { type: GraphQLString },
    PayloadUUID: { type: GraphQLString },
    PayloadVersion: { type: GraphQLInt },
  })
});

const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    HasRemovalPasscode: { type: GraphQLBoolean },
    IsEncrypted: { type: GraphQLBoolean },
    IsManaged: { type: GraphQLBoolean },
    PayloadDescription: { type: GraphQLString },
    PayloadDisplayName: { type: GraphQLString },
    PayloadIdentifier: { type: GraphQLString },
    PayloadOrganization: { type: GraphQLString },
    PayloadType: { type: GraphQLString },
    PayloadUUID: { type: GraphQLString },
    PayloadVersion: { type: GraphQLInt },
    PayloadRemovalDisallowed: { type: GraphQLBoolean },
    PayloadContent: { type: new GraphQLList(ProfilePayloadType)},
  })
});

const CertificateType = new GraphQLObjectType({
  name: 'certificate',
  fields: () => ({
    CommonName: { type: GraphQLString },
    IsIdentity: { type: GraphQLBoolean }
  })
});

const MacOSUpdateSettingsType = new GraphQLObjectType({
  name: 'OSUpdateSettings',
  fields: () => ({
    AutoCheckEnabled: { type: GraphQLBoolean },
    AutomaticAppInstallationEnabled: { type: GraphQLBoolean },
    AutomaticOSInstallationEnabled: { type: GraphQLBoolean },
    AutomaticSecurityUpdatesEnabled: { type: GraphQLBoolean },
    BackgroundDownloadEnabled: { type: GraphQLBoolean },
    CatalogURL: { type: GraphQLString },
    IsDefaultCatalog: { type: GraphQLBoolean },
    PreviousScanDate: { type: GraphQLString },
    PreviousScanResult: { type: GraphQLInt },
  })
});

const AvailableSoftwareUpdatesType = new GraphQLObjectType({
  name: 'AvailableSoftwareUpdates',
  fields: () => ({
    AllowsInstallLater: { type: GraphQLBoolean },
    Build: { type: GraphQLString },
    DownloadSize: { type: GraphQLInt },
    HumanReadableName: { type: GraphQLString },
    HumanReadableNameLocale: { type: GraphQLString },
    IsConfigDataUpdate: { type: GraphQLBoolean },
    IsCritical: { type: GraphQLBoolean },
    IsFirmwareUpdate: { type: GraphQLBoolean },
    IsSecurityResponse: { type: GraphQLBoolean },
    ProductKey: { type: GraphQLString },
    RequiresBootstrapToken: { type: GraphQLBoolean },
    RestartRequired: { type: GraphQLBoolean },
    SupplementalBuildVersion: { type: GraphQLString },
    Version: { type: GraphQLString },
  })
});

const MacSecurityInfoType = new GraphQLObjectType({
  name: 'SecurityInfo',
  fields: () => ({
    AuthenticatedRootVolumeEnabled: { type: GraphQLBoolean },
    BootstrapTokenAllowedForAuthentication: { type: GraphQLString },
    BootstrapTokenRequiredForKernelExtensionApproval: { type: GraphQLBoolean },
    BootstrapTokenRequiredForSoftwareUpdate: { type: GraphQLBoolean },
    FDE_Enabled: { type: GraphQLBoolean },
    FDE_HasInstitutionalRecoveryKey: { type: GraphQLBoolean },
    FDE_HasPersonalRecoveryKey: { type: GraphQLBoolean },
    AllowSigned: { type: GraphQLBoolean },
    AllowSignedApp: { type: GraphQLBoolean },
    BlockAllIncoming: { type: GraphQLBoolean },
    FirewallEnabled: { type: GraphQLBoolean },
    LoggingEnabled: { type: GraphQLBoolean },
    LoggingOption: { type: GraphQLString },
    StealthMode: { type: GraphQLBoolean },
    IsRecoveryLockEnabled: { type: GraphQLBoolean },
    EnrolledViaDEP: { type: GraphQLBoolean },
    IsActivationLockManageable: { type: GraphQLBoolean },
    IsUserEnrollment: { type: GraphQLBoolean },
    UserApprovedEnrollment: { type: GraphQLBoolean },
    RemoteDesktopEnabled: { type: GraphQLBoolean },
    ExternalBootLevel: { type: GraphQLString },
    SecureBootLevel: { type: GraphQLString },
    WindowsBootLevel: { type: GraphQLString },
  })
});

const UnlockPinType = new GraphQLObjectType({
  name: "unlockPin",
  fields: () => ({
    pin: { type: GraphQLString },
  })
});

const ConfigProfileType = new GraphQLObjectType({
  name: "configProfile",
  fields: () => ({
    PayloadDescription: { type: GraphQLString },
    PayloadDisplayName: { type: GraphQLString },
    PayloadIdentifier: { type: GraphQLString },
    PayloadOrganization: { type: GraphQLString },
    PayloadType: { type: GraphQLString },
    PayloadUUID: { type: GraphQLString },
    MobileConfigData: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const ComplianceCardPrefType = new GraphQLObjectType({
  name: 'compliancecardpref',
  fields: () => ({
    type: { type: GraphQLString },
    title: { type: GraphQLString },
    arg: { type: GraphQLString },
    platform: { type: GraphQLString }
  })
});

const ComplianceCardPrefsType = new GraphQLObjectType({
  name: 'compliancecardprefs',
  fields: () => ({
    consoleUser: { type: GraphQLID },
    complianceCardPrefs: { type: new GraphQLList(ComplianceCardPrefType)}
  })
});

const ConsoleUserType = new GraphQLObjectType({
  name: 'consoleuser',
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    userType: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const CommandLogType = new GraphQLObjectType({
  name: 'commandlog',
  fields: () => ({
    CommandUUID: { type: GraphQLString },
    RequestType: { type: GraphQLString },
    Requester: { type: GraphQLID },
    Approver: { type: GraphQLID },
    DeviceUDID: { type: GraphQLString },
    Response: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

// Query Response Types
const MacQueryResponseType = new GraphQLObjectType({
  name: 'macQueryResponse',
  fields: () => ({
    AvailableDeviceCapacity: { type: GraphQLFloat },
    AwaitingConfiguration: { type: GraphQLBoolean },
    BatteryLevel: { type: GraphQLInt },
    BluetoothMAC: { type: GraphQLString },
    BuildVersion: { type: GraphQLString },
    DeviceCapacity: { type: GraphQLInt },
    DeviceName: { type: GraphQLString },
    EACSPreflight: { type: GraphQLString },
    EthernetMAC: { type: GraphQLString },
    HasBattery: { type: GraphQLBoolean },
    HostName: { type: GraphQLString },
    IsActivationLockEnabled: { type: GraphQLBoolean },
    IsActivationLockSupported: { type: GraphQLBoolean },
    IsAppleSilicon: { type: GraphQLBoolean },
    IsSupervised: { type: GraphQLBoolean },
    LocalHostName: { type: GraphQLString },
    Model: { type: GraphQLString },
    ModelName: { type: GraphQLString },
    ModelNumber: { type: GraphQLString },
    OSUpdateSettings: { type: MacOSUpdateSettingsType },
    OSVersion: { type: GraphQLString },
    OSXSoftwareUpdateStatus: { type: MacOSUpdateSettingsType },
    PINRequiredForDeviceLock: { type: GraphQLBoolean },
    PINRequiredForEraseDevice: { type: GraphQLBoolean },
    ProductName: { type: GraphQLString },
    ProvisioningUDID: { type: GraphQLString},
    SerialNumber: { type: GraphQLString},
    SoftwareUpdateDeviceID: { type: GraphQLString },
    SupplementalBuildVersion: { type: GraphQLString },
    SupportsLOMDevice: { type: GraphQLBoolean },
    SupportsiOSAppInstalls: { type: GraphQLBoolean },
    SystemIntegrityProtectionEnabled: { type: GraphQLBoolean },
    UDID: { type: GraphQLString },
    WiFiMAC: { type: GraphQLString },
  })
});

const iPhoneServiceSubscriptionType = new GraphQLObjectType({
  name: 'iphoneservicesubscription',
  fields: () => ({
    CarrierSettingsVersion: { type: GraphQLString },
    CurrentCarrierNetwork: { type: GraphQLString },
    CurrentMCC: { type: GraphQLString },
    CurrentMNC: { type: GraphQLString },
    EID: { type: GraphQLString },
    ICCID: { type: GraphQLString },
    IMEI: { type: GraphQLString },
    IsDataPreferred: { type: GraphQLBoolean },
    IsRoaming: { type: GraphQLBoolean },
    IsVoicePreferred: { type: GraphQLBoolean },
    Label: { type: GraphQLString },
    LabelID: { type: GraphQLString },
    PhoneNumber: { type: GraphQLString },
    Slot: { type: GraphQLString },
    SubscriberCarrierNetwork: { type: GraphQLString }
  })
});

const iOSQueryResponseType = new GraphQLObjectType({
  name: 'iSOQueryResponse',
  fields: () => ({
    AppAnalyticsEnabled: { type: GraphQLBoolean },
    AvailableDeviceCapacity: { type: GraphQLFloat },
    AwaitingConfiguration: { type: GraphQLBoolean },
    BatteryLevel: { type: GraphQLFloat },
    BluetoothMAC: { type: GraphQLString },
    BuildVersion: { type: GraphQLString },
    CellularTechnology: { type: GraphQLInt },
    DataRoamingEnabled: { type: GraphQLBoolean },
    DeviceCapacity: { type: GraphQLInt },
    DeviceName: { type: GraphQLString },
    IsActivationLockEnabled: { type: GraphQLBoolean },
    IsCloudBackupEnabled: { type: GraphQLBoolean },
    IsDeviceLocatorServiceEnabled: { type: GraphQLBoolean },
    IsDoNotDisturbInEffect: { type: GraphQLBoolean },
    IsSupervised: { type: GraphQLBoolean },
    Model: { type: GraphQLString },
    ModelName: { type: GraphQLString },
    ModelNumber: { type: GraphQLString },
    OSVersion: { type: GraphQLString },
    PersonalHotspotEnabled: { type: GraphQLBoolean },
    ProductName: { type: GraphQLString },
    SerialNumber: { type: GraphQLString},
    SoftwareUpdateDeviceID: { type: GraphQLString },
    SupplementalBuildVersion: { type: GraphQLString },
    TimeZone: { type: GraphQLString },
    UDID: { type: GraphQLString },
    WiFiMAC: { type: GraphQLString },
    ServiceSubscriptions: { type: new GraphQLList(iPhoneServiceSubscriptionType) }
  })
});

// Device Interface
const DeviceInterface = new GraphQLInterfaceType({
  name: 'Device',
  fields: {
    SerialNumber: { type: GraphQLString },
    UDID: { type: GraphQLString },
    mdmProfileInstalled: { type: GraphQLBoolean },
    BuildVersion: { type: GraphQLString },
    OSVersion: { type: GraphQLString },
    ProductName: { type: GraphQLString },
    Topic: { type: GraphQLString },
    Applications: { type: new GraphQLList(ApplicationType) },
    Profiles: { type: new GraphQLList(ProfileType) },
    CertificateList: { type: new GraphQLList(CertificateType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  },
  resolveType(device) {
    if (device.ProductName.includes('MacBook') || device.ProductName.includes('iMac')) {
      return MacType;
    }
    if (device.ProductName.includes('iPhone')) {
      return iPhoneType;
    }
    if (device.ProductName.includes('iPad')) {
      return iPadType;
    }
    return null;
  }
});

// Device Types
const MacType = new GraphQLObjectType({
  name: 'macosdevice',
  interfaces: [DeviceInterface],
  fields: () => ({
    SerialNumber: { type: GraphQLString },
    UDID: { type: GraphQLString },
    mdmProfileInstalled: { type: GraphQLBoolean },
    BuildVersion: { type: GraphQLString },
    IMEI: { type: GraphQLString },
    OSVersion: { type: GraphQLString },
    ProductName: { type: GraphQLString },
    Topic: { type: GraphQLString },
    QueryResponses: { type: MacQueryResponseType },
    SecurityInfo: { type: MacSecurityInfoType },
    Applications: { type: new GraphQLList(ApplicationType) },
    Profiles: { type: new GraphQLList(ProfileType) },
    CertificateList: { type: new GraphQLList(CertificateType) },
    unlockPins: { type: new GraphQLList(UnlockPinType) },
    AvailableSoftwareUpdates: { type: new GraphQLList(AvailableSoftwareUpdatesType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const iPhoneType = new GraphQLObjectType({
  name: 'iphonedevice',
  interfaces: [DeviceInterface],
  fields: () => ({
    SerialNumber: { type: GraphQLString },
    UDID: { type: GraphQLString },
    mdmProfileInstalled: { type: GraphQLBoolean },
    BuildVersion: { type: GraphQLString },
    IMEI: { type: GraphQLString },
    OSVersion: { type: GraphQLString },
    ProductName: { type: GraphQLString },
    Topic: { type: GraphQLString },
    QueryResponses: { type: iOSQueryResponseType },
    Applications: { type: new GraphQLList(ApplicationType) },
    Profiles: { type: new GraphQLList(ProfileType) },
    CertificateList: { type: new GraphQLList(CertificateType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const iPadType = new GraphQLObjectType({
  name: 'ipaddevice',
  interfaces: [DeviceInterface],
  fields: () => ({
    SerialNumber: { type: GraphQLString },
    UDID: { type: GraphQLString },
    mdmProfileInstalled: { type: GraphQLBoolean },
    BuildVersion: { type: GraphQLString },
    IMEI: { type: GraphQLString },
    OSVersion: { type: GraphQLString },
    ProductName: { type: GraphQLString },
    Topic: { type: GraphQLString },
    QueryResponses: { type: iOSQueryResponseType },
    Applications: { type: new GraphQLList(ApplicationType) },
    Profiles: { type: new GraphQLList(ProfileType) },
    CertificateList: { type: new GraphQLList(CertificateType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

// Connection Types for Pagination
const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    hasNextPage: { type: GraphQLBoolean },
    endCursor: { type: GraphQLString }
  }
});

const createConnectionType = (nodeType, name) => {
  const edgeType = new GraphQLObjectType({
    name: `${name}Edge`,
    fields: {
      node: { type: nodeType },
      cursor: { type: GraphQLString }
    }
  });

  return new GraphQLObjectType({
    name: `${name}Connection`,
    fields: {
      edges: { type: new GraphQLList(edgeType) },
      pageInfo: { type: PageInfoType },
      totalCount: { type: GraphQLInt }
    }
  });
};

const MacConnection = createConnectionType(MacType, 'Mac');
const iPhoneConnection = createConnectionType(iPhoneType, 'iPhone');
const iPadConnection = createConnectionType(iPadType, 'iPad');

// Helper functions for pagination
const encodeCursor = (value) => Buffer.from(value.toString()).toString('base64');
const decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');

const paginateResults = async (model, args, baseQuery = {}) => {
  const limit = args.first || 10;
  const query = { ...baseQuery };
  
  if (args.after) {
    query._id = { $gt: decodeCursor(args.after) };
  }

  const items = await model
    .find(query)
    .limit(limit + 1)
    .lean();

  const hasNextPage = items.length > limit;
  const edges = items.slice(0, limit).map(item => ({
    node: item,
    cursor: encodeCursor(item._id)
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
    },
    totalCount: await model.countDocuments(baseQuery)
  };
};

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Paginated device queries
    macs: {
      type: MacConnection,
      args: {
        first: { type: GraphQLInt },
        after: { type: GraphQLString },
        filter: { type: DeviceFilterInput }
      },
      resolve(parent, args) {
        const baseQuery = args.filter ? buildFilterQuery(args.filter) : {};
        return paginateResults(macOSDevice, args, baseQuery);
      }
    },
    iphones: {
      type: iPhoneConnection,
      args: {
        first: { type: GraphQLInt },
        after: { type: GraphQLString },
        filter: { type: DeviceFilterInput }
      },
      resolve(parent, args) {
        const baseQuery = args.filter ? buildFilterQuery(args.filter) : {};
        return paginateResults(iOSDevice, args, baseQuery);
      }
    },
    ipads: {
      type: iPadConnection,
      args: {
        first: { type: GraphQLInt },
        after: { type: GraphQLString },
        filter: { type: DeviceFilterInput }
      },
      resolve(parent, args) {
        const baseQuery = args.filter ? buildFilterQuery(args.filter) : {};
        return paginateResults(iPadOSDevice, args, baseQuery);
      }
    },
    mac: {
      type: MacType,
      args: { SerialNumber: { type: GraphQLString }},
      resolve(parent, args, context) {
        return context.deviceLoader.load(args.SerialNumber);
      }
    },
    iphone: {
      type: iPhoneType,
      args: { SerialNumber: { type: GraphQLString }},
      resolve(parent, args, context) {
        return context.deviceLoader.load(args.SerialNumber);
      }
    },
    ipad: {
      type: iPadType,
      args: { SerialNumber: { type: GraphQLString }},
      resolve(parent, args, context) {
        return context.deviceLoader.load(args.SerialNumber);
      }
    },
    encryptedMacs: {
      type: MacConnection,  // Use the existing MacConnection type
      args: {
        FDE_Enabled: { type: GraphQLBoolean },
        first: { type: GraphQLInt },
        after: { type: GraphQLString }
      },
      resolve(parent, args) {
        const baseQuery = {
          "SecurityInfo.FDE_Enabled": args.FDE_Enabled
        };
        return paginateResults(macOSDevice, args, baseQuery);
      }
    },
    sipMacs: {
      type: MacConnection,  // Use the existing MacConnection type
      args: {
        SystemIntegrityProtectionEnabled: { type: GraphQLBoolean },
        first: { type: GraphQLInt },
        after: { type: GraphQLString }
      },
      resolve(parent, args) {
        const baseQuery = {
          "QueryResponses.SystemIntegrityProtectionEnabled": args.SystemIntegrityProtectionEnabled
        };
        return paginateResults(macOSDevice, args, baseQuery);
      }
    },
    mdmEnrolledMacs: {
      type: MacConnection,  // Use the existing MacConnection type
      args: {
        mdmProfileInstalled: { type: GraphQLBoolean },
        first: { type: GraphQLInt },
        after: { type: GraphQLString }
      },
      resolve(parent, args) {
        const baseQuery = {
          "mdmProfileInstalled": args.mdmProfileInstalled
        };
        return paginateResults(macOSDevice, args, baseQuery);
      }
    },
    macsByOSVersion: {
      type: new GraphQLList(MacType),
      args: { OSVersion: { type: GraphQLString }},
      resolve(parent, args) {
        return macOSDevice.find({"QueryResponses.OSVersion": args.OSVersion});
      }
    },
    iPhonesByOSVersion: {
      type: new GraphQLList(iPhoneType),
      args: { OSVersion: { type: GraphQLString }},
      resolve(parent, args) {
        return iOSDevice.find({"QueryResponses.OSVersion": args.OSVersion});
      }
    },
    iPadsByOSVersion: {
      type: new GraphQLList(iPadType),
      args: { OSVersion: { type: GraphQLString }},
      resolve(parent, args) {
        return iPadOSDevice.find({"QueryResponses.OSVersion": args.OSVersion});
      }
    },
    macsWithAppVersion: {
      type: new GraphQLList(MacType),
      args: { 
        Name: { type: GraphQLString },
        Version: { type: GraphQLString }
      },
      resolve(parent, args) {
        const allVersions = macOSDevice.distinct('Applications.Version', {
          'Applications.Name': args.Name
        });        
        const query = {
          "Applications": { 
            $elemMatch: { 
              "Name": args.Name, 
              "Version": args.Version 
            } 
          }
        };
        
        const result = macOSDevice.find(query);
        return result;
      }
    },
    iPadsWithAppVersion: {
      type: new GraphQLList(MacType),
      args: { 
        Name: { type: GraphQLString },
        Version: { type: GraphQLString }
      },
      resolve(parent, args) {
        return iPadOSDevice.find({"Applications": { $elemMatch: { "Name": args.Name, "Version": args.Version } }});
      }
    },
    iPhonesWithAppVersion: {
      type: new GraphQLList(MacType),
      args: { 
        Name: { type: GraphQLString },
        Version: { type: GraphQLString }
      },
      resolve(parent, args) {
        return iOSDevice.find({"Applications": { $elemMatch: { "Name": args.Name, "Version": args.Version } }});
      }
    },
    macApplicationVersions: {
      type: new GraphQLList(ApplicationVersionInfoType),
      args: { 
        applicationName: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        return context.applicationLoader.load(args.applicationName);
      }
    },
    macApplicationVersionDistribution: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'versionDistribution',
        fields: () => ({
          version: { type: GraphQLString },
          deviceCount: { type: GraphQLInt }
        })
      })),
      args: {
        applicationName: { type: GraphQLString }
      },
      resolve(parent, args) {
        return macOSDevice.aggregate([
          { $unwind: '$Applications' },
          { $match: { 'Applications.Name': args.applicationName } },
          { $group: {
            _id: '$Applications.Version',
            deviceCount: { $sum: 1 }
          }},
          { $project: {
            version: '$_id',
            deviceCount: 1,
            _id: 0
          }}
        ]);
      }
    },
    compliancecardprefs: {
      type: ComplianceCardPrefsType,
      args: { consoleUser: { type: GraphQLID }},
      resolve(parent, args) {
        return complianceCardPrefs.findOne({'consoleUser': args.consoleUser});
      }
    },
    configProfiles: {
      type: new GraphQLList(ConfigProfileType),
      resolve(parent, args) {
        return profile.find();
      }
    },
    consoleusers: {
      type: new GraphQLList(ConsoleUserType),
      resolve(parent, args) {
        return consoleUser.find();
      }
    },
    installedMacProfiles: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return macOSDevice.distinct('Profiles.PayloadDisplayName');
      }
    },
    installediPhoneProfiles: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return iOSDevice.distinct('Profiles.PayloadDisplayName');
      }
    },
    installediPadProfiles: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return iPadOSDevice.distinct('Profiles.PayloadDisplayName');
      }
    },
    installedMacApplications: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return macOSDevice.distinct('Applications.Name');
      }
    },
    installediPhoneApplications: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return iOSDevice.distinct('Applications.Name');
      }
    },
    installediPadApplications: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
        return iPadOSDevice.distinct('Applications.Name');
      }
    },
    commandlogs: {
      type: new GraphQLList(CommandLogType),
      args: { DeviceUDID: { type: GraphQLString }},
      resolve(parent, args) {
        return command.find({'DeviceUDID': args.DeviceUDID});
      }
    },
    lookupUser: {
      type: ConsoleUserType,
      args: { userId: { type: GraphQLID }},
      resolve(parent, args) {
        return consoleUser.findOne({'_id': args.userId}).select(['-password']);
      }
    }
  }
});

// Helper function to build filter queries
const buildFilterQuery = (filter) => {
  const query = {};
  if (filter.OSVersion) query['QueryResponses.OSVersion'] = filter.OSVersion;
  if (filter.mdmProfileInstalled !== undefined) query.mdmProfileInstalled = filter.mdmProfileInstalled;
  if (filter.SystemIntegrityProtectionEnabled !== undefined) {
    query['QueryResponses.SystemIntegrityProtectionEnabled'] = filter.SystemIntegrityProtectionEnabled;
  }
  return query;
};

// Create schema with all possible types that implement DeviceInterface
export default new GraphQLSchema({
  query: RootQuery,
  types: [MacType, iPhoneType, iPadType]
});
