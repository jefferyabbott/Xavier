export default function generateBooleanComplianceData(data, target) {
    const booleanCount = {
        true: 0,
        false: 0,
    };

    data.forEach ((item => {
        const pieces = target.split('.');
        let jsonChain = 'item'
        pieces.forEach(piece => jsonChain = `${jsonChain}['${piece}']`);
        if (eval(jsonChain)) {
            booleanCount.true = booleanCount.true + 1;
        } else {
            booleanCount.false = booleanCount.false + 1;
        }
    }));

    return booleanCount;
}

