<template>
  <ant-drawer
    :width="600"
    title="知识点"
    placement="right"
    :closable="false"
    :visible="isShow"
    :after-visible-change="afterVisibleChange">
    <div v-if="knowledge">
      <ant-descriptions title="基本信息" :column="1">
        <ant-descriptions-item label="名称">{{ knowledge.content.name }}</ant-descriptions-item>
        <ant-descriptions-item label="类型">{{ knowledge.content.knowledgeBaseTypeName }}</ant-descriptions-item>
        <ant-descriptions-item label="作者">{{ knowledge.author.name }}</ant-descriptions-item>
        <ant-descriptions-item label="知识库">{{ knowledge.content.repositoryName }}</ant-descriptions-item>
      </ant-descriptions>
      <ant-descriptions title="热度" :column="1">
        <ant-descriptions-item label="评论">{{ knowledge.comment }}</ant-descriptions-item>
        <ant-descriptions-item label="点赞">{{ knowledge.star }}</ant-descriptions-item>
        <ant-descriptions-item label="标签">
          <ant-tag v-for="item in knowledge.tag">{{ item.name }}</ant-tag>
        </ant-descriptions-item>
      </ant-descriptions>
      <h3>概述</h3>
      <div v-if="knowledge?.content?.description">
        <tiptap-readonly :articleContent="knowledge.content.description"></tiptap-readonly>
      </div>
    </div>

  </ant-drawer>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, toRefs, watch
} from 'vue';
import TiptapReadonly from '@/views/repository-editor/section-article/tiptap-readonly.vue';
import { EntityNoAuthApiService } from '@/api.service';

export default defineComponent({
  name: 'knowledge-drawer',
  components: {
    TiptapReadonly
  },
  props: {
    entityId: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const {
      entityId,
      isShow
    } = toRefs(props);
    const visible = ref<boolean>(false);
    const knowledge = ref();
    const afterVisibleChange = (bool: boolean) => {
      context.emit('showChange', false);
    };

    onMounted(async () => {
      const result = await EntityNoAuthApiService.getEntityById({ entityId: entityId.value });
      if (result.data) {
        knowledge.value = result.data;
      }
    });
    return {
      visible,
      afterVisibleChange,
      knowledge
    };
  },
});
</script>

<style scoped>

</style>
