import { randomInt } from "node:crypto";

const MIN_VALUE = 1;
const MAX_VALUE = 6;

/**
 * Generate random dice
 *
 * @export
 * @returns {number}
 */
export function generateDice() {
    return randomInt(MIN_VALUE, MAX_VALUE + 1);
}
