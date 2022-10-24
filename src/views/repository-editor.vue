<template>
  <ant-spin :spinning="isRepositoryEditorLoading" class="repository-page">
    <repository-editor-header
      @viewChange="handleChangeView"
      :view-status="viewStatus"
      :saving-status="isSaving"
      v-if="repositoryModel.target"
    ></repository-editor-header>
    <div class="editable">
      <div class="section-view">
        <template v-if="viewStatus === 'section'">
          <section-tree
            @createSection="handleOpenCreateSectionModal"
            @selectSection="handleSelectSection"></section-tree>
          <div class="text-content">
            <section-article-tip-tap
              v-if="repositoryEntityId && editor"
              :entityId="repositoryEntityId"
              :editable="isEditable"
              :editor="editor"
              @refreshSection="handleCreateSection"
              @createSection="handleOpenCreateSectionModal"
              @save="saveSectionArticle"
              @clickMention="handleClickMention($event)"
              @mention="handleMention($event)">
            </section-article-tip-tap>
          </div>
        </template>
        <template v-else>
          <div class="graph-content">
            <knowledge-graph-panel></knowledge-graph-panel>
          </div>
        </template>
        <div class="right-sidebar">
          <right-sidebar @refreshSection="handleCreateSection"></right-sidebar>
        </div>
      </div>
    </div>
  </ant-spin>
  <section-create-modal
    v-if="isCreateSectionModalShown"
    :is-modal-visible="isCreateSectionModalShown"
    @close="handleCreateSection"></section-create-modal>
  <knowledge-drawer-content
    v-if="knowledgeDrawerState.isShow && knowledgeDrawerState.entityId"
    :is-visible="knowledgeDrawerState.isShow"
    :knowledge-entity-id="knowledgeDrawerState.entityId"
    @close="handleCloseKnowledgeDrawer" :type="'published'"></knowledge-drawer-content>
</template>

<script lang="ts">
import { SectionApiService } from '@/api.service';
import { IndexdbService } from '@/service/indexdb.service';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import type { JSONContent } from '@tiptap/vue-3';
import { EntityCompletelyListItemType, SectionModelType } from 'metagraph-constant';
import {
  defineComponent, ref, onUnmounted, provide, onMounted, createVNode
} from 'vue';
import {
  onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter
} from 'vue-router';
import {
  Empty, message, Modal, Spin
} from 'ant-design-vue';
import {
  currentSectionNode,
  sectionModalData,
  SectionTreeService,
  SectionOperationType
} from '@/views/repository-editor/model/section.tree';
import {
  RepositoryEditor,
  repositoryModel,
  sectionEntityId,
  isPublicRepository,
  isRepositoryEditorLoading, repositoryBindEntityList
} from '@/views/repository-editor/model/repository.editor';
import { SectionArticleTiptapTextEditor } from '@/components';
import { KnowledgeDrawerContent, knowledgeDrawerState } from '@/business';
import {
  RightSidebar,
  SectionTree,
  SectionArticleTipTap,
  KnowledgeGraphPanel,
  RepositoryEditorHeader,
  SectionCreateModal
} from './repository-editor/index';
import { isEditableKey, repositoryEntityIdKey } from './repository-editor/model/provide.type';

export default defineComponent({
  name: 'repository-editor',
  components: {
    KnowledgeDrawerContent,
    RightSidebar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraphPanel,
    RepositoryEditorHeader,
    SectionCreateModal,
    AntSpin: Spin
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    // 当前知识库entityId
    const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);
    const isEditable = ref<boolean>((route.query.type as string) === 'edit');
    const sectionTreeService = new SectionTreeService();
    provide(repositoryEntityIdKey, repositoryEntityId);
    provide(isEditableKey, isEditable);
    const repositoryEditorService = new RepositoryEditor();
    const knowledgePreview = new KnowledgePreview();
    // 视图状态
    const viewStatus = ref<'section' | 'graph'>('section');
    const isSaving = ref();
    const isCreateSectionModalShown = ref(false);
    const sectionArticleTiptapTextEditor = new SectionArticleTiptapTextEditor(
      repositoryEntityId.value,
      isEditable.value,
      sectionTreeService
    );
    sectionArticleTiptapTextEditor.initEditorInstance();
    const { editor } = sectionArticleTiptapTextEditor;

    // 切换视图状态
    async function handleChangeView(view: 'section' | 'graph') {
      viewStatus.value = view;
      if (view === 'section') {
        await sectionTreeService.getSectionTree(
          repositoryEntityId.value,
          route.query.sectionId as string
        );
      }
    }

    async function handleSelectSection(selectedKeys: string[]) {
      isRepositoryEditorLoading.value = true;
      router.replace({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: repositoryEntityId.value,
          type: 'edit',
          sectionId: selectedKeys.length ? selectedKeys[0] : undefined
        },
        force: true
      })
        .then();
      if (selectedKeys.length) {
        await sectionArticleTiptapTextEditor?.saveSectionContentBeforeUpdate({
          sectionId: selectedKeys[0],
          isEditable: isEditable.value,
          sectionName: currentSectionNode.title
        });
      }
      // 切换tree node
      await sectionTreeService.selectTreeNode({
        selectedKeys,
        repositoryEntityId: repositoryEntityId.value
      });
      // 更新富文本
      sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
      isRepositoryEditorLoading.value = false;
    }

    async function handleOpenCreateSectionModal(params: {
      type: SectionOperationType,
      section?: SectionModelType,
      isRoot?: boolean
    }) {
      if (params.type === 'Delete') {
        Modal.confirm({
          title: '确定删除当前单元吗?',
          okText: '确定',
          cancelText: '取消',
          zIndex: 9001,
          icon: createVNode(ExclamationCircleOutlined),
          content: '该操作不可逆，确定删除单元吗？',
          async onOk() {
            if (!params?.section) {
              return;
            }
            const result = await SectionApiService.removeSection({
              repositoryEntityId: repositoryEntityId.value,
              id: params.section.id
            });
            if (result.code === 0) {
              // 删除indexDB中的section
              await IndexdbService.getInstance()
                .remove('repository', params.section.id);
              // 清空section tree
              sectionTreeService.initSectionView();
              // 重新初始化section tree
              await sectionTreeService.getSectionTree(repositoryEntityId.value);
              // 刷新路由
              router.replace({
                name: 'RepositoryEditor',
                query: {
                  repositoryEntityId: repositoryEntityId.value,
                  type: 'edit',
                  sectionId: currentSectionNode.sectionId
                },
                force: true
              })
                .then();
              if (currentSectionNode.sectionId) {
                const repositoryEntityList = repositoryBindEntityList.value.map(
                  (item) => item as EntityCompletelyListItemType
                );
                // 初始化富文本内容
                await sectionArticleTiptapTextEditor?.initData({
                  sectionId: currentSectionNode.sectionId,
                  repositoryEntityList
                });
                // 更新富文本
                sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
              } else {
                sectionArticleTiptapTextEditor.updateCurrentSectionId(undefined);
                sectionArticleTiptapTextEditor?.setContent();
              }
            }
          },
          async onCancel() {
            message.info('取消删除');
          },
        });
      } else {
        isCreateSectionModalShown.value = true;
        await sectionTreeService.initSectionModal(params);
      }
    }

    async function handleCreateSection(params: {
      // 创建的是单元
      sectionId?: string,
      // 绑定实体
      entityId?: string
    }) {
      if (params.sectionId) {
        router.replace({
          name: 'RepositoryEditor',
          query: {
            repositoryEntityId: repositoryEntityId.value,
            type: 'edit',
            sectionId: params.sectionId
          },
          force: true
        })
          .then();
        // 切换section tree之前应该保存之前的section article
        await sectionArticleTiptapTextEditor?.saveSectionContentBeforeUpdate({
          sectionId: params.sectionId,
          isEditable: true,
          sectionName: currentSectionNode.title
        });
        await sectionTreeService.getSectionTree(repositoryEntityId.value, params.sectionId);
        // 切换tree node
        // 更新富文本
        sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
        sectionModalData.isConfirmLoading = false;
      }
      if (params.entityId && sectionModalData?.parentSectionId) {
        await sectionTreeService.getSectionTree(
          repositoryEntityId.value,
          sectionModalData.parentSectionId
        );
      }
      isCreateSectionModalShown.value = false;
    }

    function preventContextmenu(event: MouseEvent) {
      event.preventDefault();
    }

    async function handleRouteLeaveConfirm(): Promise<boolean> {
      return new Promise((resolve) => {
        Modal.confirm({
          zIndex: 100000,
          title: '确定离开当前页面吗?',
          icon: createVNode(ExclamationCircleOutlined),
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            resolve(true);
          },
          onCancel() {
            resolve(false);
          }
        });
      });
    }

    onBeforeRouteLeave(async () => {
      // 取消导航并停留在同一页面上
      const result = await handleRouteLeaveConfirm();
      if (result) {
        isRepositoryEditorLoading.value = true;
        const description = editor.value?.getHTML();
        const descriptionInIndexDB = await IndexdbService.getInstance()
          .get('repository', currentSectionNode.sectionId);
        if (descriptionInIndexDB !== description) {
          console.log('indexdb与当前富文本数据不一致', descriptionInIndexDB, description);
        }
        if (editor.value) {
          await sectionTreeService.saveSectionArticle({
            content: editor.value.getJSON(),
            contentHtml: editor.value.getHTML(),
            sectionId: currentSectionNode.sectionId
          });
        }
        isRepositoryEditorLoading.value = false;
        return result;
      }
      return false;
    });

    onMounted(async () => {
      isRepositoryEditorLoading.value = true;
      const sectionId = route.query.sectionId as string;
      await Promise.all([
        repositoryEditorService.getAlternativeKnowledgeList(repositoryEntityId.value),
        repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value),
        repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value),
        sectionTreeService.getSectionTree(repositoryEntityId.value, sectionId ?? undefined)
      ]);
      if (isEditable.value) {
        await repositoryEditorService.getOwnDraftKnowledgeList(repositoryEntityId.value);
      }
      // 初始化富文本内容
      if (currentSectionNode.sectionId) {
        await sectionArticleTiptapTextEditor?.initData({
          sectionId: currentSectionNode.sectionId,
          repositoryEntityList: repositoryBindEntityList.value.map(
            (item) => item as EntityCompletelyListItemType
          )
        });
        // 初始化富文本内容
        sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
      }
      isRepositoryEditorLoading.value = false;
      document.addEventListener('contextmenu', preventContextmenu);
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', preventContextmenu);
      sectionArticleTiptapTextEditor?.destroy();
    });

    onBeforeRouteUpdate(async (to, from) => {
      if (to.query.repositoryEntityId !== from.query.repositoryEntityId) {
        isRepositoryEditorLoading.value = true;
        repositoryEntityId.value = to.query.repositoryEntityId as string;
        await Promise.all([
          repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value),
          repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value),
          sectionTreeService.getSectionTree(repositoryEntityId.value)
        ]);
        isRepositoryEditorLoading.value = false;
      }

      if (to.query.sectionId !== from.query.sectionId) {
        // todo
      }
    });

    function handleClickMention(event: { id: string, name: string }) {
      knowledgePreview.handleShowKnowledgeDrawer(event.id, 'published');
    }

    function handleCloseKnowledgeDrawer() {
      knowledgePreview.handleCloseKnowledgeDrawer();
    }

    const saveSectionArticle = async (params: {
      content: JSONContent,
      contentHtml: string
    }) => {
      isSaving.value = 'saving...';
      await sectionTreeService.saveSectionArticle({
        content: params.content,
        contentHtml: params.contentHtml,
        sectionId: currentSectionNode.sectionId
      });
      isSaving.value = 'saved';
      setTimeout(() => {
        isSaving.value = undefined;
      }, 500);
    };
    const handleMention = (params: {
      name: string, id: string, success: () => string, fail: () => string,
      content: JSONContent,
      contentHtml: string
    }) => {
      repositoryEditorService.handleMention({
        ...params,
        repositoryEntityId: repositoryEntityId.value
      });
    };
    return {
      editor,
      isRepositoryEditorLoading,
      repositoryModel,
      viewStatus,
      saveSectionArticle,
      isEditable,
      sectionEntityId,
      repositoryEntityId,
      handleMention,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      isPublicRepository,
      handleChangeView,
      handleClickMention,
      isSaving,
      knowledgeDrawerState,
      handleCloseKnowledgeDrawer,
      handleSelectSection,
      handleOpenCreateSectionModal,
      handleCreateSection,
      isCreateSectionModalShown
    };
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repository-page {
  height: 100vh;
  overflow-y: auto;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
      width: calc(100% - 480px);
      height: 100%;
    }

    .graph-content {
      width: calc(100% - 260px);
      height: calc(100vh - 56px);
    }

    .right-sidebar {
      width: 260px;
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>
