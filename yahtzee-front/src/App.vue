<script setup>
import Header from "./components/Header.vue";
import GameCreate from "./components/GameCreate.vue";
import GameJoin from "./components/GameJoin.vue";
import Game from "./components/Game.vue";
import AboutGame from "./components/AboutGame.vue";
import { useGameStore } from "@/stores/game.js";

const game = useGameStore();

function onGameStart(room) {
  game.room = room;
  game.isInGame = true;
}
</script>

<template>
  <Header></Header>
  <main class="container">
    <div class="grid grid--1-1" v-if="!game.isInGame">
      <div>
        <GameCreate @game="onGameStart"></GameCreate>
        <AboutGame></AboutGame>
      </div>
      <GameJoin @game="onGameStart"></GameJoin>
    </div>
    <div v-else>
      <Game></Game>
    </div>
  </main>
</template>
