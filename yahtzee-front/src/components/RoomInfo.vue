<script setup>
import { ref } from "vue";
import { useGameStore } from "../stores/game.js";

const isDev = ref(import.meta.env.DEV);
const roomLinkTpl = ref(import.meta.env.VITE_SHARE_LINK_TPL);
const emit = defineEmits(["update"]);

const game = useGameStore();

function copy(value) {
  navigator.clipboard.writeText(value);
}

function copyRoomLink() {
  debugger;

  if (!game.room) return;
  if (!roomLinkTpl) return;

  const link = roomLinkTpl.value.replaceAll("%room%", game.room);

  return copy(link);
}
</script>

<style lang="scss" scoped>
.room-info {
  font-size: 1.1rem;

  a {
    display: inline-flex;
    margin: 0 1ch;
  }
}
</style>

<template>
  <div class="alert alert-info" v-if="isDev">
    <p>Your username: <code @click="copy(game.username)">{{ game.username }}</code>.</p>
    <p>Your room code: <code @click="copy(game.room)">{{ game.room }}</code>.</p>
    <button @click="emit('update')" class="btn btn-small">Update state</button>
  </div>
  <p class="room-info">
    Room code: <code @click="copy(game.room)">{{ game.room }}</code>
    <a href="#" @click.prevent="copyRoomLink" title="Copy link to join room">
      <fa-icon icon="fa-regular fa-copy fa-fw"></fa-icon>
    </a>
  </p>
</template>
