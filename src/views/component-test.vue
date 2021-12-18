<template>
  <!--  <repository-list-item></repository-list-item>-->
  <div style="width: 500px;">
    <!--    <search-input></search-input>-->
  </div>
  <!--  <div v-clickoutside="'jjjjjj'" class="ele">-->

  <!--  </div>-->
  <div style="width: 300px;">
    <!--    <animation-input></animation-input>-->
  </div>
  <!--  <vue-cropper-test :is-modal-visible="true"></vue-cropper-test>-->
  <!--    <graph-g6></graph-g6>-->
  <!--  <knowledge-map></knowledge-map>-->
  <!--  <social-action-button :title="'Star'" :total="28">-->
  <!--    <template #icon>-->
  <!--      <star-icon ></star-icon>-->
  <!--    </template>-->
  <!--  </social-action-button>-->
  <!--  <upload-form-item v-model="imageUrl"></upload-form-item>-->
  <!--  <tiptap-readonly></tiptap-readonly>-->
  <test-tiptap></test-tiptap>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TestTiptap from '@/test.components/tiptap-demo/custom-tiptap-node/test-tiptap.vue';
import KnowledgeMap from '@/views/knowledge-map.vue';
import TiptapReadonly from '@/views/repository-editor/section.article/tiptap-readonly.vue';
import RepositoryListItem from '@/github.style.component/repository.list.item/repository-list-item.vue';
import SearchInput from '@/github.style.component/search-input/git-style-input-search.vue';
import { clickOutside } from '@/directives/click.outside';
import AnimationInput from '@/github.style.component/search-input/input-animation.vue';
import vueCropperTest from '@/components/upload/upload-cropper-modal.vue';
import GraphG6 from '@/views/test/grapg.g6.test.vue';
import { StarIcon } from '@/components/icons';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import UploadFormItem from '@/components/upload/upload-form-item.vue';

export default defineComponent({
  name: 'component.test',
  components: {
    TestTiptap,
    KnowledgeMap,
    TiptapReadonly,
    // RepositoryListItem,
    SearchInput,
    AnimationInput,
    vueCropperTest,
    GraphG6,
    UploadFormItem,
    StarIcon,
    SocialActionButton
  },
  directives: {
    clickoutside: clickOutside
  },
  setup() {
    const imageUrl = ref('');
    return {
      imageUrl
    };
  }
});
</script>

<style scoped lang="scss">
.ele {
  height: 120px;
  width: 120px;
  background: red;
}
</style>
