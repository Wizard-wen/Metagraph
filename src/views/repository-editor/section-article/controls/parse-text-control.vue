<template>
  <div class="operation-icon" @click="handleParseWord">
    <div class="icon">
      <UploadIcon class="icon-svg"/>
    </div>
    <div class="name">
      解析
    </div>
  </div>
  <parse-word-modal
    v-if="isParseWordModalShow"
    :is-upload-modal-shown="isParseWordModalShow"
    @close="handleCloseParseWordModal"></parse-word-modal>
</template>

<script lang="ts">
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { SectionArticleControl } from '@/views/repository-editor/section-article/section.article.control';
import { SectionTreeService } from '@/views/repository-editor/section-tree/section.tree';
import { SectionModelType } from 'metagraph-constant';
import { ref, defineComponent, inject } from 'vue';
import { UploadIcon } from '@/components/icons';
import ParseWordModal from '@/views/repository-editor/section-article/parse-word-modal.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'parse-text-control',
  components: {
    UploadIcon,
    ParseWordModal
  },
  setup() {
    const router = useRouter();
    const isParseWordModalShow = ref(false);
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const handleParseWord = () => {
      isParseWordModalShow.value = true;
    };
    const sectionTreeService = new SectionTreeService();
    const sectionArticleControl = new SectionArticleControl();

    async function handleCloseParseWordModal(params: {
      type: 'Section' | 'void' | 'Alternative'
      sectionModel?: SectionModelType
    }) {
      console.log(params, '----parse text close');
      isParseWordModalShow.value = false;
      sectionArticleControl.clearData();
      if (params.type === 'Section' && params.sectionModel) {
        router.replace({
          name: 'RepositoryEditor',
          query: {
            repositoryEntityId: repositoryEntityId.value,
            type: 'edit',
            sectionType: 'section',
            sectionId: params.sectionModel.id
          },
          force: true
        })
          .then();
      }
    }

    return {
      isParseWordModalShow,
      handleParseWord,
      handleCloseParseWordModal
    };
  }
});

</script>

<style scoped lang="scss">
@import "../../../../style/tiptap.common";
</style>
