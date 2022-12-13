import { describe, expect, test } from "@jest/globals";
import { Dice } from "../utils/dice";

describe("Dice", () => {
    test("Constructor - Defaults", () => {
        const dice = new Dice();
        expect(dice.getKeep()).toBe(false);
        expect(dice.getValue()).toBe(1);
    });

    test("Constructor - Only Value", () => {
        const dice = new Dice(6);
        expect(dice.getKeep()).toBe(false);
        expect(dice.getValue()).toBe(6);
    });

    test("Constructor - Change Keep / Value", () => {
        const dice = new Dice();
        dice.setKeep(true);
        expect(dice.getKeep()).toBe(true);
        dice.setKeep(false);
        expect(dice.getKeep()).toBe(false);
        dice.setValue(2);
        expect(dice.getValue()).toBe(2);
    });
});
