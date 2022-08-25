<template>
  <ant-empty
    class="custom-empty-view"
    :image="simpleImage"
    description="暂无数据">
    <slot name="content"></slot>
  </ant-empty>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Empty } from 'ant-design-vue';

export default defineComponent({
  name: 'empty-view',
  components: {
    AntEmpty: Empty
  },
  setup() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  }
});
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
