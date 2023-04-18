<template>
  <div class="operation-icon" @click="handleParseWord">
    <operation-tooltip :desc="'解析'">
      <div class="icon">
        <UploadIcon class="icon-svg"/>
      </div>
    </operation-tooltip>
    <input
      @change="handleFileChange"
      ref="inputElement"
      type="file"
      name="upload"
      id="upload"
      style="display: none;"/>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import { UploadIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';
import { FileTypeUtil } from '@/utils';
import { message } from 'ant-design-vue';

const inputElement = ref();
const currentFile = ref<File>();

const emit = defineEmits(['open']);
const handleParseWord = (event: MouseEvent) => {
  if (inputElement.value) {
    inputElement.value.click();
    event.preventDefault();
  }
};

async function handleFileChange(event: InputEvent) {
  const target = event.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  [currentFile.value] = target.files;
  const result = await FileTypeUtil.checkFileType(currentFile.value);
  if (!result) return;
  if (result.mime !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    message.error('目前只支持.docx格式的文本解析');
    return;
  }
  emit('open', {
    file: currentFile.value
  });
}

</script>

<style scoped lang="scss">
@import "../../../../style/tiptap.common";
</style>
