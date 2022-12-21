<script setup>
import { ref } from "vue";

const link = ref("https://www.google.com/search?q=how+to+play+yahtzee");
</script>

<template>
  <div class="panel">
    <h2 class="panel-heading">How to Play</h2>
    <div class="panel-body">
      <a target="_blank" :href="link" class="btn btn-primary btn-block" rel="noreferrer noopener">
        How to Play
      </a>
    </div>
  </div>
</template>
