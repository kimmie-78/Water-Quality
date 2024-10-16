export function isSafe(sample) {
    return (
        sample.aluminium < 0.2 &&
        sample.ammonia < 0.5 &&
        sample.arsenic < 0.01 &&
        sample.barium < 2.0 &&
        sample.cadmium < 0.005 &&
        sample.chloramine < 4.0 &&
        sample.chromium < 0.1 &&
        sample.copper < 1.3 &&
        sample.fluoride < 4.0 &&
        sample.bacteria < 1.0 &&      // Assuming 1.0 is a safe threshold for bacteria
        sample.viruses < 0.01 &&      // Assuming 0.01 is a safe threshold for viruses
        sample.lead < 0.015 &&
        sample.nitrates < 10.0 &&
        sample.nitrites < 1.0 &&
        sample.mercury < 0.002 &&
        sample.perchlorate < 0.006 &&
        sample.radium < 5.0 &&
        sample.selenium < 0.05 &&
        sample.silver < 0.1 &&
        sample.uranium < 0.03
    );
}

export function replaceNullWithZero(sample) {
    for (let key in sample) {
        if (sample[key] === null) {
            sample[key] = 0;
        }
    }
}
