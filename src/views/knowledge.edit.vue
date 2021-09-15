<template>
  <ant-spin :spinning="spinning">
    <div class="knowledge-edit">
      <div class="knowledge-header">
        <div class="title-box">
          <div class="title">
            <div class="name"></div>
          </div>
        </div>
      </div>
      <div class="knowledge-content">
        <div class="knowledge-editor">
          <section-article-tip-tap
            :editable="true"
            :entity-id="knowledgeEntityId"
            :article-content="knowledgeDescription"
            @saveSectionArticle="handleSaveSectionArticle"
            @mention="handleMention"></section-article-tip-tap>
        </div>
        <div class="knowledge-form">
          <KnowledgeEditForm :knowledge="knowledgeForm"></KnowledgeEditForm>
          <h3>评论</h3>
          <Comment :entityType="'Knowledge'" :entityId="knowledgeEntityId"></Comment>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import {
  computed, createVNode,
  defineComponent, onMounted, reactive, ref, toRefs
} from 'vue';
import { useRoute } from 'vue-router';
import KnowledgeEditForm from '@/views/knowledge.edit/knowledge.edit.form.vue';
import { EntityCompletelyListItemType, KnowledgeModelType } from "edu-graph-constant";
import { EdgeApiService, EntityNoAuthApiService, KnowledgeApiService } from '../api.service';
import SectionArticleTipTap from './editable.repository/section.article.vue';
import { tiptapInitData } from '@/store/constant/tiptap.init.data';
import Comment from './editable.repository/comment.vue';

export default defineComponent({
  name: 'knowledge.edit',
  components: {
    KnowledgeEditForm,
    SectionArticleTipTap,
    Comment
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    const { knowledgeEntityId, repositoryEntityId } = toRefs(route.query);
    const knowledge: {
      list?: any
    } = reactive<{ list?: any }>({ list: undefined });
    const knowledgeForm = computed(() => ({
      repositoryEntityId: repositoryEntityId.value,
      name: (<KnowledgeModelType> knowledge.list?.content).name,
      knowledgeBaseType: (<KnowledgeModelType> knowledge.list?.content).knowledgeBaseTypeId,
      domainId: (<KnowledgeModelType> knowledge.list?.content).domainId,
    }));
    const knowledgeDescription = ref(tiptapInitData);
    onMounted(async () => {
      const result = await EntityNoAuthApiService.getEntityById({
        entityId: <string> knowledgeEntityId.value
      });
      if (result.data) {
        knowledge.list = result.data;
        let description = (<KnowledgeModelType> result.data.content)?.description;
        if (!description) {
          knowledgeDescription.value = tiptapInitData;
        } else {
          knowledgeDescription.value = JSON.parse(description);
        }
      }});
    const handleSaveSectionArticle = async (params: {
      content: Record<string, any>,
      contentHtml: any
    }) => {
      await KnowledgeApiService.saveDescription({
        description: JSON.stringify(params.content),
        descriptionHTML: params.contentHtml,
        entityId: <string> knowledgeEntityId.value
      })
    }
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
          await EdgeApiService.create({
            originKnowledgeEntityId: params.id,
            knowledgeEntityId: knowledgeEntityId.value as string,
            targetKnowledgeEntityId: knowledgeEntityId.value as string,
            edgeRepositoryEntityId: repositoryEntityId.value as string,
            description: `From ${ knowledgeForm.value.name }`
          });
          await handleSaveSectionArticle({
            content: params.content,
            contentHtml: params.contentHtml
          })
        },
        async onCancel() {
          params.fail();
          await handleSaveSectionArticle({
            content: params.content,
            contentHtml: params.contentHtml
          })
        },
      });
    }
    return {
      knowledgeForm,
      knowledge,
      handleSaveSectionArticle,
      knowledgeDescription,
      handleMention,
      knowledgeEntityId,
      repositoryEntityId,
      spinning
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
    padding: 12px 0;
    background: #fafbfc;
    height: 56px;
    border-bottom: 1px solid $borderColor;

    .title-box {
      display: flex;
      justify-content: space-between;
      padding: 0 32px;
      height: 32px;

      .title {
        margin-right: 16px;
        display: flex;
        height: 32px;
        line-height: 32px;
        font-size: 18px;

        .name {
          font-weight: 400;
        }
      }
    }
  }

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;

    .knowledge-editor {
      flex: 1;
    }

    .knowledge-form {
      width: 400px;
      padding: 30px;
    }
  }
}

</style>
