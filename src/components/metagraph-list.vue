<template>

  <div class="label" v-for="(item, index) in listData" :key="index">
    <div class="text">{{ item.title }}</div>
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
            <ant-menu-item @click="handleClickControl">
              <div>新建</div>
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="icon-content-style" @click="handleClickControl">
        <plus-outlined/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const AntMenuItem = AntMenu.Item;
type ListDataType = {
  title: string,
  name: string,
  key: string,
  data?: { [key: string]: any },
}
defineProps({
  listData: {
    type: Array as PropType<ListDataType[]>,
    default: () => []
  },
});

function handleClickControl() {

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
