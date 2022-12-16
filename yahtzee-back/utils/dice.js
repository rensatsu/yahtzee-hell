export class Dice {
    #keep;
    #value;

    constructor(value = 1, keep = false) {
        this.#value = value;
        this.#keep = keep;
    }

    getValue() {
        return this.#value;
    }

    getKeep() {
        return this.#keep;
    }

    setValue(value) {
        if (value < 1 || value > 6) {
            throw new RangeError("Dice value is out of range");
        }

        this.#value = value;
    }

    setKeep(keep) {
        this.#keep = keep;
    }

    toJSON() {
        return {
            value: this.#value,
            keep: this.#keep,
        };
    }
}
