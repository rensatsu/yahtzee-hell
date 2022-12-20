<script setup>
import { ref } from "vue";
import { useGameStore } from "../stores/game.js";
import { db } from "../utils/db.js";
import { calculatePoints } from "../utils/scoring.js";
import Dice from "./Dice.vue";
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

async function startGame() {
  if (!game.player.isRoomOwner) {
    console.warn("Non-owner attempted to start game");
    return;
  }

  const room = await db.get(game.room);
  game.game = room;
  game.game.isStarted = true;
  game.game.round += 1;
  game.game.rollStep = 0;
  game.setNextPlayer();
  await db.put(game.game);
}

async function toggleDice(index) {
  if (!game.isMyTurn() || game.game.rollStep === 0) return;
  game.game.dices[index].keep = !game.game.dices[index].keep;
  await db.put(game.game);
}

async function roll() {
  if (game.game.rollStep >= 3) {
    console.warn("Roll steps exceeded");
    return;
  }

  game.game.rollStep += 1;

  game.game.dices.map((dice) => {
    if (dice.keep) return dice;
    dice.value = ~~(Math.random() * 6 + 1);
    return dice;
  });

  await db.put(game.game);
}

function canSelectCategory(player, category) {
  if (category === "yahtzee") {
    return player.categories[category] !== 0;
  } else {
    return player.categories[category] === null;
  }
}

async function selectCategory(player, category) {
  if (!game.isMyTurn()) return;
  if (game.game.rollStep === 0) {
    console.warn("You have to roll at least once", { category, player });
    return;
  }

  if (!canSelectCategory(player, category)) {
    console.warn("Cannot select category", { category, player });
    return;
  }

  const points = calculatePoints(getDiceValues(), player.categories);

  player.categories[category] = (player.categories[category] ?? 0) + points[category];

  game.setNextPlayer();

  await db.put(game.game);
}

function getDiceValues() {
  return game.game.dices.map(d => d.value);
}

db.changes({
  since: "now",
  live: true
}).on("change", updateState);

const categoriesDescription = ref({
  upperPart: {
    ones: "Ones",
    twos: "Twos",
    threes: "Threes",
    fours: "Fours",
    fives: "Fives",
    sixes: "Sixes",
  },
  bonus: "Bonus (63 points)",
  bottomPart: {
    threeOfKind: "Three of a Kind",
    fourOfKind: "Four of a Kind",
    fullHouse: "Full House",
    smallStraight: "Small Straight",
    largeStraight: "Large Straight",
    yahtzee: "Yahtzee",
    chance: "Chance",
  },
  total: "Total",
});
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

  tr.total td,
  tr.section td {
    background-color: var(--color-primary);
    color: var(--color-muted);
  }

  tr.section td {
    text-align: left;
  }

  th.active {
    background-color: var(--color-success);
    color: var(--color-success-bg);
  }

  td.active {
    background-color: var(--color-primary);
    color: var(--color-background);
  }

  td.selectable {
    cursor: pointer;
  }

  td.unselectable {
    cursor: not-allowed;
  }

  th,
  td {
    padding: 5px 10px;
  }

  th+th,
  td+td {
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
    --dice-dot-color: var(--color-primary);
    aspect-ratio: 1;
    border: 1px solid var(--control-color-border);
    cursor: pointer;

    &.keep {
      --dice-dot-color: var(--color-background);
      background: var(--color-primary);
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
        <template v-for="(player, id) in game.game.players" :key="id">
          <th :class="{ active: id === game.game.currentPlayerIndex }">{{ player.username }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr class="section">
        <td :colspan="game.game.players.length + 1">Upper part</td>
      </tr>
      <tr v-for="(description, category) in categoriesDescription.upperPart" :key="category">
        <td class="left">{{ description }}</td>
        <td v-for="(player, id) in game.game.players" :key="id" :class="{
          active: player.categories[category] !== null,
          selectable: game.isMyTurn() && player.categories[category] === null,
          unselectable: !game.game.isStarted || (game.isMyTurn() && player.categories[category] !== null)
        }" @click="selectCategory(player, category)">
          <template
            v-if="player.categories[category] === null && game.game.rollStep !== 0 && id === game.game.currentPlayerIndex">
            {{ calculatePoints(getDiceValues(), player.categories)[category]
            }}
          </template>
          <template v-else>
            {{ player.categories[category] }}
          </template>
        </td>
      </tr>
      <tr>
        <td class="left">{{ categoriesDescription.bonus }}</td>
        <td v-for="(_, id) in game.game.players" :key="id" :class="{ active: game.getBonusPoints[id] >= 63 }">
          <template v-if="game.getBonusPoints[id] < 63">
            {{ game.getBonusPoints[id] }} / 63
          </template>
          <template v-else>
            35
          </template>
        </td>
      </tr>
      <tr class="section">
        <td :colspan="Object.keys(game.game.players).length + 1">Bottom part</td>
      </tr>
      <!-- bottom part -->
      <tr class="total">
        <td class="left">{{ categoriesDescription.total }}</td>
        <td v-for="(_, id) in game.game.players" :key="id">{{ game.getTotalPoints[id] }}</td>
      </tr>
    </tbody>
  </table>
  <div class="dices">
    <template v-for="(dice, index) in game.game.dices" :key="index">
      <Dice :keep="dice.keep" :value="dice.value" :class="{ dice: true, keep: dice.keep }" @click="toggleDice(index)">
      </Dice>
    </template>
  </div>
  <div class="roll">
    <button type="button" class="btn btn-large btn-primary btn-block" v-if="game.game.isStarted" @click="roll"
      :disabled="!game.isMyTurn() || game.game.rollStep >= 3">
      Roll {{ game.game.rollStep }}/3
    </button>
    <button type="button" class="btn btn-large btn-primary btn-block" @click="startGame"
      v-if="game.player.isRoomOwner && !game.game.isStarted">
      Start
    </button>
    <button type="button" class="btn btn-large btn-primary btn-block"
      v-if="!game.player.isRoomOwner && !game.game.isStarted" disabled>
      Waiting for host to start game...
    </button>
  </div>
</template>
