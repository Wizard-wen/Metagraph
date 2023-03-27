<template>
  <div
    :style="{
      background: color || '#FFF',
      color: color ? '#FFF' : '#2c3e50'
    }"
    :class="['metagraph-tag', color ? 'tag-color-border' : 'tag-border']">
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String
  }
});

</script>

<style scoped lang="scss">
.metagraph-tag {
  font-size: 12px;
  border-radius: 12px;
  padding: 2px 8px;
  width: max-content;
  line-height: 1.5;
}

.tag-border {
  border: 1px solid #d0d7de;
}

.tag-color-border {

}
</style>
