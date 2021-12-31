<template>
  <ant-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="isVisible"
    @close="handleClose">
    <p class="h2-level-title-style h1-level-title-style">{{ knowledge.content.name }}</p>
    <p class="h2-level-title-style">基本信息</p>
    <ant-row>
      <ant-col :span="24">
        <description-item title="知识点类型" :content="knowledge.content.knowledgeBaseTypeId"/>
      </ant-col>
      <ant-col :span="24">
        <description-item title="知识点领域" :content="knowledge.content.domainId"/>
      </ant-col>
    </ant-row>
    <ant-row>
      <ant-col :span="12">
        <description-item title="知识库" :content="knowledge.content.repositoryEntityId"/>
      </ant-col>
      <ant-col :span="12">
        <description-item title="作者" :content="knowledge.author.name"/>
      </ant-col>
    </ant-row>
    <ant-row>
      <ant-col :span="24">
        <description-item title="标签">
          <template #content>
            <ant-tag v-for="item in knowledge.tag">{{ item.name }}</ant-tag>
          </template>
        </description-item>
      </ant-col>
    </ant-row>
    <ant-divider/>
    <p class="h2-level-title-style">信息栏</p>
    <ant-row v-for="item in knowledge.content.customField">
      <ant-col :span="24">
        <description-item
          :title="item.label"
          :content="item.value"/>
      </ant-col>
    </ant-row>
    <ant-divider/>
    <p class="h2-level-title-style">详情</p>
    <tiptap-readonly :article-content="knowledge.content.description"></tiptap-readonly>
  </ant-drawer>
</template>

<script lang="ts">
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { defineComponent, PropType } from 'vue';
import TiptapReadonly from '@/views/repository-editor/section.article/tiptap-readonly.vue';
import DescriptionItem from './description-item.vue';

export default defineComponent({
  name: 'knowledge-drawer-content',
  emits: ['close'],
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    knowledge: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  components: {
    TiptapReadonly,
    DescriptionItem
  },
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close');
    };
    return {
      handleClose,
    };
  },
});
</script>

<style scoped lang="scss">
.h1-level-title-style {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bolder;
}
.h2-level-title-style {
  font-size: 18px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  display: block;
  margin-bottom: 16px;
}
</style>
