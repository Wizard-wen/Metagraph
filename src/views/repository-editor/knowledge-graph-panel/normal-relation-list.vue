<template>
  <div
    v-for="(item, index) in relationList"
    :key="index"
    data-type="rect"
    class="dnd-rect">
    <div class="text">{{ item.item.content.name }}</div>
    <div class="control">
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        :overlayClassName="'dropdown-overlay'">
        <div class="icon-content-style">
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
      <div class="icon-content-style">
        <eye-outlined/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KnowledgeEdgeInEdgeGroupType } from 'metagraph-constant';
import { defineProps, PropType, ref } from 'vue';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';

const AntMenuItem = AntMenu.Item;

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

type CustomEdgeType = {
  isInnerRepository: boolean;
} & KnowledgeEdgeInEdgeGroupType;
defineProps({
  relationList: {
    type: Array as PropType<CustomEdgeType[]>,
    default() {
      return [];
    }
  }
});

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
