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
                players: {},
                currentPlayer: null,
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
            return Object.fromEntries(
                Object.entries(state.game.players).map(([playerId, playerState]) => {
                    const upperCount = Object.entries(playerState.categories).reduce(
                        (acc, [eK, eV]) => {
                            if (!keys.includes(eK)) return acc;
                            if (eV === null) return acc;
                            acc += eV;
                            return acc;
                        },
                        0
                    );
                    return [playerId, upperCount];
                })
            );
        },
        getTotalPoints: state => {
            const keys = Object.keys(categories);
            return Object.fromEntries(
                Object.entries(state.game.players).map(([playerId, playerState]) => {
                    let count = Object.entries(playerState.categories).reduce(
                        (acc, [eK, eV]) => {
                            if (!keys.includes(eK)) return acc;
                            if (eV === null) return acc;
                            acc += eV;
                            return acc;
                        },
                        0
                    );

                    if (state.getBonusPoints[playerId] >= 63) {
                        count += 35;
                    }

                    return [playerId, count];
                })
            );
        }
    },
    actions: {
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
