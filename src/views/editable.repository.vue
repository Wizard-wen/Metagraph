<template>
  <ant-spin :spinning="spinning">
    <div class="repo-header" v-if="repository.repositoryModel">
      <div class="title-box">
        <div class="title">
          <ant-avatar style="margin-right: 10px"></ant-avatar>
          <div class="name">{{ repository.repositoryModel.author.name }}</div>
          /
          <div class="name">{{ repository.repositoryModel.content.name }}</div>
        </div>
        <div class="view-switch">
          <ant-switch
            @click="handleSwitchClick"
            @change="handleSwitchChange"
            checked-children="Graph"
            un-checked-children="Section"
            v-model:checked="viewStatus"/>
        </div>
      </div>
    </div>
    <div class="editable">
      <div class="section-view" v-if="!viewStatus">
        <section-tree></section-tree>
        <div class="text-content">
          <section-article-tip-tap
            v-if="repositoryEntityId && sectionEntityId"
            :entityId="repositoryEntityId"
            :editable="isEditable"
            :article-content="sectionArticle"
            @mention="handleMention($event)"
            @saveSectionArticle="saveSectionArticle($event)">
            <template #comment="{entityId}">
              <Comment :entityId="entityId" :entity-type="'Repository'"></Comment>
            </template>
          </section-article-tip-tap>
          <ant-empty v-else :image="simpleImage"/>
        </div>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
      <div v-else class="section-view">
        <knowledge-graph class="graph-content"></knowledge-graph>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import { RepositoryApiService, SectionApiService } from '@/api.service';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import { EntityCompletelyListItemType, RepositoryModelType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, reactive, ref, computed, createVNode
} from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { Modal, Empty } from 'ant-design-vue';
import Toolbar from './repository/editable.repository/toobar.vue';
import SectionTree from './repository/editable.repository/section.tree.vue';
import SectionArticleTipTap from './repository/editable.repository/section.article.tiptap.vue';
import KnowledgeGraph from './repository/editable.repository/knowledge.graph.vue';
import Comment from './repository/editable.repository/comment.vue';

export default defineComponent({
  name: 'editable.repository',
  components: {
    Toolbar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraph,
    Comment
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = computed(() => store.state.isSpinning);
    const repositoryEntityId = ref('');
    const repository = reactive<{
      repositoryModel?: EntityCompletelyListItemType
    }>({
      repositoryModel: undefined
    });
    const isEditable = ref(false);
    const viewStatus = ref(true);
    const sectionEntityId = computed(() => {
      if (store.state.repositoryEdit.selectedTreeNodeSectionKeys) {
        return store.state.repositoryEdit.selectedTreeNodeSectionKeys[0];
      }
      return undefined;
    });
    const getRepositoryByEntityId = async () => {
      const response = await RepositoryApiService.getRepositoryById({
        repositoryEntityId: route.query.repositoryEntityId as string
      });
      if (response.data) {
        repository.repositoryModel = response.data;
        let status = false;
        if (localStorage.getItem('user')) {
          const user = localStorage.getItem('user')!;
          const content = response.data.content as RepositoryModelType;
          status = content.userId === JSON.parse(user).id;
          isEditable.value = status;
        }
        store.commit(MutationEnum.SET_REPOSITORY_EDITABLE, {
          status
        });
      }
    };
    const sectionArticle = computed(() => store.state.repositoryEdit.sectionArticleContent);
    onMounted(async () => {
      repositoryEntityId.value = route.query.repositoryEntityId as string;
      await getRepositoryByEntityId();
    });
    const saveSectionArticle = async (params: {
      content: Record<string, any>,
      contentHtml: string
    }) => {
      await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
        content: params.content,
        contentHtml: params.contentHtml
      });
    };
    const handleMention = (params: {
      name: string, id: string, success: () => void, fail: () => void,
      content: Record<string, any>,
      contentHtml: string
    }) => {
      Modal.confirm({
        title: '是否绑定知识点至当前单元?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        async onOk() {
          params.success();
          if (sectionEntityId.value) {
            await SectionApiService.bindSectionEntity({
              entityId: params.id,
              entityType: 'Knowledge',
              repositoryEntityId: route.query.repositoryEntityId as string,
              sectionId: sectionEntityId.value
            });
            await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
              content: params.content,
              contentHtml: params.contentHtml
            });
          }
        },
        async onCancel() {
          params.fail();
          await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
            content: params.content,
            contentHtml: params.contentHtml
          });
        },
      });
    };
    const handleSwitchClick = () => {
      console.log('click');
    };
    const handleSwitchChange = () => {
      console.log('change');
    };
    return {
      repository,
      viewStatus,
      sectionArticle,
      saveSectionArticle,
      isEditable,
      sectionEntityId,
      repositoryEntityId,
      handleMention,
      spinning,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      handleSwitchClick,
      handleSwitchChange
    };
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repo-header {
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

    .view-switch {
      line-height: 32px;
    }
  }
}

.editable {
  height: calc(100vh - 56px);

  .section-view {
    height: 100%;
    //overflow: scroll;
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

}

</style>
