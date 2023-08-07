<template>
  <div class="description-line">
    <p class="title">
      {{ title }}：
    </p>
    <div v-if="content" class="content">
      {{ content }}
    </div>
    <div v-else class="content">
      <slot name="content"/>
    </div>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'description-item',
  props: {
    title: String,
    content: String,
  },
});
</script>
<style lang="scss" scoped>
.description-line {
  font-size: 14px;
  min-height: 32px;
  display: flex;
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);

  .title {
    line-height: 22px;
    margin-bottom: 0;
    margin-right: 8px;
    display: inline-block;
    font-weight: 600;
    min-width: 100px;
    text-align: right;
  }

  .content {
    line-height: 22px;
    word-break: break-all;
  }
}
</style>
