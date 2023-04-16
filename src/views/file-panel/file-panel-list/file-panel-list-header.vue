<template>
  <div class="file-panel-list-header">
    <div class="left">
      <div class="left-container">
        <m-button :is-icon="true" :has-border="false" @click="goHomePage">
          <template #icon>
            <LeftOutlined/>
          </template>
        </m-button>
        <ant-dropdown
          :getPopupContainer="getPopupContainer"
          :trigger="['click']"
          :placement="'bottomLeft'">
          <m-button :is-icon="true" :has-border="false">
            <template #icon>
              <MenuOutlined/>
            </template>
          </m-button>
          <template #overlay>
            <ant-menu class="dropdown-menu-style">
              <div class="divider-style"></div>
              <ant-menu-item class="menu-item-style">
                <ArrowLeftOutlined class="icon-size"/>
                回到首页
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
        <div class="page-title">文件面板</div>
      </div>

      <ant-input
        class="input-search-style"
        @pressEnter="handleSearch"
        placeholder="请输入搜索内容..."
        v-model:value="filePanelList.searchInput">
        <template #suffix>
          <search-outlined @click="handleSearch"/>
        </template>
      </ant-input>
    </div>

    <div class="control-bar">
      <m-button :is-icon="true" :size="'large'" :has-border="false" @click="handleUpload">
        <template #icon>
          <plus-outlined/>
        </template>
      </m-button>
      <input
        @change="handleFileChange"
        ref="inputElement"
        type="file"
        name="upload"
        id="upload"
        style="display: none;"/>
      <ant-dropdown :placement="'bottomRight'" :trigger="['click']">
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
import { RouterUtil } from '@/utils';
import {
  filePanelList,
  getFilePanelList,
  setFilePanelListConfig
} from '@/views/file-panel/file-panel-model';
import {
  Dropdown as AntDropdown,
  Input as AntInput,
  Menu as AntMenu,
} from 'ant-design-vue';
import {
  FileOutlined,
  FileImageOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  MenuOutlined,
  ArrowLeftOutlined,
  LeftOutlined
} from '@ant-design/icons-vue';
import { MButton } from '@/metagraph-ui';
import { FileEnum } from 'metagraph-constant';
import { ref } from 'vue';

const AntMenuItem = AntMenu.Item;
const currentFile = ref();
const inputElement = ref();

function goHomePage() {
  RouterUtil.jumpTo('/');
}

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

async function handleSearch() {
  setFilePanelListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getFilePanelList();
}

async function handleTypeChange(type?: FileEnum) {
  filePanelList.value.type = type;
  setFilePanelListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getFilePanelList();
}

function handleUpload() {
  if (inputElement.value) {
    inputElement.value.click();
  }
}

const handleFileChange = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  if (target.files === null) {
    return;
  }
  // eslint-disable-next-line prefer-destructuring
  currentFile.value = target.files[0];
  console.log(currentFile.value);
};

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
