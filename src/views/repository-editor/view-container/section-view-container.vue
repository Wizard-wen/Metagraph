<template>
  <div class="section-view">
    <section-tree></section-tree>
    <div class="text-content">
      <section-article-tip-tap
        v-if="repositoryEntityId"
        :entityId="repositoryEntityId"
        :editable="isEditable"
        @clickMention="handleClickMention($event)"
        @mention="handleMention($event)">
      </section-article-tip-tap>
    </div>
  </div>
</template>

<script lang="ts">
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { RepositoryEditor } from '@/views/repository-editor/model/repository-editor';
import { JSONContent } from '@tiptap/vue-3';
import { defineComponent, inject, ref } from 'vue';
import { KnowledgePreview } from '../../knowledge-preview/knowledge.preview';
import SectionTree from './repository-editor/section-tree.vue';
import SectionArticleTipTap from './repository-editor/section-article.vue';

export default defineComponent({
  name: 'section-view-container',
  components: {
    SectionTree,
    SectionArticleTipTap
  },
  setup() {
    const knowledgePreview = new KnowledgePreview();
    const repositoryEditorService = new RepositoryEditor();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const isEditable = inject(isEditableKey, ref(false));

    function handleClickMention(event: { id: string, name: string }) {
      knowledgePreview.handleShowKnowledgeDrawer(event.id, 'published');
    }

    const handleMention = (params: {
      name: string, id: string, success: () => string, fail: () => string,
      content: JSONContent,
      contentHtml: string
    }) => {
      repositoryEditorService.handleMention({
        ...params,
        repositoryEntityId: repositoryEntityId.value
      });
    };

    return {
      handleClickMention,
      handleMention,
      isEditable
    };
  }
});
</script>

<style scoped lang="scss">
.section-view {
  height: 100%;
  display: flex;

  .section-tree {
    width: 220px;
    height: 100%;
    border-right: solid 1px #eee;
    background-color: #fff;
  }

  .text-content {
    width: calc(100% - 520px);
    height: 100%;
  }

  .graph-content {
    width: calc(100% - 300px);
    height: calc(100vh - 56px);
  }

  .style-panel {
    width: 300px;
    height: 100%;
    background-color: #fff;
  }
}
</style>
