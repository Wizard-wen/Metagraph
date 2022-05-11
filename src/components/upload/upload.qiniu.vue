<template>
  <ant-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :custom-request="handleCustomRequest"
  >
    <div class="div1" v-if="imageUrl">
      <img :src="imageUrl" height="120" width="120" alt="avatar"/>
    </div>
    <div v-else>
      <LoadingOutlined v-if="loading"/>
      <PlusOutlined v-else/>
    </div>
  </ant-upload>
</template>

<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message, Upload } from 'ant-design-vue';
import * as qiniu from 'qiniu-js';
import {
  defineComponent, ref, toRefs, watch
} from 'vue';
import { FileEnum } from 'metagraph-constant';
import { FileApiService } from '@/api.service';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

export default defineComponent({
  name: 'upload-qiniu',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  components: {
    LoadingOutlined,
    PlusOutlined,
    AntUpload: Upload
  },
  setup(props, context) {
    const { modelValue } = toRefs(props);
    const fileList = ref<{ url: string }[]>([{ url: modelValue.value }]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>(modelValue.value);
    watch(modelValue, (value) => {
      console.log(value);
      fileList.value = [{ url: value }];
      imageUrl.value = value;
    });
    const beforeUpload = (file: FileItem) => {
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
        type: params.type,
        provider: 'System'
      });
      const tokenForUploading = result.data;
      console.log(tokenForUploading);
      if (tokenForUploading === undefined) {
        return;
      }
      const observer = {
        complete(response: { key: string; url: string; }) {
          console.log(response);
          context.emit('update:modelValue', response.url);
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
      fileList,
      loading,
      imageUrl,
      // handleChange,
      beforeUpload,
      handleCustomRequest
    };
  },
});
</script>

<style scoped lang="scss">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

//.div1 {
//  width: 300px;
//  height: 300px;
//  //border: 1px solid black;
//  display: table-cell;
//  vertical-align: middle;
//}
//
//.div1 img {
//  max-width: 100%;
//  max-height: 100%;
//  display: block;
//  margin: auto;
//}
</style>
