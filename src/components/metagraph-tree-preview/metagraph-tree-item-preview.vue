<template>
  <div style="height: max-content" v-for="item in uiTreeList" :key="item.key">
    <div class="children-content">
      <div
        :style="{paddingLeft: level * 28 + 'px'}"
        class="label"
        :class="{'active-item-style': item.key === activeItemId}"
        @mouseenter="handleMouseEnter($event, item)"
        @mouseleave="handleMouseLeave">
        <div
          v-if="item.children"
          class="icon-content-style arrow"
          @click="handleClickArrow($event, item)">
          <caret-right-outlined
            class="arrow-icon"
            :class="{'arrow-rotate': item.isExpand}"/>
        </div>
        <div v-else class="no-icon"></div>
        <div class="text" @click="handleClickItem({id: item.key})">{{ item.title }}</div>
        <div class="control" v-if="expendItemId === item.key"></div>
      </div>
      <metagraph-tree-item-preview
        v-if="item.children && item.isExpand"
        @selectedChange="handleClickItem"
        :active-item-id="activeItemId"
        :ui-tree-list="item.children"
        :level="level + 1"></metagraph-tree-item-preview>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { CaretRightOutlined, } from '@ant-design/icons-vue';
import { TreeItemUIType } from '../metagraph-tree/type';

const emit = defineEmits(['selectedChange']);

defineProps({
  uiTreeList: {
    type: Array as PropType<TreeItemUIType[]>,
    default: () => []
  },
  activeItemId: {
    type: String,
  },
  level: {
    type: Number,
    default: 0
  }
});

const expendItemId = ref();

function handleClickItem(params: { id: string }) {
  emit('selectedChange', params);
}

function handleClickArrow(event: MouseEvent, item: TreeItemUIType) {
  event.stopPropagation();
  item.isExpand = !item.isExpand;
}

function handleMouseEnter(event: MouseEvent, item: TreeItemUIType) {
  event.stopPropagation();
  expendItemId.value = item.key;
}

function handleMouseLeave() {
  expendItemId.value = undefined;
}

</script>

<style scoped lang="scss">

.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 2px;
  border-radius: 4px;
  margin-bottom: 2px;

  &:hover {
    background: #eff0f0;
  }

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

  .arrow {
    margin-right: 4px;
  }

  .arrow-rotate {
    transform: rotate(90deg);
  }

  .no-icon {
    padding-left: 28px;
  }

  .text {
    text-align: left;
    cursor: pointer;
    flex: 1;
    font-size: 12px;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .control {
    display: flex;
  }

}

.active-item-style {
  background: #eff0f0;
  color: #000;
  font-weight: 500;
}

.children-content {
  height: max-content;
}

/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


</style>
