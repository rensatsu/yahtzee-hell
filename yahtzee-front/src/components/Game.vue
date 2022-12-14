<script setup>
import { ref, onBeforeUnmount } from "vue";
import { categories, useGameStore } from "../stores/game.js";
import { db } from "../utils/db.js";
import { calculatePoints, FIXED_POINTS } from "../utils/scoring.js";
import Dice from "./Dice.vue";
import RoomInfo from "./RoomInfo.vue";
const game = useGameStore();

const isRolling = ref(false);
const isDiceToggling = ref(false);
const categoriesCount = ref(Object.keys(categories).length);

async function updateState(force = false) {
  // skip updates when there is no active game
  if (!game.isInGame || game.room === null) return;

  const room = await db.get(game.room, { latest: true });

  // skip updates when turn is ours
  if (game.isMyTurn() && !force) {
    game.game._rev = room._rev;
  } else {
    game.game = room;
  }

  return room;
}

async function startGame() {
  if (!game.player.isRoomOwner) {
    console.warn("Non-owner attempted to start game");
    return;
  }

  const room = await db.get(game.room, { latest: true });
  game.game = room;
  game.game.isStarted = true;
  game.game.round += 1;
  game.game.rollStep = 0;
  game.setNextPlayer();
  await db.put(game.game);
}

async function toggleDice(index) {
  // Skip toggle while we're still updating state
  if (isDiceToggling.value) return;
  // Skip toggle when it's not our turn
  if (!game.isMyTurn() || game.game.rollStep === 0) return;

  isDiceToggling.value = true;

  await updateState(true);

  game.game.dices[index].keep = !game.game.dices[index].keep;
  await db.put(game.game).catch((e) => { console.warn("Unable to send update to toggle dice", { e }); });

  isDiceToggling.value = false;
}

async function roll() {
  if (game.game.rollStep >= 3) {
    console.warn("Roll steps exceeded");
    return;
  }

  isRolling.value = true;

  const rolledDices = await fetch(import.meta.env.VITE_API + "/dice", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(game.game.dices),
  });

  if (!rolledDices?.ok) {
    isRolling.value = false;
    throw new Error("Unable to roll dice");
  }

  game.game.rollStep += 1;
  game.game.dices = await rolledDices.json();
  isRolling.value = false;

  await updateState();
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

  await updateState();

  player.categories[category] = (player.categories[category] ?? 0) + points[category];
  game.setNextPlayer();

  await db.put(game.game);
}

function getDiceValues() {
  return game.game.dices.map(d => d.value);
}

const changesListener = db.changes({
  since: "now",
  live: true,
}).on("change", () => updateState());

onBeforeUnmount(() => {
  changesListener.cancel();
});

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
    twoPairs: "Two Pairs",
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
  table-layout: fixed;
  border-collapse: collapse;
  border-radius: var(--control-border-radius);
  width: 100%;

  &:not(.no-border) {
    border: 1px solid var(--control-color-border);
  }

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
    color: var(--color-information);
  }
}

.dices {
  display: grid;
  grid-template: auto / repeat(5, 1fr);
  gap: .75rem;
  margin: 1rem 5rem;

  .dice {
    --dice-dot-color: var(--color-primary);
    aspect-ratio: 1;
    border: 1px solid var(--control-color-border);
    cursor: pointer;

    &.waiting {
      opacity: 0.5;
    }

    &.keep {
      --dice-dot-color: var(--color-background);
      background: var(--color-primary);
    }
  }
}
</style>

<template>
  <RoomInfo @update="updateState(true)"></RoomInfo>
  <div class="panel panel-info" v-if="game.game.round >= categoriesCount">
    <h2 class="panel-heading">Game over</h2>
    <table class="no-border">
      <thead>
        <tr>
          <th class="left">Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, id) in game.game.players" :key="player.id">
          <td class="left">{{ player.username }}</td>
          <td>{{ game.getTotalPoints[id] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table>
    <thead>
      <tr>
        <th class="left">Players</th>
        <template v-for="(player, id) in game.game.players" :key="id">
          <th :class="{ active: id === game.game.currentPlayerIndex }">{{ player.username }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(description, category) in categoriesDescription.upperPart" :key="category">
        <td class="left">{{ description }}</td>
        <td v-for="(player, id) in game.game.players" :key="id" :class="{
          active: player.categories[category] !== null,
          selectable: game.isMyTurn() && player.categories[category] === null,
          unselectable: !game.game.isStarted || (game.isMyTurn() && player.categories[category] !== null)
        }" @click="selectCategory(player, category)">
          <template
            v-if="player.categories[category] === null && game.game.rollStep !== 0 && id === game.game.currentPlayerIndex">
            {{ calculatePoints(getDiceValues(), player.categories)[category] }}
          </template>
          <template v-else>
            {{ player.categories[category] }}
          </template>
        </td>
      </tr>
      <tr class="total">
        <td class="left">{{ categoriesDescription.bonus }}</td>
        <td v-for="(_, id) in game.game.players" :key="id" :class="{ active: game.getBonusPoints[id] >= FIXED_POINTS.upperBonusThreshold }">
          <template v-if="game.getBonusPoints[id] < FIXED_POINTS.upperBonusThreshold">
            {{ game.getBonusPoints[id] }} / {{ FIXED_POINTS.upperBonusThreshold }}
          </template>
          <template v-else>
            {{ FIXED_POINTS.upperBonus }}
          </template>
        </td>
      </tr>
      <tr v-for="(description, category) in categoriesDescription.bottomPart" :key="category">
        <td class="left">{{ description }}</td>
        <td v-for="(player, id) in game.game.players" :key="id" :class="{
          active: player.categories[category] !== null,
          selectable: game.isMyTurn() && player.categories[category] === null,
          unselectable: !game.game.isStarted || (game.isMyTurn() && player.categories[category] !== null)
        }" @click="selectCategory(player, category)">
          <template
            v-if="player.categories[category] === null && game.game.rollStep !== 0 && id === game.game.currentPlayerIndex">
            {{ calculatePoints(getDiceValues(), player.categories)[category] }}
          </template>
          <template v-else>
            {{ player.categories[category] }}
          </template>
        </td>
      </tr>
      <tr class="total">
        <td class="left">{{ categoriesDescription.total }}</td>
        <td v-for="(_, id) in game.game.players" :key="id">{{ game.getTotalPoints[id] }}</td>
      </tr>
    </tbody>
  </table>
  <div class="dices">
    <template v-for="(dice, index) in game.game.dices" :key="index">
      <Dice :keep="dice.keep" :value="dice.value" :class="{ dice: true, keep: dice.keep, waiting: isDiceToggling }"
        @click="toggleDice(index)">
      </Dice>
    </template>
  </div>
  <div class="roll">
    <button type="button" class="btn btn-large btn-primary btn-block" v-if="game.game.isStarted" @click="roll"
      :disabled="!game.isMyTurn() || game.game.rollStep >= 3 || isRolling">
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
