<template>
  <div class="right-sidebar-container">
    <div class="control-button-content">
      <ant-button class="full-button-style" @click="handleOpenParseTextModal">
        <template #icon>
          <UploadOutlined/>
        </template>
        解析文本
      </ant-button>
    </div>
    <div class="right-sidebar-content">
      <template v-if="alternative.target.length">
        <article-item
          v-for="(item, index) in alternative.target"
          :key="index"
          :expend-item-id="expendId"
          :article-item="item"
          @expend="handleExpend"
          @controlArticle="handleControlArticle"
          @controlKnowledge="handleControlKnowledge"
          ></article-item>
      </template>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { createVNode, defineEmits, inject, ref } from 'vue';
import { Button as AntButton, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { AlternativeKnowledgeModelType } from 'metagraph-constant';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { alternative, RepositoryEditor } from '../model/repository.editor';
import ArticleItem from '@/views/repository-editor/right-sidebar/article-item.vue';
import { KnowledgeArticleModelType } from 'metagraph-constant/dist/type/knowledge.type';

const emit = defineEmits(['open', 'createOrBindEntity']);

const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const repositoryEditor = new RepositoryEditor();

function handleOpenParseTextModal() {
  emit('open');
}

const expendId = ref();

function handleExpend(value: string) {
  if (expendId.value === value) {
    expendId.value = '';
  } else {
    expendId.value = value;
  }
}

async function deleteAlternativeKnowledge(childItem: AlternativeKnowledgeModelType) {
  Modal.confirm({
    title: '删除备选知识点',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要删除备选知识点"${childItem.name}"吗?`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      await repositoryEditor.removeAlternativeKnowledge({
        repositoryEntityId: repositoryEntityId.value,
        id: childItem.id
      });
      await repositoryEditor
        .getAlternativeKnowledgeList(repositoryEntityId.value);
    },
    onCancel() {
      message.info('取消删除！');
    },
  });
}

async function handleControlArticle(params: {
  type: string,
  data: KnowledgeArticleModelType
}) {
  // todo
}

async function handleControlKnowledge(params: {
  type: string,
  data: AlternativeKnowledgeModelType
}) {
  if (params.type === 'CreateKnowledge') {
    emit('createOrBindEntity', {
      searchText: params.data.name
    });
  }
  if (params.type === 'DeleteKnowledge') {
    await deleteAlternativeKnowledge(params.data);
  }
}
</script>

<style scoped lang="scss">
@import '../../../style/common';
@import "right-sidebar.scss";


.control-button-content {
  padding: 10px 15px 10px 15px;
  border-bottom: 1px solid $borderColor;

  .full-button-style {
    width: 100%;
    font-size: 12px;
    border-radius: 4px;
  }
}

.right-sidebar-content {
  height: calc(100vh - 135px);
  padding: 10px;
  overflow-y: auto;
}


//.entity-item {
//  height: 32px;
//  line-height: 32px;
//  width: 100%;
//  text-align: left;
//  display: flex;
//  align-items: center;
//  justify-content: space-between;
//  padding: 0 15px;
//  font-size: 12px;
//
//  &:hover {
//    @include list-item-highlight;
//  }
//
//  .left {
//    display: flex;
//    align-items: center;
//    gap: 15px;
//  }
//
//  .right {
//    .custom-tag {
//      padding: 0 5px;
//      line-height: 18px;
//      margin-right: 0;
//    }
//
//    display: flex;
//    align-items: center;
//    gap: 10px;
//    font-size: 14px;
//  }
//}
</style>
