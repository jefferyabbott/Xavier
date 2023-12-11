export const MacComplianceStatusBooleans = [
    {
        type: 'boolean',
        title: 'FileVault Encryption',
        arg: 'SecurityInfo.FDE_Enabled',
        platform: 'macos'
    },
    {
        type: 'boolean',
        title: 'System Integrity Protection',
        arg: 'QueryResponses.SystemIntegrityProtectionEnabled',
        platform: 'macos'
    },
    {
        type: 'boolean',
        title: 'MDM Profile Installed',
        arg: 'mdmProfileInstalled',
        platform: 'macos'
    }
]