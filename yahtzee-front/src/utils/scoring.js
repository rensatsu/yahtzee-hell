const FIXED_POINTS = {
    twoPairs: 10,
    fullHouse: 25,
    smallStraight: 30,
    largeStraight: 40,
    yahtzee: 50,
    yahtzeeBonus: 100,
    upperBonusThreshold: 63,
    upperBonus: 35
};

/**
 * Get a list of how often appears each dice.
 * For example:
 * Dices: [1, 2, 2, 3, 1]
 * Result: { "1": 2, "2": 2, "3": 1 }
 *
 * @param {Array<number>} dices
 * @returns
 */
function getDicesOccurrences(dices) {
    return dices.reduce((acc, e) => {
        acc[e] = e in acc ? acc[e] + 1 : 1;
        return acc;
    }, {});
}

/**
 * Calculate X of a Kind combination.
 *
 * @param {Array<number>} dices
 * @param {number} amountOfKind
 * @param {number} customResult Used only for Yahtzee
 * @returns {number} 0 if there is no combination or sum of dices otherwise
 */
function calculateXofAKind(dices, amountOfKind, customResult = null) {
    const res = getDicesOccurrences(dices);

    const items = Object.entries(res).find(([_, count]) => count >= amountOfKind);

    if (items !== undefined) {
        return customResult ?? calculateSum(dices);
    } else {
        return 0;
    }
}

/**
 * Calculate X Pairs combination.
 *
 * @param {Array<number>} dices
 * @param {number} pairs Amount of pairs
 * @param {number} result Points if there is a combination
 * @returns {number} 0 if there is no combination or points otherwise
 */
function calculateXPairs(dices, pairs, result = null) {
    const res = getDicesOccurrences(dices);

    const items = Object.values(res).filter(e => e === 2);

    if (items.length >= pairs) {
        return result;
    } else {
        return 0;
    }
}

/**
 * Calculate a sum of dices.
 *
 * @param {Array<number>} dices
 * @returns {number} Sum of dices
 */
function calculateSum(dices) {
    return dices.reduce((acc, e) => {
        acc += e;
        return acc;
    }, 0);
}

/**
 * Calculate a sum of identical dices.
 *
 * @param {Array<number>} dices
 * @param {number} value
 * @returns {number} Sum of dices
 */
function calculateIdenticalSum(dices, value) {
    return dices.reduce((acc, e) => {
        if (e === value) {
            acc += e;
        }

        return acc;
    }, 0);
}

/**
 * Calculate Full House combination.
 *
 * @param {Array<number>} dices
 * @returns {number} 0 if there is no combination or points otherwise
 */
function calculateFullHouse(dices) {
    const res = getDicesOccurrences(dices);

    const items = Object.values(res);

    if (items.includes(2) && items.includes(3)) {
        return FIXED_POINTS.fullHouse;
    } else {
        return 0;
    }
}

/**
 * Calculate Straight combination.
 *
 * @param {Array<number>} dices
 * @param {number} amount Amount of consecutive dices
 * @param {number} result Points if there is a combination
 * @returns {number} 0 if there is no combination or [result] points otherwise
 */
function calculateStraight(dices, amount, result) {
    const consecutive = [...new Set(dices)]
        .sort((a, b) => a - b)
        .reduce((acc, e) => {
            if (acc.length === 0) {
                acc.push(e);
            } else {
                if (acc[acc.length - 1] + 1 === e) {
                    acc.push(e);
                } else {
                    acc = [e];
                }
            }
            return acc;
        }, []);

    return consecutive.length >= amount ? result : 0;
}

/**
 * Calculate points by category
 *
 * @param {Array<number>} dices
 * @param {List<string,number|null>} categories
 * @returns
 */
function calculatePoints(dices, categories) {
    console.log("calculatePoints", { dices, categories });

    const isJoker = categories.yahtzee !== null && categories.yahtzee !== 0;

    return {
        ones: calculateIdenticalSum(dices, 1),
        twos: calculateIdenticalSum(dices, 2),
        threes: calculateIdenticalSum(dices, 3),
        fours: calculateIdenticalSum(dices, 4),
        fives: calculateIdenticalSum(dices, 5),
        sixes: calculateIdenticalSum(dices, 6),
        threeOfKind: isJoker ? calculateSum(dices) : calculateXofAKind(dices, 3),
        fourOfKind: isJoker ? calculateSum(dices) : calculateXofAKind(dices, 4),
        twoPairs: isJoker
            ? FIXED_POINTS.twoPairs
            : calculateXPairs(dices, 2, FIXED_POINTS.twoPairs),
        fullHouse: isJoker ? FIXED_POINTS.fullHouse : calculateFullHouse(dices),
        smallStraight: isJoker
            ? FIXED_POINTS.smallStraight
            : calculateStraight(dices, 4, FIXED_POINTS.smallStraight),
        largeStraight: isJoker
            ? FIXED_POINTS.largeStraight
            : calculateStraight(dices, 5, FIXED_POINTS.largeStraight),
        yahtzee: isJoker
            ? FIXED_POINTS.yahtzeeBonus
            : calculateXofAKind(dices, 5, FIXED_POINTS.yahtzee),
        chance: calculateSum(dices)
    };
}

export {
    FIXED_POINTS,
    getDicesOccurrences,
    calculateXofAKind,
    calculateSum,
    calculatePoints,
    calculateIdenticalSum,
    calculateFullHouse,
    calculateStraight
};
