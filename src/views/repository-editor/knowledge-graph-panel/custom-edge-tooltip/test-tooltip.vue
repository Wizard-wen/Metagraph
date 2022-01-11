<template>
  <div style="height: 30px; width: 100px;background: red;position: fixed; left: 50%; top: 50%; z-index: 9999"></div>
  <ant-tooltip>
    <template #title>{{ content }}</template>
    <div>11111</div>
  </ant-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Tooltip } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

export default defineComponent({
  name: 'test-tooltip',
  components: {
    AntTooltip: Tooltip
  },
  props: {
    content: {
      type: String
    }
  },
  setup(props) {
    console.log('tool tip', props.content);
  }
});
</script>

<style scoped>

</style>
