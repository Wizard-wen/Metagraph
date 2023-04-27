<template>
  <div class="file-panel-list-container">
    <div
      class="file-panel-item"
      v-for="(item, index) in knowledgePictures"
      :key="index"
      @click.stop="handleViewFile(item.url)">
      <div
        :class="['file-content',
                  currentId === item.fileId ? 'shadow-style' : '']">
        <div class="file-inner">
          <img class="image-file" :src="item.url" alt="">
        </div>
        <div class="file-name">{{ item.name || '暂无名称' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType, ref } from 'vue';

const currentId = ref();
defineProps({
  knowledgePictures: {
    type: Array as PropType<{
      fileId: string;
      url: string;
      name?: string;
      isCover?: boolean;
      size?: number;
    }[]>
  }
});

function handleViewFile(url: string) {

}
</script>

<style scoped lang="scss">
@import "../../../../style/common.scss";

@keyframes zy {
  0% {
    transform: rotate(3deg);
  }

  50% {
    transform: rotate(-3deg);
  }

  100% {
    transform: rotate(3deg);
  }
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
        animation: zy .2s linear infinite;

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
</style>
