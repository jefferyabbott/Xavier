import macOSDevice from '../models/macOSDevice.js';
import iOSDevice from '../models/iOSDevice.js';
import iPadOSDevice from '../models/iPadOSDevice.js';
import plist from 'plist';

import { 
    getCertificateList_MDM_Command, 
    getDeviceInfo_MDM_Command, 
    getProfileList_MDM_Command, 
    getInstalledApplications_MDM_Command, 
    getiOSDeviceInfo_MDM_Command, 
    getSecurityInfo_MDM_Command 
} from '../services/mdmActions.js';

const deviceResponse = async (req, res) => {
    let event = req.body;
    switch (req.body.topic) {
        case 'mdm.Authenticate':
            handleAuthenticate(event)
            break;
        case 'mdm.TokenUpdate':
            handleTokenUpdate(event)
            break;
        case 'mdm.Connect':
            handleConnect(event)
            break;
        case 'mdm.CheckOut':
            handleCheckOut(event)
            break;
    }
    return res.sendStatus(200);
};

async function handleAuthenticate(event) {
    const udid = event.checkin_event.udid;
    const xmlData = Buffer.from(event.checkin_event.raw_payload, 'base64').toString()
    const plistData = plist.parse(xmlData);
    const lastCheckedIn = Date.now();

    let device = null;
    if (plistData.ProductName.includes('Mac')) {
        device = macOSDevice;
    } else if (plistData.ProductName.includes('iPhone')) {
        device = iOSDevice;
    } else if (plistData.ProductName.includes('iPad')) {
        device = iPadOSDevice;
    } 

    if (device) {
        await device.updateOne(
            {'UDID': udid},
            {
                'mdmProfileInstalled': true,
                'UDID': udid,
                'SerialNumber': plistData.SerialNumber,
                'BuildVersion': plistData.BuildVersion,
                'IMEI': plistData.IMEI,
                'OSVersion': plistData.OSVersion,
                'ProductName': plistData.ProductName,
                'Topic': plistData.Topic,
                lastCheckedIn
            },
            {
                upsert: true
            }
        );
    }
    
}

async function handleTokenUpdate(event) {
    const xmlData = Buffer.from(event.checkin_event.raw_payload, 'base64').toString();
    const plistData = plist.parse(xmlData);
    const udid = event.checkin_event.udid;
    const lastCheckedIn = Date.now();
    const device = await getDeviceType(udid);
    
    if (device && (device === iPadOSDevice || device === iOSDevice)) {
        const UnlockToken = plistData.UnlockToken.toString('base64');
        await device.updateOne(
            {'UDID': udid},
            {
                'mdmProfileInstalled': true,
                UnlockToken,
                lastCheckedIn
            },
            {
                upsert: false
            }
        );
    } else if (device && device === macOSDevice) {
        await device.updateOne(
            {'UDID': udid},
            {
                'mdmProfileInstalled': true,
                lastCheckedIn
            },
            {
                upsert: false
            }
        );
    }

    // get device data:

    const storedDevice = await device.findOne({'UDID': udid},{"ProductName":1,"_id":0});

    if (storedDevice.ProductName.includes('iPhone') || storedDevice.ProductName.includes('iPad')) {
        getiOSDeviceInfo_MDM_Command(udid);
    } else {
        getDeviceInfo_MDM_Command(udid);
    }
    getSecurityInfo_MDM_Command(udid);
    getCertificateList_MDM_Command(udid);
    getProfileList_MDM_Command(udid);
    getInstalledApplications_MDM_Command(udid);
}

async function handleConnect(event) {
    if (event.acknowledge_event.status == 'Acknowledged') {
        const udid = event.acknowledge_event.udid;
        const xmlData = Buffer.from(event.acknowledge_event.raw_payload, 'base64').toString()
        const plistData = plist.parse(xmlData);
        console.log('PLIST PAYLOAD:');
        console.log(plistData);
        const lastCheckedIn = Date.now();
        
        const device = await getDeviceType(udid);

        if (plistData.QueryResponses) {
            const QueryResponses = plistData.QueryResponses;
            await device.updateOne(
                {'UDID': udid}, 
                {
                    'SerialNumber': QueryResponses.SerialNumber,
                    'mdmProfileInstalled': true,
                    QueryResponses,
                    lastCheckedIn
                },
                {
                   upsert: true
                }
              );
        } else if (plistData.SecurityInfo) {
            const SecurityInfo = plistData.SecurityInfo;
            console.log('Here is a sample set of Security Info responses');
            console.log(SecurityInfo);
            await device.updateOne(
                {'UDID': udid}, 
                {
                    SecurityInfo,
                    'mdmProfileInstalled': true,
                    lastCheckedIn
                },
                {
                   upsert: true
                }
              );
        } else if (plistData.ProfileList) {
            const Profiles = plistData.ProfileList;
            await device.updateOne(
                {'UDID': udid}, 
                {
                    Profiles,
                    'mdmProfileInstalled': true,
                    lastCheckedIn
                },
                {
                   upsert: true
                }
              );
        } else if (plistData.InstalledApplicationList) {
            const Applications = plistData.InstalledApplicationList;
            await device.updateOne(
                {'UDID': udid}, 
                {
                    Applications,
                    'mdmProfileInstalled': true,
                    lastCheckedIn
                },
                {
                    upsert: true 
                }
            );
        } else if (plistData.CertificateList) {
            const CertificateList = plistData.CertificateList;
            await device.updateOne(
                {'UDID': udid},
                {
                    CertificateList,
                    'mdmProfileInstalled': true,
                    lastCheckedIn
                },
                {
                    upsert: true
                }
            );
        } 
        // TODO: add AvailableOSUpdates
        // TODO: add OSUpdateStatus
        // TODO: add ProvisioningProfileList

        // for testing, remove this....
        else {
            console.log(`Received uncategorized data from ${udid}:`);
            console.log(JSON.stringify(plistData));
        }
    }
}

async function handleCheckOut(event) {
    const udid = event.checkin_event.udid;
    const lastCheckedIn = Date.now();
    const device = await getDeviceType(udid);
    if (device) {
        await device.updateOne(
            {'UDID': udid},
            {
                'mdmProfileInstalled': false,
                lastCheckedIn
            },
            {
                upsert: false
            }
        );
    }
    
}

async function getDeviceType(udid) {
    if (await macOSDevice.findOne({'UDID': udid})) {
        return macOSDevice;
    } else if (await iOSDevice.findOne({'UDID': udid})) {
        return iOSDevice;
    } else if (await iPadOSDevice.findOne({'UDID': udid})) {
        return iPadOSDevice;
    } else {
        return null;
    }
}

export default deviceResponse;

