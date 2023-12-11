export default function generateAppVersionComplianceData(data, target) {
    const versions = [];
    const versionCount = new Map();

    data.forEach ((item) => {
        let version = '';
        // let tempVersions = [];
        item.Applications.forEach((app) => {
            if (app.Name === target) {
                version = app.Version;
                if (versionCount.has(version)) {
                    versionCount.set(version, versionCount.get(version) + 1);
                } else {
                    versionCount.set(version, 1);
                }
              }});
        });    
    
        versionCount.forEach((value, key) => {
            versions.push({
                version: key,
                count: value
            });

        });

    return versions;
}

