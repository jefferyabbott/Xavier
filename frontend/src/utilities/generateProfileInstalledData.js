export default function generateProfileInstalledData(data, target) {
    const booleanCount = {
        true: 0,
        false: 0,
    };

    data.forEach((item => {
        let found = false;
        item.Profiles.forEach((profile) => {
            if (profile.PayloadDisplayName === target) {
                booleanCount.true = booleanCount.true + 1;
                found = true;
            }
        })
        if (!found) {
            booleanCount.false = booleanCount.false + 1;
        }
    }));

    return booleanCount;
}

