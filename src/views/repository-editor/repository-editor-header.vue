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
        <ant-tag class="repository-type-tag">
          {{ isCloneRepository ? '克隆' : '原创' }}
        </ant-tag>
        <div class="saving-status">
          <ant-spin :spinning="savingStatus === 'saving...'"></ant-spin>
          <span>{{ savingStatus }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <ant-button
        type="primary"
        v-if="isCloneButtonShow"
        :loading="isCloning"
        @click="handleOpenCloneModal">克隆
      </ant-button>
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
  <clone-repository-modal
    :old-repository-name="currentRepositoryName"
    @close="handleCloseCloneModal"
    :is-modal-visible="isCloneModalShow"></clone-repository-modal>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button, message, Modal, Spin, Tag
} from 'ant-design-vue';
import {
  computed, createVNode,
  defineComponent, inject, PropType, ref
} from 'vue';
import type { RepositoryModelType } from 'metagraph-constant';
import { useRoute, useRouter } from 'vue-router';
import CloneRepositoryModal from '@/views/repository-editor/repository-editor-header/clone-repository-modal.vue';
import { useStore } from '@/store';
import RepositoryViewChange from '@/views/repository-editor/repository-editor-header/repository-view-change.vue';
import { StarControlButton, CommentControlButton } from '@/business';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { EditIcon } from '@/components/icons';
import { repositoryModel, RepositoryEditor } from './model/repository-editor';

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
    CloneRepositoryModal,
    RepositoryViewChange,
    StarControlButton,
    CommentControlButton,
    EditIcon,
    AntTag: Tag,
    AntButton: Button,
    AntSpin: Spin,
  },
  emits: ['viewChange'],
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const repositoryEditor = new RepositoryEditor();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const needRefresh = ref(route.query.refresh);
    const isCloning = ref(false);
    const isCloneModalShow = ref(false);
    const currentUserModel = computed(() => store.state.user?.user);
    const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));
    const goHomePage = async () => {
      router.push('/').then();
    };
    const isLogin = computed(() => store.state.user.isLogin);

    async function handleStarStatusUpdate() {
      if (repositoryEntityId.value) {
        await repositoryEditor.getRepositoryByEntityId(repositoryEntityId.value);
      }
    }

    const goRepositoryEditPage = async () => {
      router.push({
        path: '/repository/edit',
        query: {
          repositoryEntityId: repositoryEntityId.value
        }
      }).then();
    };
    const handleUpdateComment = async () => {
      await repositoryEditor.getRepositoryByEntityId(repositoryEntityId.value);
    };
    const handleRepositoryViewChange = (status: 'section' | 'graph') => {
      emit('viewChange', status);
    };

    async function cloneRepository(name?: string) {
      isCloning.value = true;
      const clonedRepositoryEntityId = await repositoryEditor.cloneRepository(
        repositoryEntityId.value,
        name
      );
      isCloning.value = false;
      if (!clonedRepositoryEntityId) {
        return;
      }
      Modal.confirm({
        title: '跳转指引',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要跳转至新知识库吗?',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          await router.replace({
            name: 'RepositoryEditor',
            query: {
              repositoryEntityId: clonedRepositoryEntityId,
              type: 'edit',
              refresh: 'need'
            },
            force: true
          });
        },
        onCancel() {
          message.info('取消删除！');
        },
      });
    }

    async function handleCloseCloneModal(params?: {
      name: string
    }) {
      isCloneModalShow.value = false;
      if (params) {
        await cloneRepository(params?.name);
      }
    }

    function handleOpenCloneModal() {
      isCloneModalShow.value = true;
    }

    const isAllowedClone = computed(() => (repositoryModel.target?.content as RepositoryModelType).isAllowedClone);
    const isCloneRepository = computed(() => (repositoryModel.target?.content as RepositoryModelType).cloneFromRepositoryEntityId);
    // 只有在登录且非克隆知识库，才能有克隆功能
    const isCloneButtonShow = computed(() => isAllowedClone.value && isLogin.value);
    const currentRepositoryName = computed(() => (repositoryModel.target?.content as RepositoryModelType).name);
    return {
      repositoryEntityId,
      isPublicRepository,
      currentUserModel,
      repositoryModel,
      goHomePage,
      goRepositoryEditPage,
      handleRepositoryViewChange,
      handleUpdateComment,
      handleStarStatusUpdate,
      cloneRepository,
      isCloneButtonShow,
      isCloneRepository,
      isCloning,
      isCloneModalShow,
      handleOpenCloneModal,
      handleCloseCloneModal,
      currentRepositoryName
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common";

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
