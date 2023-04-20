<template>
  <div class="file-panel-list-header">
    <div class="left">
      <ant-input
        class="input-search-style"
        @pressEnter="handleSearch"
        placeholder="请输入搜索内容..."
        v-model:value="userFileList.searchInput">
        <template #suffix>
          <search-outlined @click="handleSearch"/>
        </template>
      </ant-input>
    </div>
    <div class="control-bar">
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :placement="'bottomRight'"
        :trigger="['click']">
        <m-button :is-icon="true" :size="'large'" :has-border="false">
          <template #icon>
            <filter-outlined/>
          </template>
        </m-button>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item class="menu-item-style" @click="handleTypeChange()">
              全部
            </ant-menu-item>
            <ant-menu-item class="menu-item-style" @click="handleTypeChange('image')">
              <file-image-outlined class="icon-size"/>
              图片
            </ant-menu-item>
            <ant-menu-item class="menu-item-style" @click="handleTypeChange('text')">
              <file-outlined class="icon-size"/>
              文档
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getUserFileList,
  setUserFileListConfig,
  userFileList
} from '@/views/file-panel/select-file-modal/select-file-model';
import { Dropdown as AntDropdown, Input as AntInput, Menu as AntMenu, } from 'ant-design-vue';
import {
  FileImageOutlined,
  FileOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { MButton } from '@/metagraph-ui';
import { FileEnum } from '@metagraph/constant';

const AntMenuItem = AntMenu.Item;

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

async function handleSearch() {
  setUserFileListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getUserFileList();
}

async function handleTypeChange(type?: FileEnum) {
  userFileList.value.type = type;
  setUserFileListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getUserFileList();
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.file-panel-list-header {
  height: 56px;
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $hoverDeepBackColor;

  @include custom-input-style-mixin;

  .left {
    display: flex;
    align-items: center;

    .left-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      width: 288px;

      .page-title {
        font-size: 16px;
        margin-left: 15px;
        margin-right: 100px;
        font-weight: 600;
      }
    }

    &::v-deep(.ant-input-affix-wrapper-focused) {
      box-shadow: none;
    }

    .input-search-style {
      width: 260px;
      margin-right: 20px;
      height: 36px;
      border-radius: 6px;
    }
  }

  .control-bar {
    display: flex;
  }
}
</style>
