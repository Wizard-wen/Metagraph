<template>
  <div class="section-tree">
    <ant-button
      v-if="isEditable"
      style="width: 100%"
      @click="openCreateSectionModal({
        type: 'Section', isRoot: true
      })">
      创建顶级章节
    </ant-button>
    <div class="tree-content">
      <ant-tree
        :tree-data="sectionTree.tree"
        class="ant-tree-customer"
        show-icon
        @select="handleSelectedTreeNode"
        :selectedKeys="sectionTree.selectedTreeNodes">
        <template #Knowledge>
          <knowledge-icon></knowledge-icon>
        </template>
        <template #Section>
          <FolderOutlined/>
        </template>
        <template #title="{ key: treeKey, title, entity, section }" v-if="isEditable">
          <ant-dropdown :trigger="['contextmenu']" :disabled="entity !== undefined">
            <span>{{ title }}</span>
            <template #overlay>
              <ant-menu
                @click="({ key: menuKey }) => handleContextMenuClick(treeKey, menuKey, section)">
                <ant-menu-item key="Section">插入子级章节</ant-menu-item>
                <ant-menu-item key="Knowledge">绑定知识点</ant-menu-item>
                <ant-menu-item key="ChangeSection">修改章节信息</ant-menu-item>
              </ant-menu>
            </template>
          </ant-dropdown>
        </template>
      </ant-tree>
    </div>
    <section-create-modal
      :is-modal-visible="isCreateSectionModalShown"
      @close="isCreateSectionModalShown = false"></section-create-modal>
  </div>
</template>

<script lang="ts">
import {
  FolderOutlined,
} from '@ant-design/icons-vue';
import type { SectionModelType } from 'metagraph-constant';
import {
  computed, defineComponent, ref, inject
} from 'vue';
import {
  Tree, Dropdown, Menu, Button
} from 'ant-design-vue';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import { knowledgeDrawerState } from '@/business';
import { isRepositoryEditorLoading } from '@/views/repository-editor/repository-editor';
import { isEditableKey } from '@/views/repository-editor/provide.type';
import SectionCreateModal from '@/views/repository-editor/section-tree/section-create-modal.vue';
import { KnowledgeIcon } from '@/components/icons';
import {
  SectionTreeService,
  sectionTree
} from '@/views/repository-editor/section-tree/section.tree';

export default defineComponent({
  name: 'section-tree',
  components: {
    KnowledgeIcon,
    SectionCreateModal,
    FolderOutlined,
    AntTree: Tree,
    AntButton: Button,
    AntDropdown: Dropdown,
    AntMenu: Menu,
    AntMenuItem: Menu.Item
  },
  setup() {
    const sectionTreeService = new SectionTreeService();
    const isEditable = inject(isEditableKey, ref(false));
    const isCreateSectionModalShown = ref(false);
    const selectedTreeNodeEntityId = computed(() => (sectionTree.selectedTreeNodes[0]?.includes('-')
      ? sectionTree.selectedTreeNodes[0].split('-')[0] : ''));

    async function openCreateSectionModal(params: {
      type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
      section?: SectionModelType,
      isRoot?: boolean
    }) {
      isCreateSectionModalShown.value = true;
      await sectionTreeService.initSectionModal(params);
    }

    async function handleSelectedTreeNode(selectedKeys: string[], info: SelectEvent) {
      isRepositoryEditorLoading.value = true;
      if (!info.node.dataRef.section) {
        knowledgeDrawerState.isShow = true;
        // eslint-disable-next-line prefer-destructuring
        knowledgeDrawerState.entityId = selectedKeys[0].split('-')[0];
      }
      await sectionTreeService.selectTreeNode({
        selectedKeys,
        info
      }, isEditable.value);
      isRepositoryEditorLoading.value = false;
    }

    const handleContextMenuClick = (
      treeKey: string,
      menuKey: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
      section?: SectionModelType
    ) => {
      openCreateSectionModal({
        type: menuKey,
        section
      });
    };
    return {
      handleContextMenuClick,
      openCreateSectionModal,
      handleSelectedTreeNode,
      isCreateSectionModalShown,
      selectedTreeNodeEntityId,
      isEditable,
      sectionTree
    };
  }
});
</script>

<style scoped lang="scss">
.section-tree {
  .tree-content {
    padding-left: 10px;
  }
}

.ant-tree-customer {
  text-align: left;

  ::v-deep(.ant-tree-treenode-switcher-close) {
    height: max-content;
  }

  ::v-deep(.ant-tree-node-content-wrapper) {
    clear: both; /* 清除左右浮动 */
    height: max-content;
    width: 200px; /* 必须定义宽度 */
    word-break: break-word; /* 文本行的任意字内断开 */
    word-wrap: break-word; /* IE */
    white-space: pre-line; /* CSS 3 (and 2.1 as well, actually) */
  }

  ::v-deep(.ant-dropdown-trigger) {
    padding-right: 10px;
  }
}
</style>
