<template>
  <div class="knowledge-preview">

    <p class="title">{{previewModel.entity.content.name}}</p>
    <div class="author">
      <div class="author-name">wizard.song</div>
      <div  class="publish-date">2023-08-06 19:20</div>
    </div>
    <p class="h2-level-title-style" id="preview-card-1">基本信息</p>
    <div class="content-padding">
      <ant-row>
        <ant-col :span="24">
          <description-item
            title="知识点名称"
            :content="previewModel.entity.content.name"/>
        </ant-col>
        <ant-col :span="24">
          <description-item
            title="知识点类型"
            :content="previewModel.entity.content.knowledgeBaseTypeName"/>
        </ant-col>
        <ant-col :span="12">
          <description-item
            title="知识库">
            <template #content>
              <a @click="goRepositoryPage">
                {{ previewModel.entity.content.repositoryName }}
                <LinkOutlined/>
              </a>
            </template>
          </description-item>
        </ant-col>
        <ant-col :span="12">
          <description-item title="作者" :content="previewModel.entity.author.name"/>
        </ant-col>
        <ant-col :span="24">
          <description-item title="知识点领域">
            <template #content>
              <ant-tag v-for="(item, index) in previewModel.entity.content.domain" :key="index">
                {{ item.domainName }}
              </ant-tag>
            </template>
          </description-item>
        </ant-col>
        <ant-col :span="24">
          <description-item title="标签">
            <template #content>
              <ant-tag v-for="(item, index) in previewModel.entity.tag" :key="index">
                {{ item.name }}
              </ant-tag>
            </template>
          </description-item>
        </ant-col>
      </ant-row>
    </div>
    <p class="h2-level-title-style" id="preview-card-2">信息栏</p>
    <div class="content-padding">
      <ant-row>
        <ant-col
          v-for="(item, index) in previewModel.entity.content.customField" :key="index"
          :span="12 * item.grid">
          <description-item
            :title="item.label"
            :content="item.value"/>
        </ant-col>
      </ant-row>
    </div>

    <p class="h2-level-title-style" id="preview-card-3">知识点描述</p>
    <div class="content-padding">
      <tiptap-editor-readonly
        class="custom-tiptap-readonly"
        :article-content="previewModel.entity.content.description"></tiptap-editor-readonly>
    </div>

    <p class="h2-level-title-style" id="preview-card-4">概念图册</p>
    <div class="picture-content content-padding" v-if="provider !== 'page'">
      <img
        class="image-style"
        v-for="(item, index) in previewModel.entity.content.pictures"
        :key="index"
        :src="item.url"
        alt=""/>
    </div>
    <div class="picture-content content-padding" v-if="provider === 'page'">
      <ant-image-preview-group>
        <ant-image
          :width="200"
          v-for="(item, index) in previewModel.entity.content.pictures"
          :key="index"
          :src="item.url"
        />
      </ant-image-preview-group>
    </div>
    <p class="h2-level-title-style" id="preview-card-5">参考知识点</p>
    <div class="content-padding">
      <ant-list>
        <ant-list-item v-for="(item, index) in previewModel.mentionList" :key="index">
          <template #actions>
            <ant-button size="small" @click="goProfilePage(item.entity.id)">查看</ant-button>
          </template>
          <ant-list-item-meta>
            <template #description>
              作者：{{ item.author.name }} 知识库：{{ item.content.repositoryName }}
            </template>
            <template #title>
              <div class="name" @click="goProfilePage(item.entity.id)">
                {{ item.content.name }}
              </div>
            </template>
          </ant-list-item-meta>
          <ant-tag
            :key="index"
            v-for="(tagItem, index) in item.content.domain">
            {{ tagItem.domainName }}
          </ant-tag>
        </ant-list-item>
      </ant-list>
    </div>
  </div>

</template>

<script lang="ts">
import {
  Button, Col, List, Row, Tag, Image
} from 'ant-design-vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';
import {
  defineComponent, PropType
} from 'vue';
import { useRouter } from 'vue-router';
import { LinkOutlined } from '@ant-design/icons-vue';
import TiptapEditorReadonly from '@/components/tiptap-text-editor/tiptap-editor-readonly.vue';
import DescriptionItem from '@/business/knowledge-drawer/description-item.vue';

export default defineComponent({
  name: 'knowledge-preview-component',
  props: {
    previewModel: {
      type: Object as PropType<{
        entity: EntityCompletelyListItemType,
        mentionList: EntityCompletelyListItemType[]
      }>,
      required: true
    },
    provider: {
      type: String as PropType<'drawer' | 'page'>
    }
  },
  components: {
    TiptapEditorReadonly,
    DescriptionItem,
    AntCol: Col,
    AntRow: Row,
    AntTag: Tag,
    AntButton: Button,
    AntList: List,
    AntListItemMeta: List.Item.Meta,
    AntListItem: List.Item,
    AntImage: Image,
    AntImagePreviewGroup: Image.PreviewGroup,
    LinkOutlined
  },
  setup() {
    const router = useRouter();

    function goProfilePage(id: string) {
      const { href } = router.resolve({
        path: '/knowledge/preview',
        query: {
          publishedKnowledgeEntityId: id
        }
      });
      window.open(href, '_blank');
    }

    function goRepositoryPage() {

    }

    return {
      goProfilePage,
      goRepositoryPage
    };
  }
});
</script>

<style scoped lang="scss">
.knowledge-preview {
  padding: 32px;
  margin-bottom: 100px;
  box-shadow: 0 0 3px rgba(0, 0, 0, .2);
  background: #FFFFFF;
  .title {
    font-size: 32px;
    margin-bottom: 20px;
  }
  .author {
    display: flex;
    line-height: 28px;
    margin-bottom: 20px;
    .author-name {

      margin-right: 18px;
    }
    .publish-date {
      color: #8a919f;
    }
  }
}
.content-padding {
  padding: 5px;
  min-height: 100px;
}

.picture-content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 5px;
}

.image-style {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.h2-level-title-style {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  height: 50px;
  line-height: 50px;
  display: block;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.custom-tiptap-readonly {
  &::v-deep(.ProseMirror) {
    padding: 0px;
  }
}
</style>
