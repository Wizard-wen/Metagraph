<template>
  <div class="clearfix">
    <ant-upload
      class="custom-ant-upload"
      list-type="picture-card"
      :file-list="modelValue"
      @preview="handlePreview"
      :before-upload="beforeUpload"
      :custom-request="handleCustomRequest"
    >
      <div v-if="modelValue.length < 8">
        <plus-outlined/>
        <div class="ant-upload-text">Upload</div>
      </div>
    </ant-upload>
    <ant-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </ant-modal>
  </div>
</template>

<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { FileEnum } from 'metagraph-constant';
import * as qiniu from 'qiniu-js';
import { defineComponent, ref, PropType, toRef } from 'vue';
import { FileApiService } from '@/api.service';

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url: string;
  preview?: string;
  originFileObj?: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export default defineComponent({
  name: 'qiniu-upload-image-list',
  components: {
    PlusOutlined,
  },
  props: {
    modelValue: {
      type: Array as PropType<FileItem[]>
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const previewVisible = ref<boolean>(false);
    const previewImage = ref<string | undefined>('');
    const fileList = toRef(props, 'modelValue');

    const handleCancel = () => {
      previewVisible.value = false;
    };
    const handlePreview = async (file: FileItem) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    const beforeUpload = (file: any) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };

    const customRequestUploadHandler = async (params: {
      file: File,
      name: string;
      type: FileEnum
    }) => {
      const result: {
        data?: {
          key: string;
          uploadToken: string;
        };
        message?: string;
      } = await FileApiService.getCredential({
        name: params.name,
        type: params.type
      });
      const tokenForUploading = result.data;
      console.log(tokenForUploading);
      if (tokenForUploading === undefined) {
        return;
      }
      const observer = {
        complete(response: { key: string; url: string; }) {
          console.log(response);
          context.emit('update:modelValue', [
            ...(fileList.value || []),
            {
              uid: new Date().getTime().toString(),
              url: response.url
            }
          ]);
        }
      };
      await qiniu
        .upload(
          params.file,
          tokenForUploading.key,
          tokenForUploading.uploadToken
        )
        .subscribe(observer);
    };

    const handleCustomRequest = (option: any) => {
      console.log(option);
      const file = option.file as File;
      customRequestUploadHandler({
        name: file.name,
        file,
        type: file.type.split('/')[1] as FileEnum
      });
    };

    return {
      previewVisible,
      previewImage,
      handleCancel,
      handlePreview,
      handleCustomRequest,
      beforeUpload
    };
  },
});
</script>

<style scoped lang="scss">
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.custom-ant-upload {
  ::v-deep(.ant-upload-list-item-info) {
    &:before {
      display: block;
    }
  }
}

</style>
