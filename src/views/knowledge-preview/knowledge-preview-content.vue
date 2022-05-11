<template>
  <div v-if="knowledge">
    <ant-tag v-if="type">{{ typeText }}</ant-tag>
    <p class="h2-level-title-style">基本信息</p>
    <div class="content">
      <ant-row>
        <ant-col :span="24">
          <description-item
            title="知识点名称"
            :class="{
              'edit-back':
              type === 'draft' &&
              edit?.name
            }"
            :content="knowledge.entity.content.name"/>
        </ant-col>
        <ant-col :span="24">
          <description-item
            title="知识点类型"
            :content="knowledge.entity.content.knowledgeBaseTypeName"/>
        </ant-col>
        <ant-col :span="24">
          <description-item
            title="知识点领域"
            :class="{
              'edit-back':
              type === 'draft' &&
              edit?.domain
            }">
            <template #content>
              <ant-tag v-for="(item, index) in knowledge.entity.content.domain" :key="index">
                {{ item.domainName }}
              </ant-tag>
            </template>
          </description-item>
        </ant-col>
        <ant-col :span="12">
          <description-item title="知识库" :content="knowledge.entity.content.repositoryName"/>
        </ant-col>
        <ant-col :span="12">
          <description-item title="作者" :content="knowledge.entity.author.name"/>
        </ant-col>
        <ant-col :span="24">
          <description-item
            title="标签"
            :class="{
              'edit-back':
              type === 'draft' &&
              edit?.tag
            }">
            <template #content>
              <ant-tag v-for="(item, index) in knowledge.entity.tag" :key="index">
                {{ item.name }}
              </ant-tag>
            </template>
          </description-item>
        </ant-col>
      </ant-row>
    </div>
    <p class="h2-level-title-style">信息栏</p>
    <div class="content">
      <template v-if="knowledge.model.customField.length">
        <ant-row
          v-for="(item, index) in knowledge.model.customField"
          :key="index">
          <ant-col :span="24">
            <description-item
              :class="{
                'add-back':
                type === 'draft'
                && !!compare.customField.find(compareItem => compareItem === item.key),
                'delete-back':
                type === 'published'
                && !!compare.customField.find(compareItem => compareItem ===item.key)
              }"
              :title="item.label"
              :content="item.value"/>
          </ant-col>
        </ant-row>
      </template>
    </div>
    <p class="h2-level-title-style">知识点描述</p>
    <tiptap-readonly
      class="custom-tiptap-readonly"
      :article-content="knowledge.model.description"></tiptap-readonly>
    <p class="h2-level-title-style">概念图册</p>
    <div class="content">
      <img
        class="image-style"
        v-for="(item, index) in knowledge.model.pictures"
        :key="index"
        :src="item.url"
        alt=""/>
    </div>
  </div>
</template>

<script lang="ts">
import { EntityCompletelyListItemType, KnowledgeModelType } from 'metagraph-constant';
import {
  computed, defineComponent, onMounted, PropType, toRaw, toRef
} from 'vue';
import {
  Divider, Col, Row, Tag
} from 'ant-design-vue';
import DescriptionItem from '../../business/knowledge-drawer/description-item.vue';
import TiptapReadonly from '../repository-editor/section-article/tiptap-readonly.vue';

export default defineComponent({
  name: 'knowledge-preview-content',
  props: {
    knowledge: {
      type: Object as PropType<{
        model: KnowledgeModelType,
        entity: EntityCompletelyListItemType,
        mentionList: EntityCompletelyListItemType[]
      }>
    },
    compare: {
      type: Object as PropType<{
        customField: string[]
      }>,
    },
    edit: {
      type: Object as PropType<{
        name: boolean;
        domain: boolean;
        tag: boolean;
      }>
    },
    type: {
      type: String as PropType<'draft' | 'published'>,
    }
  },
  setup(props, { emit }) {
    const knowledgeModel = toRef(props, 'knowledge');
    const type = toRef(props, 'type');
    const customFields = computed(() => knowledgeModel.value?.model.customField || []);

    const typeText = computed(() => (type.value === 'draft' ? '草稿箱' : '线上版本'));
    return {
      customFields,
      typeText
    };
  },
  components: {
    TiptapReadonly,
    DescriptionItem,
    AntCol: Col,
    AntRow: Row,
    AntTag: Tag
  },
});
</script>

<style scoped lang="scss">
.image-style {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.h2-level-title-style {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  height: 50px;
  line-height: 50px;
  display: block;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.content {
  padding: 5px;
}

.custom-tiptap-readonly {
  &::v-deep(.ProseMirror) {
    padding: 0px;
  }
}

.add-back {
  background: #e6ffec;
  position: relative;

  &:after {
    position: absolute;
    right: 5px;
    top: 5px;
    content: '+';
  }
}

.delete-back {
  background: #FFEBEA;

  &:after {
    position: absolute;
    right: 5px;
    top: 5px;
    content: '-';
  }
}

.edit-back {
  background: #ddf4ff;
  &:after {
    position: absolute;
    right: 5px;
    top: 5px;
    content: '!';
  }
}
</style>
