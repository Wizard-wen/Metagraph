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
          <caret-right-outlined class="arrow-icon" :class="{'arrow-rotate': item.isExpand}"/>
        </div>
        <div v-else class="no-icon"></div>
        <div class="text" @click="handleClickItem({id: item.key})">{{ item.title }}</div>
        <div class="control" v-if="expendItemId === item.key">
          <ant-dropdown
            :getPopupContainer="getPopupContainer"
            :trigger="['click']"
            :overlayClassName="'dropdown-overlay'">
            <div class="icon-content-style">
              <MoreOutlined/>
            </div>
            <template #overlay>
              <ant-menu>
                <ant-menu-item @click="handleClickControl('Section', item.data)">
                  <div>新建</div>
                </ant-menu-item>
                <ant-menu-item @click="handleClickControl('Knowledge', item.data)">
                  <div>绑定知识点</div>
                </ant-menu-item>
                <ant-menu-item @click="handleClickControl('ChangeSection', item.data)">
                  <div>重命名</div>
                </ant-menu-item>
                <ant-menu-item @click="handleClickControl('Delete', item.data)">
                  <div>删除</div>
                </ant-menu-item>
              </ant-menu>
            </template>
          </ant-dropdown>
          <div class="icon-content-style" @click="handleClickControl('Section', undefined)">
            <plus-outlined/>
          </div>
        </div>
      </div>
      <metagraph-tree-item
        v-if="item.children && item.isExpand"
        @control="handlePassData($event)"
        @selectedChange="handleClickItem"
        :active-item-id="activeItemId"
        :ui-tree-list="item.children"
        :level="level + 1"></metagraph-tree-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, ref } from 'vue';
import { CaretRightOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';
import { TreeItemUIType } from './type';

type OperationType = 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection' | 'Delete';
const emit = defineEmits(['control', 'selectedChange']);

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

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
const AntMenuItem = AntMenu.Item;

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

function handleClickControl(type: OperationType, params?: any) {
  console.log(params);
  emit('control', {
    type,
    data: params
  });
}

function handlePassData($event: any) {
  emit('control', $event);
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

.dropdown-overlay {
  z-index: 1065 !important;
}

</style>
