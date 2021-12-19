<template>
  <div class="operation-icon" @click="saveSectionArticle">
    <div class="icon">
      <SaveIcon class="icon-svg"/>
    </div>
    <div class="name">
      保存
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { SaveIcon } from '@/components/icons';

const emits = defineEmits(['save']);

function saveSectionArticle() {
  emits('save');
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
