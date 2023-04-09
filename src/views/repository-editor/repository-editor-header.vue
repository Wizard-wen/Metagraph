<template>
  <div class="repository-editor-header">
    <div class="left-side">
      <m-button :is-icon="true" :has-border="false" @click="goHomePage">
        <template #icon>
          <LeftOutlined/>
        </template>
      </m-button>
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        :placement="'bottomLeft'">
        <m-button :is-icon="true" :has-border="false">
          <template #icon>
            <MenuOutlined/>
          </template>
        </m-button>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item
              class="menu-item-style"
              v-if="isCloneButtonShow"
              @click="handleOpenCloneModal">
              <CopyOutlined class="icon-size"/>
              克隆知识库
            </ant-menu-item>
            <ant-menu-item
              class="menu-item-style"
              @click="goRepositoryEditPage">
              <FormOutlined class="icon-size"/>
              编辑知识库
            </ant-menu-item>
            <ant-menu-item
              class="menu-item-style">
              <delete-outlined class="icon-size"/>
              删除知识库
            </ant-menu-item>
            <div class="divider-style"></div>
            <ant-menu-item class="menu-item-style">
              <UploadOutlined class="icon-size"/>
              上传文本
            </ant-menu-item>
            <div class="divider-style"></div>
            <ant-menu-item class="menu-item-style">
              <FileTextOutlined class="icon-size"/>
              创建文档
            </ant-menu-item>
            <ant-menu-item class="menu-item-style">
              <ReadOutlined class="icon-size"/>
              创建/引用词条
            </ant-menu-item>
            <div class="divider-style"></div>
            <ant-menu-item class="menu-item-style">
              <SwapOutlined class="icon-size"/>
              切换视图
            </ant-menu-item>
            <div class="divider-style"></div>
            <ant-menu-item class="menu-item-style">
              <ArrowLeftOutlined class="icon-size"/>
              回到首页
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="title">
        <template v-if="repositoryModel.target">
          <div class="repository-name">{{ repositoryModel.target.content.name }}</div>
          <m-tag
            :title="isCloneRepository ? '克隆' : '原创'"
            class="repository-type-tag">
          </m-tag>
          <m-button class="repository-type-tag" :is-icon="true" :has-border="false">
            <template #icon>
              <UnlockOutlined :title="'公开'" v-if="isPublicRepository"/>
              <LockOutlined :title="'私有'" v-else/>
            </template>
          </m-button>
          <div class="saving-status">
            <LoadingOutlined v-if="savingStatus === 'saving...'" class="saving-icon-style"/>
            <CloudSyncOutlined v-else class="saved-icon-style"/>
          </div>
        </template>
        <ant-skeleton style="max-width: 300px" v-else :paragraph="false"></ant-skeleton>
      </div>

    </div>
    <div class="middle-side">
<!--      <switch-mode-->
<!--        :view-status="viewStatus"-->
<!--        @viewChange="handleRepositoryViewChange"></switch-mode>-->
      <m-checkbox
        style="width: 200px; height: 36px"
        :type="'checkbox'"
        :modelValue="viewStatus"
        @update:modelValue="handleRepositoryViewChange"
        :option-list="optionList"></m-checkbox>
    </div>
    <div class="right-side">
      <template v-if="repositoryModel.target">
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
      </template>
      <ant-skeleton v-else :paragraph="false"></ant-skeleton>
    </div>
  </div>
  <clone-repository-modal
    v-if="isCloneModalShow"
    :old-repository-name="currentRepositoryName"
    @close="handleCloseCloneModal"
    :is-modal-visible="isCloneModalShow"></clone-repository-modal>
</template>

<script lang="ts" setup>
import {
  ArrowLeftOutlined,
  CloudSyncOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FormOutlined,
  LeftOutlined,
  LoadingOutlined,
  LockOutlined,
  MenuOutlined,
  ReadOutlined,
  SwapOutlined,
  UnlockOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import {
  Dropdown as AntDropdown,
  Menu as AntMenu,
  message,
  Modal,
  Skeleton as AntSkeleton
} from 'ant-design-vue';
import { computed, createVNode, defineEmits, defineProps, inject, PropType, ref } from 'vue';
import type { RepositoryModelType } from 'metagraph-constant';
import { useRoute } from 'vue-router';
import CloneRepositoryModal
  from '@/views/repository-editor/repository-editor-header/clone-repository-modal.vue';
import { useStore } from '@/store';
import { CommentControlButton, StarControlButton } from '@/business';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { MButton, MTag, MCheckbox } from '@/metagraph-ui';
import SwitchMode from '@/views/repository-editor/repository-editor-header/switch-mode.vue';
import { RouterUtil } from '@/utils/router.util';
import { RepositoryEditor, repositoryModel } from './model/repository.editor';

const AntMenuItem = AntMenu.Item;
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

const optionList = ref([
  { key: 'section', name: '文档模式' },
  { key: 'graph', name: '图谱模式' }
]);


const route = useRoute();
const store = useStore();
const repositoryEditor = new RepositoryEditor();
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const needRefresh = ref(route.query.refresh);
const isCloning = ref(false);
const isCloneModalShow = ref(false);
const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));
const goHomePage = async () => {
  await RouterUtil.jumpTo('/');
};
const isLogin = computed(() => store.state.user.isLogin);

async function handleStarStatusUpdate() {
  if (repositoryEntityId.value) {
    await repositoryEditor.getRepositoryByEntityId(repositoryEntityId.value);
  }
}

async function goRepositoryEditPage() {
  await RouterUtil.jumpTo('/repository/edit', {
    repositoryEntityId: repositoryEntityId.value
  });
}

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
      await RouterUtil.replaceTo('/repository/editor', {
        repositoryEntityId: clonedRepositoryEntityId,
        type: 'edit',
        refresh: 'need'
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

</script>

<style scoped lang="scss">
@import "../../style/common";

.divider-style {
  height: 1px;
  background: $borderColor;
  width: 100%;
  margin: 6px 0;
}

.saving-icon-style {
  color: $starHighlight;
}

.saved-icon-style {
  color: $themeColor;
}

.repository-editor-header {
  position: relative;
  //background: $headerBackgroundColor;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-side {
    display: flex;
    gap: 4px;

    .title {
      margin-right: 16px;
      margin-left: 8px;
      display: flex;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      align-items: center;

      .repository-name {
        margin-right: 4px;
        font-weight: 600;
        line-height: 32px;
        max-width: 200px;
        @include no-break-line-text;
      }

      .repository-type-tag {
        margin-left: 4px;
      }

      .saving-status {
        margin-left: 4px;
        height: 32px;
        width: 34px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .middle-side {
    position: absolute;
    top: 12px;
    left: calc(50% - 110px);
  }

  .right-side {
    display: flex;
    align-items: center;
    gap: 20px;

    .view-switch {
      line-height: 32px;
    }
  }
}
</style>
