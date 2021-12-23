<template>
  <ant-drawer
    :width="600"
    title="知识点"
    placement="right"
    :closable="false"
    v-model:visible="visible"
    :after-visible-change="afterVisibleChange">
    <ant-descriptions title="基本信息" :column="1">
      <ant-descriptions-item label="名称">{{ knowledge.content.name }}</ant-descriptions-item>
      <ant-descriptions-item label="类型">{{ knowledge.content.knowledgeBaseTypeId }}</ant-descriptions-item>
      <ant-descriptions-item label="作者">{{ knowledge.author.name }}</ant-descriptions-item>
      <ant-descriptions-item label="仓库">{{ knowledge.content.repositoryEntityId }}</ant-descriptions-item>
    </ant-descriptions>
    <ant-descriptions title="热度" :column="1">
      <ant-descriptions-item label="评论">{{ knowledge.comment }}</ant-descriptions-item>
      <ant-descriptions-item label="点赞">{{ knowledge.star }}</ant-descriptions-item>
      <ant-descriptions-item label="标签">
        <ant-tag>标签1</ant-tag>
      </ant-descriptions-item>
    </ant-descriptions>
    <h3>概述</h3>
    <div v-if="knowledge?.content?.description">
<!--      <div v-html="knowledge.content.descriptionHTML"></div>-->
      <tiptap-readonly :articleContent="knowledge.content.description"></tiptap-readonly>
    </div>
    <h3>评论</h3>
    <Comment :entityType="'Knowledge'" :entityId="entityId"></Comment>
  </ant-drawer>
</template>

<script lang="ts">
import TiptapReadonly from "@/views/repository-editor/section.article/tiptap-readonly.vue";
import {
  defineComponent, onMounted, ref, toRefs, watch
} from 'vue';
import { EntityNoAuthApiService } from '@/api.service';
import Comment from '../entity-comment/entity-comment.vue';

export default defineComponent({
  name: 'knowledge.drawer',
  components: {
    TiptapReadonly,
    Comment
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
    const { entityId, isShow } = toRefs(props);
    const visible = ref<boolean>(false);
    const knowledge = ref({});
    watch(isShow, async (newValue, oldValue) => {
      if (newValue) {
        const result = await EntityNoAuthApiService.getEntityById({ entityId: entityId.value });
        if (result.data) {
          knowledge.value = result.data;
        }
        console.log(result);
        visible.value = newValue;
      }
    });
    const afterVisibleChange = (bool: boolean) => {
      // console.log('visible', bool);
      context.emit('showChange', false);
    };

    // const showDrawer = () => {
    //   visible.value = true;
    // };

    return {
      visible,
      afterVisibleChange,
      // showDrawer,
      knowledge
    };
  },
});
</script>

<style scoped>

</style>
