<template>
  <div class="section-tree">
    <div class="tree-container">
      <div class="header">单元树</div>
      <div class="control">
        <ant-button
          v-if="isEditable"
          class="add-section-button"
          @click="openCreateSectionModal({
        type: 'Section', isRoot: true
      })">
          <template #icon>
            <PlusOutlined/>
          </template>
          创建顶级单元
        </ant-button>
      </div>
      <div class="tree-scroll-content">
        <div class="tree-content">
          <ant-tree
            v-if="sectionTree.tree.length"
            :tree-data="sectionTree.tree"
            class="ant-tree-customer"
            show-icon
            defaultExpandAll
            @select="handleSelectedTreeNode"
            :selectedKeys="sectionTree.selectedTreeNodes">
            <template #Section>
              <FolderOutlined/>
            </template>
            <template #title="{ key: treeKey, title, entity, section }" v-if="isEditable">
              <ant-dropdown :trigger="['contextmenu']" :disabled="entity !== undefined">
                <span>{{ title }}</span>
                <template #overlay>
                  <ant-menu
                    @click="({
                      key: menuKey
                    }) => handleContextMenuClick(treeKey, menuKey, section)">
                    <ant-menu-item key="Section">插入子级单元</ant-menu-item>
                    <ant-menu-item key="Delete">删除</ant-menu-item>
                    <ant-menu-item key="Knowledge">绑定知识点</ant-menu-item>
                    <ant-menu-item key="ChangeSection">修改单元信息</ant-menu-item>
                  </ant-menu>
                </template>
              </ant-dropdown>
            </template>
          </ant-tree>
          <empty-view v-else></empty-view>
        </div>
      </div>
    </div>
    <div class="tree-bind-container">
      <div class="header">单元知识点列表</div>
      <div
        class="section-bind-scroll-container"
        v-if="currentSectionNode.entityList.length">
        <div class="section-bind-list">
          <div
            class="list-item"
            v-for="item in currentSectionNode.entityList"
            :key="item.entity.id">
            <div class="text no-break-line-text" :title="item.content.name">
              <SnippetsOutlined class="icon"/>
              {{ item.content.name }}
            </div>
            <div class="control">
              <ViewIcon @click="handleClickEntityItem(item, 'draft')"></ViewIcon>
            </div>
          </div>
        </div>
      </div>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts">
import EmptyView from '@/components/empty-view/empty-view.vue';
import {
  FolderOutlined,
  PlusOutlined, SnippetsOutlined
} from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType, SectionModelType } from 'metagraph-constant';
import {
  defineComponent, ref, inject
} from 'vue';
import {
  Tree, Dropdown, Menu, Button
} from 'ant-design-vue';
import { isEditableKey } from '@/views/repository-editor/model/provide.type';
import { ViewIcon } from '@/components/icons';
import {
  sectionTree,
  currentSectionNode
} from '@/views/repository-editor/model/section.tree';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';

export default defineComponent({
  name: 'section-tree',
  components: {
    EmptyView,
    PlusOutlined,
    ViewIcon,
    SnippetsOutlined,
    FolderOutlined,
    AntTree: Tree,
    AntButton: Button,
    AntDropdown: Dropdown,
    AntMenu: Menu,
    AntMenuItem: Menu.Item
  },
  emits: ['selectSection', 'createSection'],
  setup(props, { emit }) {
    const knowledgePreview = new KnowledgePreview();
    const isEditable = inject(isEditableKey, ref(false));
    const isCreateSectionModalShown = ref(false);

    async function openCreateSectionModal(params: {
      type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection' | 'Delete',
      section?: SectionModelType,
      isRoot?: boolean
    }) {
      emit('createSection', params);
    }

    async function handleSelectedTreeNode(selectedKeys: string[]) {
      emit('selectSection', selectedKeys);
    }

    function handleContextMenuClick(
      treeKey: string,
      menuKey: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection' | 'Delete',
      section?: SectionModelType
    ) {
      openCreateSectionModal({
        type: menuKey,
        section
      });
    }

    function handleClickEntityItem(item: EntityCompletelyListItemType) {
      knowledgePreview.handleShowKnowledgeDrawer(
        item.entity.id,
        'published'
      );
    }

    return {
      handleContextMenuClick,
      openCreateSectionModal,
      handleSelectedTreeNode,
      handleClickEntityItem,
      isCreateSectionModalShown,
      isEditable,
      sectionTree,
      currentSectionNode
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.section-tree {
  height: calc(100vh - 55px);

  .tree-container {
    height: 50%;
    border-bottom: 1px solid $borderColor;

    .header {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      text-align: center;
      width: 100%;
      border-bottom: 1px solid $borderColor;
      background: #f9f9f9;
    }

    .control {
      padding: 10px 15px 0 15px;

      .add-section-button {
        width: 100%;
        font-size: 12px;
        border-radius: 4px;
      }
    }

    .tree-scroll-content {
      height: calc(100% - 74px);
      padding: 10px 0;
    }

    .tree-content {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .tree-bind-container {
    height: 50%;
    overflow: hidden;

    .header {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      text-align: center;
      width: 100%;
      background: #f9f9f9;
      border-bottom: 1px solid $borderColor;
    }

    .section-bind-scroll-container {
      height: calc(100% - 32px);
      padding: 10px 0;
    }

    .section-bind-list {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .list-item {
        padding: 0 15px;
        height: 35px;
        line-height: 35px;
        width: 100%;
        text-align: left;
        text-indent: 5px;
        display: flex;
        justify-content: space-between;

        &:hover {
          @include list-item-highlight;
          text-indent: 5px;
        }

        .text {
          .icon {
            text-indent: 0;
          }
        }

        .text-no-icon {
          padding-left: 17px;
        }

        .control {
          font-size: 20px;
          line-height: 35px;
        }
      }
    }
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
    padding: 0;
    //width: 195px; /* 必须定义宽度 */
    word-break: break-word; /* 文本行的任意字内断开 */
    word-wrap: break-word; /* IE */
    white-space: pre-line; /* CSS 3 (and 2.1 as well, actually) */
  }

  ::v-deep(.ant-dropdown-trigger) {
    padding-right: 10px;
    display: inline-block;
    min-width: 80px;
    min-height: 19px;
  }
}
</style>
