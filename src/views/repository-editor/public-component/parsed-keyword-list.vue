<template>
  <div class="label" v-for="(item, index) in listData" :key="index">
    <div class="text">{{ item.word }}({{item.weight}})</div>
    <div class="control">
      <div class="icon-content-style" @click="handleClickControl(item)">
        <DeleteOutlined/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType } from 'vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { ParsedKeywordType } from '@/views/repository-editor/model/upload.and.parse.text.service';

const emit = defineEmits(['control']);

defineProps({
  listData: {
    type: Array as PropType<ParsedKeywordType[]>,
    default: () => []
  },
});

function handleClickControl(item: ParsedKeywordType) {
  emit('control', {
    index: item.index
  });
}
</script>

<style scoped lang="scss">
.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border-radius: 4px;

  .icon-content-style {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;

    .arrow-icon {
      font-size: 12px;
    }

    &:hover {
      background: #e7e9e8;
    }
  }

  &:hover {
    background: #eff0f0;
  }

  .text {
    text-align: left;
    cursor: pointer;
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .control {
    display: flex;
  }
}
</style>
