<template>
  <div class="study-board">
    <div class="entity-list"></div>
    <div class="board">
      <div class="check-tab"></div>
      <div class="board-content">

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>


</script>

<style scoped lang="scss">
.study-board {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  display: flex;
  gap: 20px;

  .entity-list {
    width: 220px;
    border: 1px solid #ccc;
  }
;

  .board {
    flex: 1;
    display: flex;

    .check-tab {
      height: 50px;
      width: 100%;
    }

    .board-content {
      flex: 1;
    }
  }
}
</style>
