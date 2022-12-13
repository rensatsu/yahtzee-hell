const FIXED_POINTS = {
    fullHouse: 25,
    smallStraight: 30,
    largeStraight: 40,
    yahtzee: 50,
    yahtzeeBonus: 100
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
 * @param {boolean} [isJoker=false] Joker is used when there are already points in Yahtzee category
 * @returns
 */
function calculatePoints(category, dices, isJoker = false) {
    switch (category) {
        case categories.ones:
            return calculateIdenticalSum(dices, 1);

        case categories.twos:
            return calculateIdenticalSum(dices, 2);

        case categories.threes:
            return calculateIdenticalSum(dices, 3);

        case categories.fours:
            return calculateIdenticalSum(dices, 4);

        case categories.fives:
            return calculateIdenticalSum(dices, 5);

        case categories.sixes:
            return calculateIdenticalSum(dices, 6);

        case categories.threeOfKind:
            return isJoker ? calculateSum(dices) : calculateXofAKind(dices, 3);

        case categories.fourOfKind:
            return isJoker ? calculateSum(dices) : calculateXofAKind(dices, 4);

        case categories.fullHouse:
            return isJoker ? FIXED_POINTS.fullHouse : calculateFullHouse(dices);

        case categories.smallStraight:
            return isJoker
                ? FIXED_POINTS.smallStraight
                : calculateStraight(dices, 4, FIXED_POINTS.smallStraight);

        case categories.largeStraight:
            return isJoker
                ? FIXED_POINTS.largeStraight
                : calculateStraight(dices, 5, FIXED_POINTS.largeStraight);

        case categories.yahtzee:
            return isJoker
                ? FIXED_POINTS.yahtzeeBonus
                : calculateXofAKind(dices, 5, FIXED_POINTS.yahtzee);

        case categories.chance:
            return calculateSum(dices);
    }
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
