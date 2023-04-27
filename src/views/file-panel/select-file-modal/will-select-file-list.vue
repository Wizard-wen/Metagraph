<template>
  <div class="file-panel">
    <will-select-file-header></will-select-file-header>
    <div class="file-panel-content">
      <div class="file-panel-list">
        <template v-if="userFileList.isLoading">
          <a-skeleton v-for="item in 3" :key="item"></a-skeleton>
        </template>
        <div class="list-box" v-else>
          <template v-if="userFileList.list.length">
            <div class="file-panel-list-container">
              <div
                class="file-panel-item"
                v-for="(item, index) in userFileList.list"
                :key="index"
                @click.stop="handleViewFile(item.id)">
                <div
                  :class="['file-content',
                  selectFileItemData.currentId === item.id ? 'shadow-style' : '']">
                  <div class="file-inner">
                    <img class="image-file" v-if="item.type === FileEnum.Image" :src="item.url"
                         alt="">
                    <div v-if="item.type === FileEnum.Text">
                      <FileWordOutlined/>
                    </div>
                  </div>
                  <div class="file-name">{{ item.name || '暂无名称' }}</div>
                </div>
              </div>
            </div>
            <div class="pagination-box">
              <ant-pagination
                class="pagination"
                :pageSize="userFileList.pageSize"
                v-model:current="userFileList.pageNumber"
                :total="userFileList.total"
                @change="onPaginationChange"/>
            </div>
          </template>
          <template v-else>
            <empty-view></empty-view>
          </template>
        </div>
      </div>
      <will-select-file-preview @select="handleSelectFile($event)"></will-select-file-preview>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { FileEnum, FileResponseType } from '@metagraph/constant';
import { FileWordOutlined } from '@ant-design/icons-vue';
import { Pagination as AntPagination, Skeleton as ASkeleton, } from 'ant-design-vue';
import WillSelectFilePreview
  from '@/views/file-panel/select-file-modal/will-select-file-preview.vue';
import WillSelectFileHeader from '@/views/file-panel/select-file-modal/will-select-file-header.vue';
import { defineEmits, onMounted } from 'vue';
import {
  getSelectFileItemById,
  getUserFileList,
  selectFileItemData,
  setUserFileListConfig,
  userFileList
} from './select-file-model';

const emit = defineEmits(['select']);
const onPaginationChange = async (page: number) => {
  setUserFileListConfig({
    pageNumber: page,
    pageSize: 12
  });
  await getUserFileList();
};

async function handleViewFile(id: string) {
  selectFileItemData.currentId = id;
  await getSelectFileItemById(id);
}

function handleSelectFile(params: FileResponseType) {
  emit('select', params);
}

onMounted(async () => {
  selectFileItemData.data = undefined;
  setUserFileListConfig({
    pageNumber: 1,
    pageSize: 12
  });
  await getUserFileList();
});
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

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
