export default function generateOSVersionComplianceData(data) {
    let versions = [];
    const versionCount = new Map();

    data.forEach ((item => {
        const version = item.QueryResponses.OSVersion;

        if (versionCount.has(version)) {
            versionCount.set(version, versionCount.get(version) + 1);
        } else {
            versionCount.set(version, 1);
        }

        const tempVersions = [];
        versionCount.forEach((value, key) => {
        tempVersions.push({
          version: key,
          count: value
        });
      });
      versions = tempVersions;
    }));

    return versions;
}

