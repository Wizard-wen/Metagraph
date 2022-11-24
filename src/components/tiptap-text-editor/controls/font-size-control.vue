<template>
  <ant-select
    class="font-size-select"
    v-model:value="articleFontSize"
    :options="fontSizeList"
    @change="handleFontSizeChange"
    ref="select">
  </ant-select>
</template>

<script lang="ts">
import {
  reactive, ref, defineComponent
} from 'vue';
import { Select } from 'ant-design-vue';

export default defineComponent({
  name: 'font-size-control',
  components: {
    AntSelect: Select
  },
  emits: ['fontSizeChange'],
  setup(props, { emit }) {
    const articleFontSize = ref('14');
    const fontSizeList = reactive([
      {
        label: '12px',
        value: '12'
      },
      {
        label: '14px',
        value: '14'
      },
      {
        label: '16px',
        value: '16'
      },
      {
        label: '18px',
        value: '18'
      }
    ]);
    const handleFontSizeChange = (value: string) => {
      emit('fontSizeChange', { value });
    };
    return {
      articleFontSize,
      fontSizeList,
      handleFontSizeChange
    };
  }
});

</script>

<style scoped lang="scss">
.font-size-select {
  //&::v-deep(.ant-select-arrow) {
  //  right: 3px;
  //  height: 8px;
  //  width: 8px;
  //}
  //
  //&::v-deep(.ant-select-selector) {
  //  padding: 0 7px!important;
  //}
  //
  //&::v-deep(.ant-select-selection-item){
  //  padding-right: 5px!important;
  //}
  //&::v-deep(svg){
  //  height: 8px;
  //  width: 8px;
  //}
}
</style>
