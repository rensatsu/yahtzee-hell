import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore("game", {
    state: () => {
        return {
            isInGame: ref(false),
            username: ref(null),
            room: ref(null),
            game: ref({
                players: {},
                currentPlayer: null,
                dices: [
                    { value: 1, keep: false },
                    { value: 2, keep: false },
                    { value: 3, keep: false },
                    { value: 4, keep: false },
                    { value: 5, keep: false },
                ],
                rollStep: 0,
                round: 0,
            }),
        };
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
