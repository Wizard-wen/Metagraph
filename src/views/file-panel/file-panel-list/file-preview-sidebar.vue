<template>
  <div class="file-panel-view">
    <template v-if="showId && filePanelItemData.data">
      <div class="file-name">{{ filePanelItemData.data.name }}</div>
      <div class="image-container">
        <div class="file-inner">
          <img class="preview-image" :src="filePanelItemData.data.url" alt="">
        </div>
      </div>
      <div class="panel-item">
        <div class="title">文件信息</div>
        <div class="item view-item">
          <div class="left">名称</div>
          <div class="right">
            <ant-input
              style="height: 24px;"
              class="custom-input-style"
              v-model:value="newFileName"></ant-input>
          </div>
        </div>
        <div class="item view-item">
          <div class="left">类型</div>
          <div class="right">{{ filePanelItemData.data.mimeType }}</div>
        </div>
        <div class="item view-item">
          <div class="left">文件大小</div>
          <div class="right">{{ CommonUtil.getFileSize(filePanelItemData.data.size) }}</div>
        </div>
        <div class="item view-item">
          <div class="left">创建时间</div>
          <div class="right">
            {{ CommonUtil.timeAgo(new Date(filePanelItemData.data.createdAt).getTime()) }}
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
              v-clipboard="filePanelItemData.data.url">
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
          :title="'修改'"
          @click="handleUpdateFile(filePanelItemData.data.id)"></m-button>
        <m-button
          :is-icon="true"
          :has-border="false"
          @click="handleDeleteFile(filePanelItemData.data.id)">
          <template #icon>
            <DeleteOutlined/>
          </template>
        </m-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  getFilePanelItemById,
  getFilePanelList, filePanelItemData, showId,
  newFileName, removeFileById,
  updateFile
} from '@/views/file-panel/file-panel-model';
import { message, Modal, Input as AntInput } from 'ant-design-vue';
import { createVNode } from 'vue';
import {
  ExclamationCircleOutlined,
  CopyOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { CommonUtil } from '@/utils';
import { MButton } from '@/metagraph-ui';

function handleSuccess() {
  message.success('复制成功');
}

function handleFail() {
  message.error('复制失败');
}
async function handleUpdateFile(id: string) {
  if (newFileName.value) {
    await updateFile({
      id,
      name: newFileName.value
    });
    await getFilePanelItemById(id);
    await getFilePanelList();
  } else {
    message.error('图片名不能为空');
  }
}

async function handleDeleteFile(id: string) {
  Modal.confirm({
    title: '确定删除当前图片?',
    okText: '确定',
    cancelText: '取消',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除关系操作不可恢复，请谨慎操作',
    async onOk() {
      await removeFileById(id);
      await getFilePanelList();
    },
    onCancel() {
      message.info('取消删除');
    }
  });
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.file-panel-view {
  width: 300px;
  height: 100%;
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

    //.view-item {
    //  &:hover {
    //    background: $hoverBackColor;
    //  }
    //}

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
    width: 300px;
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
