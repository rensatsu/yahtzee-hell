<script setup>
import Header from "./components/Header.vue";
import GameCreate from "./components/GameCreate.vue";
import GameJoin from "./components/GameJoin.vue";
</script>

<template>
  <Header></Header>
  <main class="container">
    <div class="grid grid--1-1">
      <GameCreate></GameCreate>
      <GameJoin></GameJoin>
    </div>
  </main>
</template>
