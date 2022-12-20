<script setup>
const props = defineProps(["value", "keep"]);
const emit = defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.dots {
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  padding: 2rem;
  gap: 1rem;

  .dot {
    display: flex;
    justify-self: center;
    border: 1px solid transparent;
    border-radius: 50%;
    width: 80%;
    height: 80%;

    &.filled {
      border: 1px solid var(--color-primary);
      background-color: var(--color-primary);
    }
  }
}
</style>

<template>
  <div class="dots" @click="emit('click')">
    <span class="dot" :class="{ filled: [4, 5, 6].includes(value) }"></span>
    <span class="dot"></span>
    <span class="dot" :class="{ filled: [2, 3, 4, 5, 6].includes(value) }"></span>

    <span class="dot" :class="{ filled: [6].includes(value) }"></span>
    <span class="dot" :class="{ filled: [1, 3, 5].includes(value) }"></span>
    <span class="dot" :class="{ filled: [6].includes(value) }"></span>

    <span class="dot" :class="{ filled: [2, 3, 4, 5, 6].includes(value) }"></span>
    <span class="dot"></span>
    <span class="dot" :class="{ filled: [4, 5, 6].includes(value) }"></span>
  </div>
</template>
