<template>
  <ant-empty
    class="custom-empty-view"
    :image="simpleImage"
    :description="description">
    <slot name="content"></slot>
  </ant-empty>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { Empty } from 'ant-design-vue';

const AntEmpty = Empty;

defineProps({
  description: {
    type: String,
    default: '暂无数据'
  }
});
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.custom-empty-view {
  &::v-deep(.ant-empty-description) {
    font-size: $iconFontSize;
  }

  &::v-deep(.ant-empty-image) {
    height: 30px;

    .ant-empty-img-simple {
      height: 30px;
      width: 47px;
    }
  }
}
</style>
