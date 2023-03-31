<template>
  <div class="bind-panel">
    <div class="knowledge-connection">
      <div class="title">引用的知识点</div>
      <div class="content" v-if="mentionedKnowledge.list.length">
        <div
          class="content-item"
          :key="index"
          v-for="(item, index) in mentionedKnowledge.list">
          {{ item.content.name }}
          <div class="control-right">
            <EyeOutlined @click="showKnowledgeDrawer(item)"/>
            <delete-icon @click="handleRemoveEdge(item)"></delete-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from 'metagraph-constant';
import {
  createVNode, inject, ref, defineComponent
} from 'vue';
import { DeleteIcon } from '@/components/icons';
import {
  mentionedKnowledge,
  KnowledgeEdit,
  draftKnowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from './model/knowledge.edit';

/**
 * 功能需求
 * 1.获取知识点引用的知识点
 * 2.编辑知识点基本信息
 * 3.动态增加信息项
 * 4.知识点的信息定义要有一个文字的上限
 * 5.可以为知识点引用静态资源？
 * 6.知识点之间的同义词
 * 7.引用数量 被引数量 建立的关系说明
 * 8.文本编辑器中的mention节点可以被点击，不但展示引用的知识点的信息，还要展示引用的理由
 * 9.引用知识点时，弹窗应该添加引用的原因
 * 10.可以选择一段文本，直接标记为引用
 * 11.可以考虑展示一下，同一个知识点之间的循环引用关系
 */

export default defineComponent({
  name: '',
  components: {
    DeleteIcon,
    EyeOutlined
  },
  setup() {
    const repositoryEntityId = inject(repositoryEntityIdInjectKey, ref(''));
    const knowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgePreview = new KnowledgePreview();

    function handleRemoveEdge(item: EntityCompletelyListItemType & { edgeId: string }) {
      console.log(item);
      const knowledgeContent = item.content as KnowledgeResponseType;
      Modal.confirm({
        title: '确定删除知识点关联吗',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定要删除与知识点"${knowledgeContent.name}"的关联吗?`,
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          await knowledgeEdit.removeMentionKnowledge(
            knowledgeEntityId.value,
            item.entity.id
          );
        },
        onCancel() {
          message.info('取消解绑！');
        },
      });
    }

    function showKnowledgeDrawer(item: EntityCompletelyListItemType) {
      knowledgePreview.handleShowKnowledgeDrawer(item.entity.id, 'published');
    }

    return {
      handleRemoveEdge,
      showKnowledgeDrawer,
      mentionedKnowledge
    };
  }
});

</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.bind-panel {
  background: #FFFFFF;
  border-right: solid 1px $borderColor;
  width: 100%;
  height: calc(100vh - 55px);
}

.knowledge-connection {
  width: 100%;
  height: 100%;

  .title {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    background: $lightGray;
    border-bottom: 1px solid $borderColor;
  }

  .content {
    padding: 10px 0;

    .content-item {
      padding: 0 10px;
      text-align: left;
      height: 35px;
      line-height: 35px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .control-right {
        display: flex;
        gap: 5px;
      }

      &:hover {
        @include list-item-highlight;
      }
    }
  }
}
</style>
