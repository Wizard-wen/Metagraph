<template>
  <div class="file-panel-view">
    <template v-if="fileModel">
      <div class="file-name">{{ fileModel.name }}</div>
      <div class="panel-item">
        <div class="title">文件信息</div>
        <div class="item view-item">
          <div class="left">名称</div>
          <div class="right">
            <ant-input
              class="custom-name-input"
              v-model:value="newFileName"></ant-input>
          </div>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="item view-item">
          <div class="left">类型</div>
          <div class="right">{{ fileModel.mimeType }}</div>
        </div>
        <div class="item view-item">
          <div class="left">文件大小</div>
          <div class="right">{{ CommonUtil.getFileSize(fileModel.size) }}</div>
        </div>
        <div class="item view-item">
          <div class="left">创建时间</div>
          <div class="right">
            {{ CommonUtil.timeAgo(new Date(fileModel.createdAt).getTime()) }}
          </div>
        </div>
        <div class="item view-item">
          <div class="left">文件地址</div>
          <div class="right">
            <div>{{ fileModel.url }}</div>

          </div>
        </div>
      </div>
      <div class="control">
        <m-button
          class="change-btn"
          :title="'修改'"
          @click="handleUpdateFile(fileModel.id)"></m-button>
        <m-button
          :is-icon="true"
          :has-border="false"
          v-clipboard:success="handleSuccess"
          v-clipboard:error="handleFail"
          v-clipboard="fileModel.url">
          <template #icon>
            <copy-outlined></copy-outlined>
          </template>
        </m-button>
        <m-button
          :is-icon="true"
          :has-border="false"
          @click="handleDeleteFile(fileModel.id)">
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
  removeFileById,
  updateFile
} from '@/views/file-panel/file-panel-list/file-panel-list-model';
import { Input as AntInput, message, Modal } from 'ant-design-vue';
import { ref, createVNode, defineProps, PropType, watchEffect, defineEmits } from 'vue';
import { CopyOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { CommonUtil } from '@/utils';
import { MButton } from '@/metagraph-ui';
import { FileResponseType } from '../../../../../metagraph-constant';

const props = defineProps({
  fileModel: {
    type: Object as PropType<FileResponseType>,
    required: true
  }
});
const emit = defineEmits(['update', 'delete']);
const newFileName = ref();
const errorMessage = ref();

watchEffect(() => {
  newFileName.value = props.fileModel?.name;
});

function handleSuccess() {
  message.success('复制成功');
}

function handleFail() {
  message.error('复制失败');
}

async function handleUpdateFile(id: string) {
  if (!newFileName.value) {
    errorMessage.value = '请输入文件地址';
    return;
  }
  errorMessage.value = '';
  emit('update', {
    id,
    name: newFileName.value
  });
}

async function handleDeleteFile(id: string) {
  emit('delete', {
    id
  });
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.file-panel-view {
  background: #FFF;
  width: 100%;
  height: 100%;
  border-left: 1px solid $hoverDeepBackColor;
  padding-top: 12px;

  .file-name {
    min-height: 32px;
    line-height: 32px;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    padding: 0 10px;
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

        .custom-name-input {
          height: 36px;
          border-radius: 6px;

          &:focus {
            box-shadow: none;
          }
        }
      }
    }

    .error-message {
      padding-left: 80px;
      font-size: 12px;
      line-height: 32px;
      width: 100%;
      color: red;
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

  .file-preview-container {
    width: 100%;
    height: 300px;

    //.file-inner {
    //  background-color: #fff;
    //  background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee),
    //  linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee);
    //  background-size: 19px 19px;
    //  background-position: 0 0, 9px 9px;
    //
    //  height: 100%;
    //  width: 100%;
    //  display: flex;
    //  align-items: center;
    //  justify-content: center;
    //
    //  .preview-image {
    //    max-height: 100%;
    //    max-width: 100%;
    //  }
    //}
  }


}
</style>
