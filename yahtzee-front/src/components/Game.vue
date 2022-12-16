<script setup>
import { useGameStore } from "../stores/game.js";
import { db } from "../utils/db.js";
const game = useGameStore();

function copy(value) {
  navigator.clipboard.writeText(value);
}

async function updateState() {
  console.log("updateState", { ...arguments });
  if (!game.isInGame || game.room === null) return;

  const room = await db.get(game.room);
  game.game = room;
}

function toggleDice(index) {
  game.game.dices[index].keep = !game.game.dices[index].keep;
}

db.changes({
  since: "now",
  live: true
}).on("change", updateState);
</script>

<style lang="scss">
table {
  border: 1px solid var(--control-color-border);
  table-layout: fixed;
  border-collapse: collapse;
  border-radius: var(--control-border-radius);
  width: 100%;

  thead tr {
    background: var(--color-primary);
    color: var(--color-background);
  }

  th, td {
    padding: 5px 10px;
  }

  th + th, td + td {
    border-left: 1px solid var(--control-color-border);
  }

  td.left,
  th.left {
    text-align: left;
  }

  td:not(.left),
  th:not(.left) {
    text-align: center;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--color-background);
  }

  tbody tr:nth-child(even) {
    background-color: var(--color-information-bg);
  }
}

.dices {
  display: grid;
  grid-template: auto / repeat(5, 1fr);
  gap: .5rem;
  margin: 1rem 0;

  .dice {
    font-size: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    border: 1px solid var(--control-color-border);
    cursor: pointer;

    &.dice-keep {
      background: var(--color-primary);
      color: var(--color-background);
    }
  }
}
</style>

<template>
  <div class="alert alert-info">
    <p>Your username: <code @click="copy(game.username)">{{ game.username }}</code>.</p>
    <p>Your room code: <code @click="copy(game.room)">{{ game.room }}</code>.</p>
    <button @click="updateState" class="btn btn-small">Update state</button>
  </div>
  <table>
    <thead>
      <tr>
        <th class="left">Room</th>
        <th v-for="(player, id) in game.game.players" :key="id">{{ player.username }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="left">Ones</td>
        <td v-for="(player, id) in game.game.players" :key="id">{{ player.categories.ones }}</td>
      </tr>
      <tr>
        <td class="left">Twos</td>
        <td v-for="(player, id) in game.game.players" :key="id">{{ player.categories.twos }}</td>
      </tr>
      <tr>
        <td class="left">Threes</td>
        <td v-for="(player, id) in game.game.players" :key="id">{{ player.categories.threes }}</td>
      </tr>
    </tbody>
  </table>
  <div class="dices">
    <template v-for="(dice, index) in game.game.dices" :key="index">
      <div :class="['dice', dice.keep ? 'dice-keep' : '']" @click="toggleDice(index)">{{ dice.value }}</div>
    </template>
  </div>
  <div class="roll">
    <button class="btn btn-large btn-primary btn-block">
      Roll 0/3
    </button>
  </div>
</template>
