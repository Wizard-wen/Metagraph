<template>
  <div class="knowledge-editor-container">
    <div class="knowledge-editor">
      <div class="knowledge-editor-control">
        <knowledge-article-control-toolbar
          v-if="editor" :editor="editor"
          @fontSizeChange="changeArticleFontSize($event)"
          @save="saveKnowledgeArticle"></knowledge-article-control-toolbar>
      </div>
      <div class="knowledge-editor-content">
        <knowledge-description
          v-if="editor"
          :editor="editor"
          :article-font-size="articleFontSize"
          :description-characters="descriptionCharacters"
        ></knowledge-description>
        <knowledge-custom-fields></knowledge-custom-fields>
        <knowledge-pictures></knowledge-pictures>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { computed, defineProps, inject, PropType, ref } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { IndexdbService } from '@/service/indexdb.service';
import { message } from 'ant-design-vue';
import {
  draftKnowledgeEntityIdInjectKey,
  KnowledgeEdit
} from '@/views/knowledge-editor/model/knowledge.edit';
import {
  KnowledgeArticleControlToolbar,
  KnowledgeCustomFields,
  KnowledgeDescription,
  KnowledgePictures
} from './knowledge-editor-middle/index';

const knowledgeEdit = new KnowledgeEdit();

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>
  },
});
const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
const articleFontSize = ref('14');
// 知识点描述字数统计
const descriptionCharacters = computed(
  () => props.editor?.storage.characterCount.characters()
);

function changeArticleFontSize(event: { value: string }) {
  articleFontSize.value = event.value;
}

async function saveKnowledgeArticle() {
  if (props.editor) {
    const result = await knowledgeEdit.handleSaveSectionArticle({
      content: props.editor?.getJSON(),
      contentHtml: props.editor?.getHTML(),
      knowledgeEntityId: draftKnowledgeEntityId.value
    });
    await IndexdbService.getInstance()
      .update(
        'knowledge',
        draftKnowledgeEntityId.value,
        {
          description: props.editor?.getHTML()
        }
      );
    if (result) {
      message.success('保存成功！');
    }
  }
}

</script>

<style scoped lang="scss">
@import "../../style/common.scss";
.knowledge-editor-container {
  height: 100%;
  background: $editorBackgroundColor;
  flex: 1;
  position: relative;
}
.knowledge-editor {
  height: 100%;
  overflow-y: auto;
  @include custom-scroll-style;

  .knowledge-editor-control {
    top: 0;
    z-index: 100;
    position: absolute;
    width: 100%;
  }

  .knowledge-editor-content {
    margin: 70px 0;
  }
}
</style>
