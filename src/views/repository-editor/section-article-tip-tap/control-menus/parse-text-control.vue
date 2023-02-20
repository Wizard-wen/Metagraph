<template>
  <div class="operation-icon" @click="handleParseWord">
    <operation-tooltip :desc="'解析'">
      <div class="icon">
        <UploadIcon class="icon-svg"/>
      </div>
    </operation-tooltip>
  </div>
</template>
<script setup lang="ts">
import { defineEmits } from 'vue';
import { UploadIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const emit = defineEmits(['open']);
const handleParseWord = () => {
  emit('open');
};

</script>

<style scoped lang="scss">
@import "../../../../style/tiptap.common";
</style>
