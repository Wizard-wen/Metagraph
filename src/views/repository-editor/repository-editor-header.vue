<template>
  <div class="repository-editor-header">
    <div class="left">
      <div class="operation-icon" @click="goHomePage">
        <LeftOutlined/>
      </div>
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        :placement="'bottomLeft'"
        :overlayClassName="'dropdown-overlay'">
        <div class="operation-icon">
          <MenuOutlined/>
        </div>
        <template #overlay>
          <ant-menu>
            <ant-sub-menu key="test" title="知识库">
              <ant-menu-item
                v-if="isCloneButtonShow"
                @click="handleOpenCloneModal">克隆知识库
              </ant-menu-item>
              <ant-menu-item @click="goRepositoryEditPage">编辑知识库</ant-menu-item>
            </ant-sub-menu>
            <ant-sub-menu key="alternative" title="素材">
              <ant-menu-item>上传文本</ant-menu-item>
            </ant-sub-menu>

            <ant-menu-item>创建文档</ant-menu-item>
            <ant-menu-item>创建/绑定知识点</ant-menu-item>
            <div class="divider-style"></div>
            <ant-menu-item>回到首页</ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="title">
        <div class="name">{{ repositoryModel.target.content.name }}</div>
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
        style="height: 28px; padding: 0 12px; font-size: 12px;"
        :loading="isCloning"
      >克隆
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

<script lang="ts" setup>
import { ExclamationCircleOutlined, LeftOutlined, MenuOutlined } from '@ant-design/icons-vue';
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Menu as AntMenu,
  message,
  Modal,
  Spin as AntSpin,
  Tag as AntTag,
  Divider as AntDivider
} from 'ant-design-vue';
import { computed, createVNode, defineEmits, defineProps, inject, PropType, ref } from 'vue';
import type { RepositoryModelType } from 'metagraph-constant';
import { useRoute, useRouter } from 'vue-router';
import CloneRepositoryModal
  from '@/views/repository-editor/repository-editor-header/clone-repository-modal.vue';
import { useStore } from '@/store';
import RepositoryViewChange
  from '@/views/repository-editor/repository-editor-header/repository-view-change.vue';
import { CommentControlButton, StarControlButton } from '@/business';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { RepositoryEditor, repositoryModel } from './model/repository.editor';

const AntMenuItem = AntMenu.Item;
const AntSubMenu = AntMenu.SubMenu;
defineProps({
  viewStatus: {
    type: String as PropType<'section' | 'graph'>,
    required: true
  },
  savingStatus: {
    type: String as PropType<'saving' | 'saved'>,
  }
});
const emit = defineEmits(['viewChange']);

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

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const isAllowedClone = computed(() => (repositoryModel.target?.content as RepositoryModelType).isAllowedClone);
const isCloneRepository = computed(() => (repositoryModel.target?.content as RepositoryModelType).cloneFromRepositoryEntityId);
// 只有在登录且非克隆知识库，才能有克隆功能
const isCloneButtonShow = computed(() => isAllowedClone.value && isLogin.value);
const currentRepositoryName = computed(() => (repositoryModel.target?.content as RepositoryModelType).name);
// export default defineComponent({
//   name: 'repository-editor-header',
//   props: ,
//   components: {
//     CloneRepositoryModal,
//     RepositoryViewChange,
//     StarControlButton,
//     CommentControlButton,
//     EditIcon,
//     AntTag: Tag,
//     AntButton: Button,
//     AntSpin: Spin,
//   },
//   emits: ['viewChange'],
//   setup(props, { emit }) {
//
//     return {
//       repositoryEntityId,
//       isPublicRepository,
//       currentUserModel,
//       repositoryModel,
//       goHomePage,
//       goRepositoryEditPage,
//       handleRepositoryViewChange,
//       handleUpdateComment,
//       handleStarStatusUpdate,
//       cloneRepository,
//       isCloneButtonShow,
//       isCloneRepository,
//       isCloning,
//       isCloneModalShow,
//       handleOpenCloneModal,
//       handleCloseCloneModal,
//       currentRepositoryName
//     };
//   }
// });
</script>

<style scoped lang="scss">
@import "../../style/common";

.divider-style {
  height: 1px;
  background: $borderColor;
  width: 100%;
  margin: 12px 0;
}
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
    gap: 10px;

    .operation-icon {
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }

    .title {
      margin-right: 16px;
      display: flex;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      align-items: center;

      .repository-title {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .title-icon {
        margin-left: 4px;
      }

      .name {
        font-weight: 600;
      }

      .edit-icon {
        margin-left: 5px;
        font-size: 18px;

        &:hover {
          cursor: pointer;
          color: #0969DC;
        }
      }

      .repository-type-tag {
        height: 24px;
        border-radius: 4px;
        margin-left: 6px;
      }

      .saving-status {
        font-size: 12px;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 20px;

    .view-switch {
      line-height: 32px;
    }
  }
}
</style>
