<script setup>
import { ref } from "vue";
import { categories, useGameStore } from "../stores/game.js";
import { db } from "../utils/db.js";

const isLoading = ref(false);
const error = ref(null);

const emit = defineEmits(["game"]);

const game = useGameStore();

async function submit() {
  isLoading.value = true;
  error.value = null;

  const player = {
    username: game.username,
    isRoomOwner: true,
    categories: { ...categories },
  };

  game.player = player;
  game.game.players.push(player);

  const result = await db.post(game.game);
  if (!result.ok) {
    console.error({ ...result });
    error.value = "Unable to create a room";
    throw new Error("Unable to create a room");
  }

  const roomId = result.id;

  console.log("Joining room", roomId);
  isLoading.value = false;
  game.isInGame = true;
  game.room = roomId;
}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Host game</h2>
      <form class="panel-body" @submit.prevent="submit">
        <div v-if="error !== null" class="alert alert-danger">{{ error }}</div>

        <div class="form-group">
          <label for="inp-username-create">Username</label>
          <input type="text" class="form-control" id="inp-username-create" placeholder="Enter username" name="username"
            minlength="1" required v-model="game.username" />
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            Create game
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
