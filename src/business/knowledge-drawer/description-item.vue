<template>
  <div class="description-line">
    <p class="title">
      {{ title }}：
    </p>
    <template v-if="content">
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
  line-height: 22px;
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);

  .title {
    margin-right: 8px;
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
