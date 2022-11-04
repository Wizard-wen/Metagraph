<template>
  <div class="description-line">
    <p class="title">
      {{ title }}：
    </p>
    <template v-if="content" class="content">
      {{ content }}
    </template>
    <slot v-else name="content"/>
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
  height: 32px;

  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);

  .title {
    line-height: 32px;
    margin-right: 8px;
    display: inline-block;
    font-weight: 600;
  }

  .content {
    line-height: 22px;
  }
}
</style>
