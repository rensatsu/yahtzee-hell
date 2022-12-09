<script setup>
import { ref } from "vue";

const roomCode = ref(null);

const isLoading = ref(false);
const error = ref(null);

const emit = defineEmits(["game"]);

function submit() {
  isLoading.value = true;
  error.value = null;

  globalThis.socket.emit("join-room", roomCode.value, (_, result, room) => {
    console.log("Joining room", roomCode.value);
    isLoading.value = false;

    if (result === false) {
      console.log("Error joining room", roomCode.value);
      error.value = room ?? "Unknown error";
    } else {
      emit("game", roomCode.value);
    }
  });
}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Join game</h2>
      <form class="panel-body" @submit.prevent="submit">
        <div v-if="error !== null" class="alert alert-danger">{{ error }}</div>
        <div class="form-group">
          <label for="inp-text">Room code</label>
          <input type="text" id="inp-text" class="form-control" placeholder="Enter room code" v-model="roomCode">
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
