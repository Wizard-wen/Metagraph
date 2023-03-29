<template>
  <div
    v-for="(item, index) in relationList"
    :key="index"
    data-type="rect"
    class="dnd-rect"
    :class="[item.isDraggable ? 'is-active' : 'is-normal']"
    :draggable="item.isDraggable"
    @dragstart="startDrag($event, item.item)">
    <div class="text">{{ item.item.content.name }}</div>
    <div class="control">
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        >
        <div class="icon-content-style" :draggable="item.isDraggable"
             @dragstart="handleNoDrag($event)">
          <MoreOutlined/>
        </div>
        <template #overlay>
          <ant-menu>
            <ant-menu-item
              v-for="(innerItem, index) in operationList"
              :key="index">
              {{ innerItem.name }}
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div
        v-if="item.isDraggable"
        class="icon-content-style"
        :draggable="item.isDraggable"
        @dragstart="handleNoDrag($event)">
        <eye-outlined/>
      </div>
      <div class="icon-content-style" v-else>
        <eye-outlined/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EntityCompletelyListItemType, KnowledgeEdgeInEdgeGroupType } from 'metagraph-constant';
import {
  defineEmits, defineProps, PropType, ref
} from 'vue';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';

const AntMenuItem = AntMenu.Item;

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

function handleNoDrag($event: DragEvent) {
  console.log($event);
  $event.preventDefault();
  $event.stopPropagation();
}

const emit = defineEmits(['handleDrag']);
type CustomEdgeType = {
  isInnerRepository: boolean;
  isDraggable?: boolean
} & KnowledgeEdgeInEdgeGroupType;
defineProps({
  relationList: {
    type: Array as PropType<CustomEdgeType[]>,
    default() {
      return [];
    }
  }
});

const startDrag = (event: MouseEvent, entity: EntityCompletelyListItemType) => {
  emit('handleDrag', {
    event,
    entity
  });
};

const operationList = ref([
  {
    type: 'View',
    name: '查看知识点'
  },
  {
    type: 'Edit',
    name: '编辑知识点'
  }
]);
</script>

<style scoped lang="scss">
@import '../../../style/common';

.dnd-rect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  margin-bottom: 2px;

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


  .text {
    text-align: left;
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .control {
    display: flex;
  }
}

.is-normal {
  border: 1px solid $hoverBackColor;

  &:hover {
    background: $hoverBackColor;
  }
}

.is-active {
  border: 1px solid $themeColor;
  cursor: move;

  &:hover {
    background: rgba($themeColor, 0.1);
  }
}
</style>
