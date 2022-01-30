<template>
  <div class="repository-editor-header">
    <div class="left">
      <div class="logo" @click="goHomePage">
        <img src="/hogwarts-logo.webp" height="32" width="32" alt="">
      </div>
      <div class="title">
        <div class="name">{{ repositoryModel.target.author.name }}</div>
        &nbsp;/&nbsp;
        <div class="name">{{ repositoryModel.target.content.name }}</div>
        <edit-icon
          v-if="repositoryModel.target.author.id === currentUserModel?.id"
          class="edit-icon"
          @click="goRepositoryEditPage"></edit-icon>
        <ant-tag class="repository-type-tag">
          {{ isPublicRepository ? '公开' : '私有' }}
        </ant-tag>
        <div class="saving-status">
          <ant-spin :spinning="savingStatus === 'saving...'"></ant-spin>
          <span>{{ savingStatus }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <star-control-button
        @update="handleStarStatusUpdate"
        :is-owner="!!repositoryModel.target.author.id"
        :has-star="repositoryModel.target.hasStared"
        :count="repositoryModel.target.star"
        :entity-id="repositoryModel.target.entity.id"
        :entity-type="repositoryModel.target.entity.entityType"></star-control-button>
      <comment-control-button
        @update="handleUpdateComment"
        :count="repositoryModel.target.comment"
        :entity-id="repositoryModel.target.entity.id"
        :entity-type="repositoryModel.target.entity.entityType"></comment-control-button>
      <div class="view-switch">
        <repository-view-change
          :view-status="viewStatus"
          @viewChange="handleRepositoryViewChange"></repository-view-change>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, PropType, ref, toRef
} from 'vue';
import type { EntityCompletelyListItemType, RepositoryModelType } from 'metagraph-constant';
import { useRouter } from 'vue-router';
import { knowledge, KnowledgeEdit } from '@/views/knowledge-edit/model/knowledge.edit';
import { useStore } from '@/store';
import RepositoryViewChange from '@/views/repository-editor/repository-editor-header/repository-view-change.vue';
import { StarControlButton, CommentControlButton } from '@/business';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { EditIcon } from '@/components/icons';
import { repositoryModel, RepositoryEditor } from '../repository-editor';

export default defineComponent({
  name: 'repository-editor-header',
  props: {
    viewStatus: {
      type: String as PropType<'section' | 'graph'>,
      required: true
    },
    savingStatus: {
      type: String as PropType<'saving' | 'saved'>,
    }
  },
  components: {
    RepositoryViewChange,
    StarControlButton,
    CommentControlButton,
    EditIcon
  },
  emits: ['viewChange'],
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();
    const repositoryEditor = new RepositoryEditor();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const currentUserModel = computed(() => store.state.user?.user);
    const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));
    const goHomePage = async () => {
      await router.push('/');
    };

    async function handleStarStatusUpdate() {
      if (repositoryEntityId.value) {
        await repositoryEditor.getRepositoryByEntityId(repositoryEntityId.value);
      }
    }

    const goRepositoryEditPage = async () => {
      await router.push({
        path: '/repository/edit',
        query: {
          repositoryEntityId: repositoryEntityId.value
        }
      });
    };
    const handleUpdateComment = async () => {
      await repositoryEditor.getRepositoryByEntityId(repositoryEntityId.value);
    };
    const handleRepositoryViewChange = (status: 'section' | 'graph') => {
      emit('viewChange', status);
    };
    return {
      repositoryEntityId,
      isPublicRepository,
      currentUserModel,
      repositoryModel,
      goHomePage,
      goRepositoryEditPage,
      handleRepositoryViewChange,
      handleUpdateComment,
      handleStarStatusUpdate
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.repository-editor-header {
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

      .edit-icon {
        font-size: 20px;

        &:hover {
          cursor: pointer;
          color: #0969DC;
        }
      }

      .repository-type-tag {
        height: 24px;
        border-radius: 4px;
        margin-left: 10px;
      }

      .saving-status {
        font-size: 12px;
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
</style>
