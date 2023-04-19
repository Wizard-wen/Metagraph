<template>
  <div class="file-panel">
    <file-panel-list-header></file-panel-list-header>
    <div class="file-panel-content">
      <div class="file-panel-list">
        <template v-if="filePanelList.isLoading">
          <a-skeleton v-for="item in 3" :key="item"></a-skeleton>
        </template>
        <div class="list-box" v-else ref="listBox">
          <template v-if="filePanelList.list.length">
            <div class="file-panel-list-container">
              <div
                class="file-panel-item"
                v-for="(item, index) in filePanelList.list"
                :key="index"
                @click.stop="handleViewFile(item.id)">
                <div :class="['file-content', showId === item.id ? 'shadow-style' : '']">
                  <div class="file-inner">
                    <img class="image-file" v-if="item.type === FileEnum.Image" :src="item.url"
                         alt="">
                    <div v-if="item.type === FileEnum.Text">
                      <FileWordOutlined style="font-size: 20px"/>
                    </div>
                  </div>
                  <div class="file-name">{{ item.name || '暂无名称' }}</div>
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
        </div>
      </div>
      <!--      <file-preview-sidebar></file-preview-sidebar>-->
      <preview-file-modal
        @close="handleClosePreviewFileModal"
        :file-model="filePanelItemData.data"
        :is-preview-modal-shown="isPreviewModalShown"></preview-file-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { FileEnum } from 'metagraph-constant';
import {
  FileWordOutlined
} from '@ant-design/icons-vue';
import {
  Pagination as AntPagination,
  Skeleton as ASkeleton,
} from 'ant-design-vue';
import {
  filePanelItemData,
  filePanelList,
  showId,
  getFilePanelItemById,
  getFilePanelList,
  setFilePanelListConfig
} from '@/views/file-panel/file-panel-list/file-panel-list-model';
import EmptyView from '@/components/empty-view/empty-view.vue';
import FilePreviewSidebar from './file-panel-list/file-preview-sidebar.vue';
import FilePanelListHeader from './file-panel-list/file-panel-list-header.vue';
import PreviewFileModal from '@/views/file-panel/preview-file-modal.vue';

const listBox = ref<HTMLElement>();
const isPreviewModalShown = ref(false);

function getSize() {
  let itemNumber = 6;
  let itemHeight = 2;
  if (listBox.value) {
    const width = listBox.value?.scrollWidth;
    const height = listBox.value?.scrollHeight;
    itemNumber = Number((width / 196).toFixed(0));
    itemHeight = Number(((height - 60) / 196).toFixed(0));
  }
  return itemNumber * itemHeight;
}

const onPaginationChange = async (page: number) => {
  setFilePanelListConfig({
    pageNumber: page,
    pageSize: getSize()
  });
  await getFilePanelList();
};

async function handleClosePreviewFileModal() {
  isPreviewModalShown.value = false;
  await getFilePanelList();
}

async function handleViewFile(id: string) {
  // showId.value = id;
  await getFilePanelItemById(id);
  isPreviewModalShown.value = true;
}


onMounted(async () => {
  filePanelItemData.data = undefined;
  setFilePanelListConfig({
    pageNumber: 1,
    pageSize: getSize()
  });
  await getFilePanelList();
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.file-panel {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;

  .file-panel-content {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;

    .file-panel-list {
      height: 100%;
      overflow-y: auto;
      flex: 1;
      padding: 18px;

      .list-box {
        height: 100%;
      }

      .file-panel-list-container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .file-panel-item {
          height: 180px;
          width: 180px;
          margin: 6px;
          box-sizing: border-box;

          .shadow-style {
            cursor: pointer;
            border: 2px solid $themeColor;
            border-radius: 6px;
          }

          .file-content {
            height: 100%;
            width: 100%;

            &:hover {
              padding: 2px 4px 2px 2px;
              cursor: pointer;
              border: 2px solid $themeColor;
              border-radius: 6px;
            }

            .file-inner {
              height: calc(100% - 28px);
              width: 100%;
              display: flex;
              box-sizing: border-box;
              padding: 4px 6px 4px 4px;
              align-items: flex-end;
              justify-content: center;

              .image-file {
                display: inline-block;
                max-width: 100%;
                max-height: 100%;
                box-shadow: 2px 2px 2px rgba(0, 0, 0, .6);
              }
            }

            .file-name {
              height: 28px;
              line-height: 28px;
              font-size: 12px;
              width: 100%;
              padding: 0 10px;
              text-align: center;
              @include no-break-line-text;
            }
          }
        }
      }

      .pagination-box {
        padding: 12px 0;
      }
    }

  }
}
</style>
