<script setup>
import { ref } from 'vue';

const isLoading = ref(false);

const emit = defineEmits(["game"]);

function submit() {
  isLoading.value = true;

  globalThis.socket.emit("create-room", null, (_, room) => {
    console.log("Joining room", room);
    emit("game", room);
    isLoading.value = false;
  });
}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Host game</h2>
      <form class="panel-body" @submit.prevent="submit">
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            Create game
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
