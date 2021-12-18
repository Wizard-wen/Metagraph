<template>
  <div class="article-container">
    <div class="editor-range">
      <div class="editor-container"
           :style="{
              width: (paddingValue[1] - paddingValue[0]) + 'px',
              left: paddingValue[0] + 'px',
              right: (816 - paddingValue[1] + 'px')
            }">
        <div :style="{fontSize: articleFontSize + 'px'}">
          <slot nane="tiptap"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const paddingValue = ref<number[]>([0, 816]);
const articleFontSize = ref('12');
</script>

<style scoped lang="scss">
.article-container {
  height: calc(100vh - 116px);
  overflow-y: auto;

  .editor-range {
    position: relative;
    width: 816px;
    min-height: 100%;
    margin: 0 auto;
  }

  .editor-container {
    position: absolute;
    width: 100%;
    background: #fff;
  }
}
</style>
