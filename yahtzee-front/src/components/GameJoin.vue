<script setup>
import { ref } from 'vue';

const roomCode = ref("");

function submit() {

}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Join game</h2>
      <form class="panel-body" @submit.prevent="submit">
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
