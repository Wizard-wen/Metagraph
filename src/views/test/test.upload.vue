<template>
  <input type="file" @change="handleUpload($event)">
</template>

<script lang="ts">
import { FileApiService } from '@/api.service';
import { FileEnum } from 'edu-graph-constant';
import { defineComponent } from 'vue';
import * as qiniu from 'qiniu-js';

export default defineComponent({
  name: 'test',
  data() {
    return {
      fileImageUrl: ''
    };
  },
  methods: {
    handleUpload(event: InputEvent) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files[0]) {
        console.log('file', inputElement.files[0]);
        const file = inputElement.files[0];
        this.customRequestUploadHandler({
          name: file.name,
          file,
          type: file.type.split('/')[1] as FileEnum
        });
      }
    },
    async customRequestUploadHandler(params: {
      file: File,
      name: string;
      type: FileEnum
    }) {
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
      const that = this;
      await qiniu
        .upload(
          params.file,
          tokenForUploading.key,
          tokenForUploading.uploadToken
        )
        .subscribe({
          complete(response: { fileUrl: string; mimeType: string }) {
            that.fileImageUrl = response.fileUrl;
          }
        });
    }
  }
});
</script>

<style scoped>

</style>
