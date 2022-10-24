<template>
  <!--  <antv-flowchart></antv-flowchart>-->
  <!--  <repo-item-hover></repo-item-hover>-->
  <input type="file" @change="handleFileChange($event)">
</template>

<script lang="ts">
import AntvFlowchart from '@/views/repository-editor/antv-flowchart/antv-flowchart.vue';
import RepoItemHover from '@/views/test/repo-item-hover.vue';
import 'intro.js/introjs.css';
import { defineComponent, onMounted, ref } from 'vue';
import 'metagraph-ui/dist/style.css';
import { parse, Parser } from 'csv-parse';

export default defineComponent({
  name: 'component.test',
  components: {
    RepoItemHover,
    AntvFlowchart,
  },
  setup() {
    const imageUrl = ref('');
    onMounted(() => {
    });

    function handleFileChange(event: Event) {
      const fileElement = event.target as HTMLInputElement;
      const { files } = fileElement;
      if (files) {
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = (data) => {
          console.log(data, files[0]);
          parse(data.target?.result as string, {
            info: true,
            skip_records_with_error: true,
            // 最大支持解析10000行
            to_line: 10000
          }, (error, data) => {
            console.log(error, data);
          });
        };
      }
    }

    return {
      imageUrl,
      handleFileChange
    };
  }
});
</script>

<style scoped lang="scss">
.ele {
  height: 120px;
  width: 120px;
  background: red;
}
</style>
