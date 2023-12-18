import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLFloat } from 'graphql';
import macOSDevice from '../models/macOSDevice.js';
import iOSDevice from '../models/iOSDevice.js';
import iPadOSDevice from '../models/iPadOSDevice.js';
import profile from '../models/profile.js';
import consoleUser from '../models/consoleUser.js';
import complianceCardPrefs from '../models/complianceCard.js';
import command from '../models/commandHistory.js';

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

 const CertificateType = new GraphQLObjectType({
  name: 'certificate',
  fields: () => ({
    CommonName: { type: GraphQLString },
    IsIdentity: { type: GraphQLBoolean }
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

const UnlockPinType = new GraphQLObjectType({
  name: "unlockPin",
  fields: () => ({
    pin: { type: GraphQLString },
  })
});

const MacType = new GraphQLObjectType({
    name: 'macosdevice',
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
        unlockPins: { type: new GraphQLList(UnlockPinType)},
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    })
});

const iPhoneType = new GraphQLObjectType({
  name: 'iphonedevice',
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

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ipads: {
          type: new GraphQLList(iPadType),
          resolve(parent, args) {
            return iPadOSDevice.find();
          }
        },
        ipad: {
          type: iPadType,
          args: { SerialNumber: { type: GraphQLString }},
          resolve(parent, args) {
            return iPadOSDevice.findOne({'SerialNumber': args.SerialNumber});
          }
        },
        iphones: {
          type: new GraphQLList(iPhoneType),
          resolve(parent, args) {
            return iOSDevice.find();
          }
        },
        iphone: {
          type: iPhoneType,
          args: { SerialNumber: { type: GraphQLString }},
          resolve(parent, args) {
            return iOSDevice.findOne({'SerialNumber': args.SerialNumber});
          }
        },
        macs: {
            type: new GraphQLList(MacType),
            resolve(parent, args) {
                return macOSDevice.find();
            }
        },
        mac: {
            type: MacType,
            args: { SerialNumber: { type: GraphQLString }},
            resolve(parent, args) {
                return macOSDevice.findOne({'SerialNumber': args.SerialNumber});
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
            // return command.find({'DeviceUDID': args.DeviceUDID}).populate('Requester');
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

export default new GraphQLSchema({
    query: RootQuery
});
