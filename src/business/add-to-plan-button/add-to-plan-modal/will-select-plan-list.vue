<template>
  <div
    @click="handleClickItem(item.id)"
    :class="['label', item.id === activeId ? 'active-label' : '']"
    v-for="(item, index) in listData" :key="index">
    <BookOutlined class="icon-style"/>
    <div class="text">{{ item.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType } from 'vue';
import { BookOutlined } from '@ant-design/icons-vue';
import { PlanTreeType } from '@metagraph/constant';

const emit = defineEmits(['control']);

defineProps({
  activeId: {
    type: String,
    default: ''
  },
  listData: {
    type: Array as PropType<PlanTreeType>,
    required: true,
    default: () => []
  },
});

function handleClickItem(id: string) {
  emit('control', { id });
}

</script>

<style scoped lang="scss">
.active-label {
  background: #eff0f0;
}

.label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 49px;
  line-height: 49px;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #eff0f0;
  }

  .icon-style {
    margin-right: 12px;
    font-size: 18px;
  }

  .text {
    text-align: left;
    cursor: pointer;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .status-icon {
    margin-left: 12px;
    font-size: 14px;
  }
}
</style>
