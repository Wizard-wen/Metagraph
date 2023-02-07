<template>
  <div class="operation-icon" @click="saveSectionArticle">
    <operation-tooltip :desc="'保存'">
    <div class="icon">
      <SaveIcon class="icon-svg"/>
    </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { SaveIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const emits = defineEmits(['save']);

function saveSectionArticle() {
  emits('save');
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
