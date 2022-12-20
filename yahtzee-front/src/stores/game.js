import { defineStore } from "pinia";
import { ref } from "vue";

export const categories = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfKind: null,
    fourOfKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null
};

export const useGameStore = defineStore("game", {
    state: () => {
        return {
            isInGame: ref(false),
            username: ref(null),
            room: ref(null),
            player: ref({
                username: null,
                isRoomOwner: false,
                categories: { ...categories }
            }),
            game: ref({
                isStarted: false,
                players: [],
                currentPlayerIndex: null,
                dices: [
                    { value: 1, keep: false },
                    { value: 2, keep: false },
                    { value: 3, keep: false },
                    { value: 4, keep: false },
                    { value: 5, keep: false }
                ],
                rollStep: 0,
                round: 0
            })
        };
    },
    getters: {
        getBonusPoints: state => {
            const keys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
            return state.game.players.map(playerState => {
                const upperCount = Object.entries(playerState.categories).reduce(
                    (acc, [eK, eV]) => {
                        if (!keys.includes(eK)) return acc;
                        if (eV === null) return acc;
                        acc += eV;
                        return acc;
                    },
                    0
                );
                return upperCount;
            });
        },
        getTotalPoints: state => {
            const keys = Object.keys(categories);
            return state.game.players.map((playerState, playerId) => {
                let count = Object.entries(playerState.categories).reduce((acc, [eK, eV]) => {
                    if (!keys.includes(eK)) return acc;
                    if (eV === null) return acc;
                    acc += eV;
                    return acc;
                }, 0);

                if (state.getBonusPoints[playerId] >= 63) {
                    count += 35;
                }

                return count;
            });
        }
    },
    actions: {
        /**
         * Get player data by index (or current player when no arguments defined).
         *
         * @param {number|undefined} index Player index or undefined
         * @returns
         */
        getPlayer(index) {
            return this.game.players[index === undefined ? this.game.currentPlayerIndex : index];
        },

        setNextPlayer() {
            this.game.currentPlayerIndex =
                this.game.currentPlayerIndex === null
                    ? 0
                    : this.game.currentPlayerIndex + 1 > this.game.players.length
                    ? 0
                    : this.game.currentPlayerIndex + 1;

            return this.getPlayer(this.game.currentPlayerIndex);
        },

        isMyTurn() {
            if (!this.game.isStarted) return false;
            return this.getPlayer().username === this.player.username;
        },

        setUsername(username) {
            this.username = username;
        },

        setRoom(room) {
            this.room = room;
        },

        setGameData(gameState) {
            this.game = gameState;
        }
    }
});
