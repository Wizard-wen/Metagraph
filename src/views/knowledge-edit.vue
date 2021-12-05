<template>
  <ant-spin :spinning="spinning">
    <div class="knowledge-edit">
      <div class="knowledge-header">
        <div class="left">
          <go-back-icon class="back-icon"></go-back-icon>
          <div class="title">知识点名称</div>
          <ant-tag class="status-tag">未认证</ant-tag>
        </div>
        <div class="right">
          <ant-tag>引用 23</ant-tag>
          <ant-tag>被引 23</ant-tag>
          <ant-tag>点赞 23</ant-tag>
          <ant-tag>评论 23</ant-tag>
          <ant-button type="primary" class="pull-request-button">提交认证</ant-button>
        </div>
      </div>
      <div class="knowledge-content">
        <knowledge-bind-panel class="panel"></knowledge-bind-panel>
        <div class="knowledge-editor">
          <section-article-tip-tap
            :editable="true"
            :entity-id="knowledgeEntityId"
            :article-content="knowledgeDescription"
            @saveSectionArticle="handleSaveSectionArticle"
            @mention="handleMention"></section-article-tip-tap>
        </div>
        <div class="knowledge-form">
          <ant-tabs v-model:activeKey="activeKey" class="custom-ant-tab">
            <ant-tab-pane key="1">
              <template #tab>
                <span>
                  知识点
                </span>
              </template>
              <KnowledgeEditForm :knowledge="knowledgeForm"></KnowledgeEditForm>
            </ant-tab-pane>
            <ant-tab-pane key="2">
              <template #tab>
                <span>
                  评论
                </span>
              </template>
              <h3>评论</h3>
              <Comment :entityType="'Knowledge'" :entityId="knowledgeEntityId"></Comment>
            </ant-tab-pane>
            <ant-tab-pane key="3">
              <template #tab>
                <span>
                  知识关联
                </span>
              </template>
            </ant-tab-pane>
          </ant-tabs>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import GoBackIcon from "@/components/icons/go-back-icon.vue";
import { useStore } from "@/store";
import KnowledgeBindPanel from "@/views/knowledge-edit/knowledge-bind-panel.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import {
  computed, createVNode,
  defineComponent, onMounted, ref
} from 'vue';
import { useRoute } from 'vue-router';
import KnowledgeEditForm from '@/views/knowledge-edit/knowledge.edit.form.vue';
import { KnowledgeModelType } from "edu-graph-constant";
import SectionArticleTipTap from './repository-editor/section-article.vue';
import Comment from './repository-editor/comment.vue';
import { KnowledgeEdit, knowledge, knowledgeDescription } from './knowledge-edit/knowledge.edit';

export default defineComponent({
  name: 'knowledge.edit',
  components: {
    GoBackIcon,
    KnowledgeBindPanel,
    KnowledgeEditForm,
    SectionArticleTipTap,
    Comment
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    const knowledgeEntityId = ref(route.query.knowledgeEntityId as string);
    const repositoryEntityId = ref(route.query.repositoryEntityId as string);
    const activeKey = ref('1');
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeForm = computed(() => ({
      repositoryEntityId: repositoryEntityId.value,
      name: (<KnowledgeModelType> knowledge.target?.content).name,
      knowledgeBaseTypeId: (<KnowledgeModelType> knowledge.target?.content).knowledgeBaseTypeId,
      domainId: (<KnowledgeModelType> knowledge.target?.content).domainId,
    }));
    onMounted(async () => {
      await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
    });
    const handleMention = (params: {
      name: string, id: string, success: Function, fail: Function,
      content: Record<string, any>,
      contentHtml: any
    }) => {
      Modal.confirm({
        title: '是否设置知识点为前置知识点?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        async onOk() {
          params.success()
          await knowledgeEdit.createEdge({
            id: params.id,
            repositoryEntityId: repositoryEntityId.value,
            knowledgeEntityId: knowledgeEntityId.value,
            name: knowledgeForm.value.name
          })
          await knowledgeEdit.handleSaveSectionArticle({
            content: params.content,
            contentHtml: params.contentHtml,
            knowledgeEntityId: knowledgeEntityId.value
          })
        },
        async onCancel() {
          params.fail();
          await knowledgeEdit.handleSaveSectionArticle({
            content: params.content,
            contentHtml: params.contentHtml,
            knowledgeEntityId: knowledgeEntityId.value
          })
        },
      });
    }
    return {
      knowledgeForm,
      knowledge,
      handleSaveSectionArticle: knowledgeEdit.handleSaveSectionArticle,
      knowledgeDescription,
      handleMention,
      knowledgeEntityId,
      repositoryEntityId,
      spinning,
      activeKey
    }
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.knowledge-edit {
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .knowledge-header {
    background: #fafbfc;
    height: 56px;
    border-bottom: 1px solid $borderColor;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px;
      height: 56px;
      gap: 15px;

      .back-icon {
        cursor: pointer;
        font-size: 18px;
      }

      .title {
        height: 32px;
        line-height: 32px;
        font-size: 18px;
      }

      .status-tag {
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
      }
    }

    .right {
      padding-right: 30px;
      height: 56px;
      display: flex;
      align-items: center;

      .pull-request-button {
        margin-left: 20px;
      }
    }
  }

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;

    .panel {
      width: 220px;
    }

    .knowledge-editor {
      flex: 1;
    }

    .knowledge-form {
      width: 300px;
    }
  }
}

</style>
