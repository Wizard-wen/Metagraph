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
    <img v-if="imageUrl" :src="rootUrl + imageUrl" alt="avatar"/>
    <div v-else>
      <LoadingOutlined v-if="loading"/>
      <PlusOutlined v-else/>
      <div class="ant-upload-text">Upload</div>
    </div>
  </ant-upload>
</template>

<script lang="ts">
import { FileApiService } from '@/api.service';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import * as qiniu from 'qiniu-js';
import {
  defineComponent, ref, toRefs, watch
} from 'vue';
import { FileEnum } from '../../../../edu-graph-constant';

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
  name: 'upload.qiniu',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    rootUrl: {
      type: String,
      default: 'http://file.songxiwen.com.cn/'
      // required: true
    }
  },
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  setup(props, context) {
    const { modelValue, rootUrl } = toRefs(props);
    const fileList = ref<{ url: string }[]>([{ url: rootUrl.value + modelValue.value }]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>(modelValue.value);
    watch(modelValue, (value) => {
      console.log(value);
      fileList.value = [{ url: rootUrl.value + value }];
      imageUrl.value = value;
    });
    // const handleChange = (info: FileInfo) => {
    //   if (info.file.status === 'uploading') {
    //     loading.value = true;
    //     return;
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, (base64Url: string) => {
    //       imageUrl.value = base64Url;
    //       loading.value = false;
    //     });
    //   }
    //   if (info.file.status === 'error') {
    //     loading.value = false;
    //     message.error('upload error');
    //   }
    // };

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
        type: params.type
      });
      const tokenForUploading = result.data;
      console.log(tokenForUploading);
      if (tokenForUploading === undefined) {
        return;
      }
      const observer = {
        complete(response: { key: string; }) {
          console.log(response);
          context.emit('update:modelValue', response.key);
          // fileList.value = [{
          //   url: rootUrl + response.key
          // }];
          // imageUrl.value = rootUrl + response.key;
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

    // const handleUpload = (event: InputEvent) => {
    //   const inputElement = event.target as HTMLInputElement;
    //   if (inputElement.files && inputElement.files[0]) {
    //     console.log('file', inputElement.files[0]);
    //     const file = inputElement.files[0];
    //     customRequestUploadHandler({
    //       name: file.name,
    //       file,
    //       type: file.type.split('/')[1] as FileEnum
    //     });
    //   }
    // };

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
</style>
