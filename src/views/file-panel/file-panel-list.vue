<template>
  <div class="file-panel">
    <div class="file-panel-list">
      <div class="search-container">
        <ant-input
          style="width: 320px;"
          class="custom-input-style"
          v-model="filePanelList.searchInput"></ant-input>
        <ant-dropdown :placement="'bottomRight'" :trigger="['click']">
          <m-button :size="'large'" :has-border="false">
            <template #icon>
              <PlusOutlined/>
            </template>
          </m-button>
          <template #overlay>
            <ant-menu class="dropdown-menu-style">
              <ant-menu-item class="menu-item-style">
                <BookOutlined class="icon-size"/>
                新建知识库
              </ant-menu-item>
              <ant-menu-item class="menu-item-style">
                <ReadOutlined class="icon-size"/>
                新建知识点
              </ant-menu-item>
              <ant-menu-item class="menu-item-style">
                <FireOutlined class="icon-size"/>
                新建灵感
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
      </div>
      <template v-if="filePanelList.isLoading">
        <a-skeleton v-for="item in 3" :key="item"></a-skeleton>
      </template>
      <template v-else>
        <template v-if="filePanelList.list.length">
          <div class="file-panel-list-container">
            <div
              class="file-panel-item"
              v-for="(item, index) in filePanelList.list"
              :key="index"
              @mouseenter="showId = item.id"
              @mouseleave="showId = undefined">
              <div class="file-content">
                <div class="file-inner">
                  <img class="image-file" v-if="item.type === FileEnum.Image" :src="item.url"
                       alt="">
                  <div v-if="item.type === FileEnum.Text">
                    <FileWordOutlined/>
                  </div>
                </div>
                <div class="file-name">{{ item.name || '暂无名称' }}</div>
              </div>
              <div v-if="showId === item.id" :class="['public', 'black']">
                <EditOutlined style="margin-right: 20px" class="light-icon"/>
                <EyeOutlined @click="handleViewFile(item.id)" class="light-icon"/>
              </div>
            </div>
          </div>
          <div class="pagination-box">
            <ant-pagination
              class="pagination"
              :pageSize="filePanelList.pageSize"
              v-model:current="filePanelList.pageNumber"
              :total="filePanelList.total"
              @change="onPaginationChange"/>
          </div>
        </template>
        <template v-else>
          <empty-view></empty-view>
        </template>
      </template>
    </div>
    <div class="file-panel-view">
      <template v-if="fileDescription.length">
        <div class="file-name">{{ filePanelItemData.data.name }}</div>
        <div class="image-container">
          <div class="file-inner">
            <img class="preview-image" :src="filePanelItemData.data.url" alt="">
          </div>
        </div>
        <panel-description
          :title="'文件信息'"
          :description="fileDescription"></panel-description>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { FileEnum } from 'metagraph-constant';
import { EditOutlined, EyeOutlined, FileWordOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  Dropdown as AntDropdown,
  Input as AntInput,
  Menu as AntMenu,
  Pagination as AntPagination,
  Skeleton as ASkeleton
} from 'ant-design-vue';
import {
  filePanelItemData,
  filePanelList,
  getFilePanelItemById,
  getFilePanelList,
  setFilePanelListConfig
} from '@/views/file-panel/file-panel-model';
import EmptyView from '@/components/empty-view/empty-view.vue';
import { searchData } from '@/views/main/metegraph.header';
import PanelDescription
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/panel-description.vue';
import { CommonUtil } from '@/utils';
import { MButton } from '@/metagraph-ui';

const AntMenuItem = AntMenu.Item;
const showId = ref();
const onPaginationChange = async (page: number) => {
  searchData.value.pageIndex = page;
  searchData.value.pageSize = 12;
  await getFilePanelList();
};

const fileDescription = computed(() => {
  if (!filePanelItemData.data) {
    return [];
  }
  return [
    { title: '名称', content: filePanelItemData.data.name },
    { title: '类型', content: filePanelItemData.data.type },
    { title: '路径', content: filePanelItemData.data.url },
    { title: '大小', content: CommonUtil.getFileSize(filePanelItemData.data.size) },
    {
      title: '创建时间',
      content: CommonUtil.timeAgo(new Date(filePanelItemData.data.createdAt).getTime())
    }
  ];
});

async function handleViewFile(id: string) {
  await getFilePanelItemById(id);
}

onMounted(async () => {
  filePanelItemData.data = undefined;
  setFilePanelListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getFilePanelList();
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.file-panel {
  display: flex;
  width: 1200px;

  .file-panel-view {
    width: 360px;
    margin-left: 20px;

    .file-name {
      height: 32px;
      line-height: 32px;
      width: 100%;
      font-size: 18px;
      font-weight: 600;
      text-align: left;
      margin-bottom: 12px;
    }

    .image-container {
      width: 360px;
      height: 300px;
    }

    .file-inner {
      background-color: #fff;
      background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee),
      linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee);
      background-size: 19px 19px;
      background-position: 0 0, 9px 9px;

      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-image {

    }
  }

  .file-panel-list {
    flex: 1;

    .search-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include custom-input-style-mixin;
    }
  }
}

.file-panel-list-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .file-panel-item:nth-child(4n+1) {
    padding-left: 0;
  }
  .file-panel-item:nth-child(4n) {
    padding-right: 0;
  }
  .file-panel-item {
    height: 180px;
    width: 25%;
    padding: 14px 16px;
    box-sizing: border-box;
    position: relative;

    .public {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
    }

    .black {
      background: rgba(0, 0, 0, .4);
    }

    .light-icon {
      color: #FFF;
      font-size: 18px;
    }

    .file-content {
      height: 100%;
      width: 100%;
      border: 1px solid $hoverDeepBackColor;
      border-radius: 6px;
      padding: 8px 8px 0;

      .image-file {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
      }

      .file-inner {
        background-color: #fff;
        background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee),
        linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee);
        background-size: 19px 19px;
        background-position: 0 0, 9px 9px;

        height: calc(100% - 28px);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .file-name {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        width: 100%;
        text-align: left;
        @include no-break-line-text;
      }
    }
  }
}

</style>
