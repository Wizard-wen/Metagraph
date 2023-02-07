<template>
  <div class="operation-icon" @click="handleParseWord">
    <operation-tooltip :desc="'解析'">
    <div class="icon">
      <UploadIcon class="icon-svg"/>
    </div>
    </operation-tooltip>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { UploadIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

export default defineComponent({
  name: 'parse-text-control',
  components: {
    UploadIcon
  },
  emits: ['open'],
  setup(props, { emit }) {
    const handleParseWord = () => {
      emit('open');
    };
    return {
      handleParseWord,
    };
  }
});

</script>

<style scoped lang="scss">
@import "../../../../style/tiptap.common";
</style>
