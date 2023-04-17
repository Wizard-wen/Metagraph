<template>
  <div class="file-panel-view">
    <template v-if="selectFileItemData.currentId && selectFileItemData.data">
      <div class="file-name">{{ selectFileItemData.data.name }}</div>
      <div class="image-container">
        <div class="file-inner">
          <img class="preview-image" :src="selectFileItemData.data.url" alt="">
        </div>
      </div>
      <div class="panel-item">
        <div class="title">文件信息</div>
        <div class="item view-item">
          <div class="left">名称</div>
          <div class="right">
            {{ selectFileItemData.data.name }}
          </div>
        </div>
        <div class="item view-item">
          <div class="left">类型</div>
          <div class="right">{{ selectFileItemData.data.mimeType }}</div>
        </div>
        <div class="item view-item">
          <div class="left">文件大小</div>
          <div class="right">{{ CommonUtil.getFileSize(selectFileItemData.data.size) }}</div>
        </div>
        <div class="item view-item">
          <div class="left">创建时间</div>
          <div class="right">
            {{ CommonUtil.timeAgo(new Date(selectFileItemData.data.createdAt).getTime()) }}
          </div>
        </div>
        <div class="item view-item">
          <div class="left">文件地址</div>
          <div class="right">
            <m-button
              :is-icon="true"
              :has-border="false"
              v-clipboard:success="handleSuccess"
              v-clipboard:error="handleFail"
              v-clipboard="selectFileItemData.data.url">
              <template #icon>
                <copy-outlined></copy-outlined>
              </template>
            </m-button>
          </div>
        </div>
      </div>
      <div class="control">
        <m-button
          class="change-btn"
          :title="'选择'"
          @click="handleSelectFileItem(selectFileItemData.data.id)"></m-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { selectFileItemData, } from '@/views/file-panel/select-file-modal/select-file-model';
import { message } from 'ant-design-vue';
import { CopyOutlined } from '@ant-design/icons-vue';
import { CommonUtil } from '@/utils';
import { MButton } from '@/metagraph-ui';
import { defineEmits } from 'vue';


const emit = defineEmits(['select']);

function handleSuccess() {
  message.success('复制成功');
}

function handleFail() {
  message.error('复制失败');
}

async function handleSelectFileItem(id: string) {
  emit('select', { id });
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.file-panel-view {
  width: 300px;
  height: 100%;
  box-sizing: border-box;
  border-left: 1px solid $hoverDeepBackColor;
  padding-top: 12px;

  .file-name {
    height: 32px;
    line-height: 32px;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    margin-bottom: 12px;
  }

  .panel-item {
    padding: 4px 0 8px;
    width: 100%;

    .title {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      width: 100%;
      padding: 0 16px;
      font-weight: bold;
      text-align: left;
    }

    .item {
      display: flex;
      margin: 0 16px 0 8px;
      padding: 4px 0 4px 8px;
      line-height: 20px;
      border-radius: 6px;
      font-size: 12px;
      text-align: left;
      align-items: center;

      .left {
        flex: 0 0 64px;
        color: $lightFontColor;
      }

      .right {
        flex: 1 1 auto;
        word-wrap: break-word;
        white-space: normal;
        word-break: break-all;
        @include custom-input-style-mixin;
      }
    }
  }

  .control {
    padding: 0 10px;
    display: flex;

    .change-btn {
      flex: 1;
      margin-right: 10px;
    }
  }

  .image-container {
    width: 100%;
    height: 300px;

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

      .preview-image {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
}
</style>
