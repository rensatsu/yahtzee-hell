<script setup>
function submit() {
  globalThis.socket.emit("create-room", null, (...args) => {
    console.log(args);
  });
}
</script>

<template>
  <div>
    <section class="panel panel-default">
      <h2 class="panel-heading">Host game</h2>
      <form class="panel-body" @submit.prevent="submit">
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block">
            Create game
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
