
import { FIXED_POINTS } from "./scoring.js";

const MAX_ROLLS = 3;

export class Player {
    #id;
    #name;
    #categories;

    constructor(id, name) {
        this.#id = id;
        this.#name = name;

        this.#categories = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            upperBonus: false,
            threeOfKind: null,
            fourOfKind: null,
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

    getId() {
        return this.#id;
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

    toJSON() {
        return {
            id: this.getId(),
            categories: this.getCategories(),
            name: this.getName(),
            totalSum: this.getTotalSum(),
        }
    }
}
