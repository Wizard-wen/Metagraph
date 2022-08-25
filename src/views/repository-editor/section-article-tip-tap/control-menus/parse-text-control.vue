<template>
  <div class="operation-icon" @click="handleParseWord">
    <div class="icon">
      <UploadIcon class="icon-svg"/>
    </div>
    <div class="name">
      解析
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { UploadIcon } from '@/components/icons';

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
