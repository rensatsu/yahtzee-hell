<script setup>
import { ref } from "vue";
import { categories, useGameStore } from "../stores/game.js";
import { db } from "../utils/db";

const isLoading = ref(false);
const error = ref(null);

const emit = defineEmits(["game"]);

const game = useGameStore();

async function submit() {
  isLoading.value = true;
  error.value = null;

  try {
    console.log("Joining room", game.room, game.username);

    const room = await db.get(game.room);

    const player = {
      username: game.username,
      isRoomOwner: false,
      categories: { ...categories },
    };

    if (game.username in room.players) {
      throw new Error("This username is already in use");
    }

    game.player = player;
    room.players.push(player);

    await db.put(room);

    console.log("Joined room", game.room, game.username);
    isLoading.value = false;
    game.game = room;
    game.isInGame = true;
  } catch (e) {
    console.log("Error joining room", { e, room: game.room });
    error.value = e?.error === "not_found" ? "Room is not found" : (e ?? "Unknown error");
  }
}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Join game</h2>
      <form class="panel-body" @submit.prevent="submit">
        <div v-if="error !== null" class="alert alert-danger">{{ error }}</div>

        <div class="form-group">
          <label for="inp-username-join">Username</label>
          <input type="text" class="form-control" id="inp-username-join" name="username" placeholder="Enter username"
            minlength="1" required v-model="game.username" />
        </div>

        <div class="form-group">
          <label for="inp-text">Room code</label>
          <input type="text" id="inp-text" class="form-control" placeholder="Enter room code" required
            v-model="game.room">
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block">
            Join game
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
