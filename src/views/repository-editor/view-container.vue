<template>
  <div class="section-view">
    <section-view-container
      v-if="viewStatus === 'section'" ></section-view-container>
    <graph-view-container
      v-else></graph-view-container>
  </div>
</template>

<script lang="ts">
import GraphViewContainer from '@/views/repository-editor/view-container/graph-view-container.vue';
import SectionViewContainer from '@/views/repository-editor/view-container/section-view-container.vue';
/**
 * repositoryEditor页面分为三个部分，header view-container 和 sidebar
 *
 * view-container 分为 graph-view 和 section-view
 *
 * section-view 包括 section-tree 和section-content
 *
 * section-content 包括 text 和 flowChart
 */
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'section-view-container',
  components: {
    GraphViewContainer,
    SectionViewContainer
  },
  props: {
    viewStatus: {
      type: String as PropType<'section' | 'graph'>,
      required: true,
      default: 'section'
    }
  },
  setup() {

  }
});
</script>

<style scoped lang="scss">
.section-view {
  height: 100%;
  display: flex;
}
</style>
