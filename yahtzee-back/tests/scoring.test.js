import { describe, expect, test } from "@jest/globals";
import {
    calculateFullHouse,
    calculateIdenticalSum,
    calculateStraight,
    calculateXofAKind,
    FIXED_POINTS
} from "../utils/scoring";

describe("Scoring", () => {
    test("Upper Block Numbers", () => {
        expect(calculateIdenticalSum([1, 2, 2, 2, 2], 1)).toBe(1);
        expect(calculateIdenticalSum([1, 1, 2, 2, 3], 1)).toBe(2);
        expect(calculateIdenticalSum([1, 1, 1, 1, 4], 1)).toBe(4);
        expect(calculateIdenticalSum([1, 1, 1, 1, 1], 1)).toBe(5);
        expect(calculateIdenticalSum([2, 3, 4, 5, 6], 1)).toBe(0);
        expect(calculateIdenticalSum([6, 6, 6, 6, 1], 6)).toBe(24);
        expect(calculateIdenticalSum([6, 6, 6, 6, 6], 6)).toBe(30);
    });

    test("X of a Kind", () => {
        expect(calculateXofAKind([1, 2, 2, 2, 2], 3)).toBe(9);
        expect(calculateXofAKind([1, 2, 2, 2, 2], 4)).toBe(9);
        expect(calculateXofAKind([1, 2, 3, 4, 5], 3)).toBe(0);
        expect(calculateXofAKind([1, 2, 3, 4, 5], 4)).toBe(0);
        expect(calculateXofAKind([1, 1, 6, 1, 6], 3)).toBe(15);
        expect(calculateXofAKind([6, 1, 6, 1, 1], 3)).toBe(15);
        expect(calculateXofAKind([6, 1, 6, 1, 1], 4)).toBe(0);
        expect(calculateXofAKind([1, 6, 6, 6, 6], 4)).toBe(25);
        expect(calculateXofAKind([1, 2, 3, 4, 5], 5)).toBe(0);
        expect(calculateXofAKind([1, 1, 1, 1, 1], 5)).toBe(5);
        expect(calculateXofAKind([6, 6, 6, 6, 6], 5)).toBe(30);
    });

    test("Full house", () => {
        expect(calculateFullHouse([1, 1, 1, 2, 2])).toBe(FIXED_POINTS.fullHouse);
        expect(calculateFullHouse([6, 6, 1, 1, 1])).toBe(FIXED_POINTS.fullHouse);
        expect(calculateFullHouse([6, 2, 6, 2, 6])).toBe(FIXED_POINTS.fullHouse);
        expect(calculateFullHouse([1, 1, 2, 2, 3])).toBe(0);
        expect(calculateFullHouse([1, 1, 1, 1, 4])).toBe(0);
        expect(calculateFullHouse([1, 1, 4, 1, 1])).toBe(0);
    });

    test("Yahtzee", () => {
        expect(calculateXofAKind([1, 2, 3, 4, 5], 5, FIXED_POINTS.yahtzee)).toBe(0);
        expect(calculateXofAKind([1, 1, 1, 1, 1], 5, FIXED_POINTS.yahtzee)).toBe(
            FIXED_POINTS.yahtzee
        );
        expect(calculateXofAKind([6, 6, 6, 6, 6], 5, FIXED_POINTS.yahtzee)).toBe(
            FIXED_POINTS.yahtzee
        );
    });

    test("Straight", () => {
        expect(calculateStraight([1, 2, 3, 4, 5], 4, FIXED_POINTS.smallStraight)).toBe(
            FIXED_POINTS.smallStraight
        );

        expect(calculateStraight([1, 2, 3, 4, 5], 5, FIXED_POINTS.largeStraight)).toBe(
            FIXED_POINTS.largeStraight
        );

        expect(calculateStraight([2, 2, 3, 4, 5], 4, FIXED_POINTS.smallStraight)).toBe(
            FIXED_POINTS.smallStraight
        );

        expect(calculateStraight([3, 2, 3, 4, 5], 4, FIXED_POINTS.smallStraight)).toBe(
            FIXED_POINTS.smallStraight
        );

        expect(calculateStraight([6, 2, 3, 4, 5], 4, FIXED_POINTS.smallStraight)).toBe(
            FIXED_POINTS.smallStraight
        );

        expect(calculateStraight([6, 2, 3, 4, 5], 5, FIXED_POINTS.largeStraight)).toBe(
            FIXED_POINTS.largeStraight
        );
    });
});
