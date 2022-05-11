<template>
  <ant-select
    class="font-size-select"
    v-model:value="articleFontSize"
    :options="fontSizeList"
    @change="handleFontSizeChange"
    ref="select">
  </ant-select>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits } from 'vue';
import { Select as AntSelect } from 'ant-design-vue';

const emits = defineEmits(['fontSizeChange']);
const articleFontSize = ref('14');
const fontSizeList = reactive([
  {
    label: '12',
    value: '12'
  },
  {
    label: '14',
    value: '14'
  },
  {
    label: '16',
    value: '16'
  },
  {
    label: '18',
    value: '18'
  }
]);
const handleFontSizeChange = (value: string) => {
  emits('fontSizeChange', { value });
};
</script>

<style scoped lang="scss">
.font-size-select {
  &::v-deep(.ant-select-arrow) {
    right: 5px
  }

  &::v-deep(.ant-select-selector) {
    padding: 0 5px;
  }
}
</style>
