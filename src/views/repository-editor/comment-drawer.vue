<template>
  <ant-drawer
    :width="600"
    title="评论"
    placement="right"
    :closable="false"
    v-model:visible="visible"
    :after-visible-change="afterVisibleChange"
  >
    <h3>评论</h3>
    <Comment :entityType="'Repository'" :entityId="entityId"></Comment>
  </ant-drawer>
</template>

<script lang="ts">
import {
  defineComponent, ref, toRefs, watch,
} from 'vue';
import Comment from './comment.vue';

export default defineComponent({
  name: 'knowledge.drawer',
  components: {
    Comment
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    entityId: {
      type: String,
      required: true
    },
  },
  setup(props, context) {
    const { entityId, isShow } = toRefs(props);
    const visible = ref<boolean>(false);
    watch(isShow, async (newValue, oldValue) => {
      if (newValue) {
        visible.value = newValue;
      }
    });
    const afterVisibleChange = (bool: boolean) => {
      context.emit('showChange', false);
    };
    return {
      afterVisibleChange,
      visible
    };
  },
});
</script>

<style scoped>

</style>
