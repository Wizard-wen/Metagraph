<template>
  <div class="label" v-for="(item, index) in listData" :key="index">
    <div class="text">{{ item.entity.name }}</div>
    <div class="control">
      <ant-dropdown
        v-if="isEditable"
        :getPopupContainer="getPopupContainer"
        :trigger="['click']">
        <div class="icon-content-style">
          <MoreOutlined/>
        </div>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item
              class="menu-item-style"
              v-for="(innerItem, index) in operationList"
              :key="index"
              @click="handleClickControl(innerItem.type, item)">
              <component :is="innerItem.component" class="icon-size"></component>
              {{ innerItem.name }}
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="icon-content-style" @click="handleClickControl('view', item)">
        <eye-outlined/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType } from 'vue';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const emit = defineEmits(['control']);
const AntMenuItem = AntMenu.Item;

defineProps({
  isEditable: {
    type: Boolean,
    default: true
  },
  operationList: {
    type: Array as PropType<{
      type: string;
      name: string;
      component: any
    }[]>,
    default() {
      return [];
    }
  },
  listData: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
    default: () => []
  },
});

function handleClickControl(type: string, item: EntityCompletelyListItemType) {
  emit('control', {
    type,
    item
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
