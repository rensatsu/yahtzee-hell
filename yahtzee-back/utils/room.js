import { Dice } from "./dice.js";

export class Room {
    #players;
    #currentPlayer;
    #dices;
    #rollStep;
    #round;

    constructor() {
        this.#players = new Map();
        this.#currentPlayer = null;
        this.#rollStep = 0;
        this.#round = 0;
        this.#dices = [new Dice(1), new Dice(2), new Dice(3), new Dice(4), new Dice(5)];
    }

    /**
     * @param {Player} player
     * @memberof Room
     */
    addPlayer(player) {
        this.#players.set(player.getId(), player);
    }

    /** @returns {Map<string, Player>} */
    getPlayers() {
        return this.#players;
    }

    removePlayer(id) {
        this.#players.delete(id);
    }

    setCurrentPlayer(id) {
        this.#currentPlayer = id;
    }

    setNextPlayerAsCurrent() {
        const entries = this.#players.entries();
        for (const player of entries) {
            if (player.id === this.#currentPlayer) {
                const nextPlayer = entries.next().value;

                if (nextPlayer === undefined) {
                    this.#round += 1;
                }

                this.setCurrentPlayer(nextPlayer ?? this.#players.entries().next().value);
                break;
            }
        }
    }

    getCurrentPlayer() {
        return this.#currentPlayer;
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
