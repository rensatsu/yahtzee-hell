<script setup>
import { ref } from "vue";
import { useGameStore } from "../stores/game.js";
import { db } from "../utils/db.js";

const isLoading = ref(false);

const emit = defineEmits(["game"]);

const game = useGameStore();

async function createRoom(db) {
  const id = crypto.randomUUID();
  if (await db.get(id).catch(() => false)) {
    return createRoom(db);
  }

  return id;
}

async function submit() {
  isLoading.value = true;

  const player = {
    username: game.username,
    categories: {
      ones: null,
      twos: null,
      threes: null,
    }
  };

  game.game.players[game.username] = player;

  const roomId = await createRoom(db);
  await db.put({
    _id: roomId,
    ...game.game
  });

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
