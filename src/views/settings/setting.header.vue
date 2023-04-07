<template>
  <div class="header">
    <div class="h1-style">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'setting.header',
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.header {
  margin-bottom: 16px;
  border-bottom: 1px solid $borderColor;
}

.h1-style {
  height: 36px;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
}
</style>
