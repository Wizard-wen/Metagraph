<template>
  <ant-spin :spinning="spinning" class="repository-page">
    <div class="repo-header" v-if="repository.target">
      <div class="left">
        <div class="logo" @click="goHomePage">
          <img src="/hogwarts-logo.webp" height="32" width="32" alt="">
        </div>
        <div class="title">
          <div class="name">{{ repository.target.author.name }}</div>
          &nbsp;/&nbsp;
          <div class="name">{{ repository.target.content.name }}</div>
          <ant-tag class="repository-tag">
            {{ isPublicRepository ? 'public' : 'private' }}
          </ant-tag>
        </div>
      </div>
      <div class="right">
        <social-action-button
          :title="repository.target.hasStared ? 'UnStar' : 'Star'"
          :total="repository.target.star">
          <template #icon>
            <star-icon></star-icon>
          </template>
        </social-action-button>
        <social-action-button
          @total="isCommentDrawerShow = true"
          :title="'Comment'"
          :total="repository.target.comment">
          <template #icon>
            <comment-icon></comment-icon>
          </template>
        </social-action-button>
        <div class="view-switch">
          <ant-switch
            @click="handleSwitchClick"
            @change="handleSwitchChange"
            checked-children="Graph"
            un-checked-children="Section"
            v-model:checked="viewStatus"/>
        </div>
      </div>
      <comment-drawer
        :is-show="isCommentDrawerShow"
        :entityId="repository.target.entity.id"
        @showChange="isCommentDrawerShow=false"
      ></comment-drawer>
    </div>
    <div class="editable">
      <div class="section-view" v-if="!viewStatus">
        <section-tree></section-tree>
        <div class="text-content">
          <section-article-tip-tap
            v-if="repositoryEntityId && sectionEntityId"
            :entityId="repositoryEntityId"
            :editable="isEditable"
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
import {
  defineComponent, onMounted, ref, computed, onBeforeMount, onUnmounted, provide
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Empty } from 'ant-design-vue';
import {
  EditableRepositoryService,
  alternative,
  isEditable,
  repositoryModel,
  sectionEntityId,
  isPublicRepository
} from '@/views/editable.repository/editable.repository.service';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import Toolbar from './editable.repository/toolbar.vue';
import SectionTree from './editable.repository/section.tree.vue';
import SectionArticleTipTap from './editable.repository/section.article.vue';
import KnowledgeGraph from './editable.repository/knowledge.graph.vue';
import Comment from './editable.repository/comment.vue';
import { repositoryEntityIdKey } from './editable.repository/provide.type';
import { StarIcon, CommentIcon } from '@/components/icons';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import CommentDrawer from './editable.repository/comment-drawer.vue';

export default defineComponent({
  name: 'editable.repository',
  components: {
    Toolbar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraph,
    Comment,
    StarIcon,
    CommentIcon,
    SocialActionButton,
    CommentDrawer
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);
    provide(repositoryEntityIdKey, repositoryEntityId);
    const viewStatus = ref(false);
    const isCommentDrawerShow = ref(false);
    const editableRepositoryService = new EditableRepositoryService();
    const {
      getRepositoryByEntityId
    } = editableRepositoryService;
    const preventContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    onBeforeMount(async () => {
      store.commit(MutationEnum.SET_REPOSITORY_EDITABLE, {
        status: undefined
      });
      await getRepositoryByEntityId(repositoryEntityId.value);
      document.addEventListener('contextmenu', preventContextmenu);
    });
    onMounted(async () => {
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', preventContextmenu);
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
      name: string, id: string, success: () => string, fail: () => string,
      content: Record<string, any>,
      contentHtml: string
    }) => {
      editableRepositoryService.handleMention({
        ...params,
        repositoryEntityId: repositoryEntityId.value
      });
    };
    const handleSwitchClick = () => {
      console.log('click');
    };
    const handleSwitchChange = () => {
      console.log('change');
    };
    const goHomePage = async () => {
      await router.push('/');
    };
    return {
      alternative,
      repository: repositoryModel,
      viewStatus,
      saveSectionArticle,
      isEditable,
      sectionEntityId,
      repositoryEntityId,
      handleMention,
      goHomePage,
      spinning,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      handleSwitchClick,
      handleSwitchChange,
      isPublicRepository,
      isCommentDrawerShow
    };
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repository-page {
  height: 100vh;
  overflow-y: auto;
}

.repo-header {
  background: #fafbfc;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    gap: 15px;

    .logo {
      cursor: pointer;
    }

    .title {
      margin-right: 16px;
      display: flex;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      align-items: center;

      .name {
        font-weight: 400;
      }

      .repository-tag {
        height: 24px;
        border-radius: 4px;
        margin-left: 10px;
      }
    }
  }

  .right {
    display: flex;
    gap: 20px;

    .view-switch {
      line-height: 32px;
    }
  }
}

.editable {
  height: calc(100vh - 56px);

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

  .text-content {
    //height: calc(100vh - 56px);
    //overflow-y: auto;
  }

}

</style>
