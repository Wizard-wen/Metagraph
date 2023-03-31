<template>
  <div class="clearfix">
    <ant-upload
      class="custom-ant-upload"
      list-type="picture-card"
      :file-list="modelValue"
      @preview="handlePreview"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :custom-request="handleCustomRequest">
      <div v-if="modelValue.length < 8">
        <plus-outlined/>
        <div class="ant-upload-text">上传</div>
      </div>
    </ant-upload>
    <ant-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </ant-modal>
  </div>
</template>

<script lang="ts">
import { QiniuUploadService } from '@/service/qiniu.upload.service';
import { KnowledgePicturesFrontendType } from '@/views/knowledge-editor/model/knowledge.edit.type';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message, Modal, Upload } from 'ant-design-vue';
import { FileEnum } from 'metagraph-constant';
import {
  defineComponent, ref, PropType, toRef, createVNode
} from 'vue';

export default defineComponent({
  name: 'qiniu-upload-image-list',
  components: {
    PlusOutlined,
    AntUpload: Upload,
    AntModal: Modal
  },
  props: {
    modelValue: {
      type: Array as PropType<KnowledgePicturesFrontendType[]>
    }
  },
  emits: ['update:modelValue', 'remove'],
  setup(props, context) {
    const previewVisible = ref<boolean>(false);
    const previewImage = ref<string | undefined>('');
    const fileList = toRef(props, 'modelValue');

    const handleCancel = () => {
      previewVisible.value = false;
    };
    const handlePreview = async (file: KnowledgePicturesFrontendType) => {
      console.log(file, '===preview');
      previewImage.value = file.url;
      previewVisible.value = true;
    };

    const beforeUpload = (file: File) => {
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

    async function handleCustomRequest(option: any) {
      console.log(option);
      const file = option.file as File;
      const qiniuUploadService = new QiniuUploadService();
      const result = await qiniuUploadService.customRequestUploadHandler({
        name: file.name,
        file,
        type: file.type.split('/')[1] as FileEnum,
        provider: 'KnowledgePictures'
      });
      if (result) {
        message.success('上传成功！');
        context.emit('update:modelValue', [
          ...(fileList.value || []),
          {
            uid: new Date().getTime()
              .toString(),
            url: result.url,
            fileKey: result.key
          }
        ]);
      } else {
        message.error('上传失败！');
      }
    }

    function handleRemove(item: KnowledgePicturesFrontendType) {
      Modal.confirm({
        title: '删除图片',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定删除该图片吗?',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          context.emit('remove', item);
        },
        onCancel() {
          message.info('取消删除！');
        }
      });
      return true;
    }

    return {
      previewVisible,
      previewImage,
      handleCancel,
      handlePreview,
      handleCustomRequest,
      beforeUpload,
      handleRemove
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
