<template>
  <!--  <repository-list-item></repository-list-item>-->
  <div style="width: 500px;">
    <search-input></search-input>
  </div>
  <!--  <div v-clickoutside="'jjjjjj'" class="ele">-->
<!--  <button >step1</button>-->
  <!--  </div>-->
  <div style="width: 300px;">
    <animation-input></animation-input>
  </div>
  <github-button id="step1" :title="'按钮'"></github-button>
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
  <!--  <test-tiptap></test-tiptap>-->
  <!--  <login-in></login-in>-->
  <!--  <knowledge-plan></knowledge-plan>-->
  <!--  <knowledge-preview-card></knowledge-preview-card>-->
<!--  <two-lists></two-lists>-->
<!--  <VButton></VButton>-->
<!--  <v-description></v-description>-->
</template>

<script lang="ts">
import introJs, { Step } from 'intro.js';
import 'intro.js/introjs.css'
import { defineComponent, onMounted, ref } from 'vue';
import { GithubButton } from 'metagraph-ui';
import 'metagraph-ui/dist/style.css';
import TwoLists from '@/components/draggble/draggble-test.vue';
import LoginIn from '@/github.style.component/login.vue';
import KnowledgePlan from '@/test.components/plan/knowledge-plan.vue';
import KnowledgePreviewCard from '@/views/knowledge-edit/knowledge-preview-card.vue';
import TestTiptap from '@/test.components/tiptap-demo/custom-tiptap-node/test-tiptap.vue';
import KnowledgeMap from '@/views/knowledge-map.vue';
import TiptapReadonly from '@/views/repository-editor/section-article/tiptap-readonly.vue';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';
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
    TwoLists,
    // VButton,
    // VDescription,
    LoginIn,
    KnowledgePreviewCard,
    KnowledgePlan,
    TestTiptap,
    KnowledgeMap,
    TiptapReadonly,
    GithubButton,
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
    onMounted(() => {
      const stepsArr: Step[] = [{
        element: document.querySelector('#step1')!, // id为step1的元素
        intro: '可以批量导入商品至购物车',
        position: 'left'
      }];
      introJs()
        .setOptions({
          prevLabel: '&larr; 上一步',
          nextLabel: '下一步 &rarr;',
          doneLabel: '我知道了',
          skipLabel: '跳过',
          showProgress: false,
          // disableInteraction: true,
          steps: stepsArr
        })
        .start();
    });
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
