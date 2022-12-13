import { Dice } from "./dice";
import { FIXED_POINTS } from "./scoring";

const MAX_ROLLS = 3;

export class Player {
    #name;
    #categories;
    #dices;
    #rollStep;

    constructor(name) {
        this.#name = name;
        this.#rollStep = 0;

        this.#dices = [
            new Dice(1),
            new Dice(2),
            new Dice(3),
            new Dice(4),
            new Dice(5),
        ];

        this.#categories = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            upperBonus: false,
            threeOfKind: null,
            fourOfKind,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            yahtzee: null,
            chance: null
        };
    }

    #getUpperSum() {
        return (
            this.#categories.ones +
            this.#categories.twos +
            this.#categories.threes +
            this.#categories.fours +
            this.#categories.fives +
            this.#categories.sixes
        );
    }

    getTotalSum() {
        return (
            this.#getUpperSum() +
            (this.#categories.upperBonus ? FIXED_POINTS.upperBonus : 0) +
            this.#categories.threeOfKind +
            this.#categories.fourOfKind +
            this.#categories.fullHouse +
            this.#categories.smallStraight +
            this.#categories.largeStraight +
            this.#categories.yahtzee +
            this.#categories.chance
        );
    }

    addCategory(category, points) {
        this.#categories[category] = points;

        if (
            this.#categories.upperBonus === false &&
            this.#getUpperSum() >= FIXED_POINTS.upperBonusThreshold
        ) {
            this.addCategory("bonus", true);
        }
    }

    getName() {
        return this.#name;
    }

    getCategories() {
        return this.#categories;
    }

    getDices() {
        return this.#dices;
    }

    setDiceKeep(index, keep) {
        this.#dices[index].setKeep(keep);
    }

    roll() {
        if (this.#rollStep >= MAX_ROLLS) {
            throw new Error("Max rolls exceeded");
        }

        this.#rollStep += 1;
        for (const dice of this.#dices) {
            if (dice.getKeep()) continue;
            dice.setValue(generateDice());
        }
    }
}
