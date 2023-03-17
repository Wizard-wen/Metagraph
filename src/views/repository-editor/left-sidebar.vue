<template>
  <div :class="['section-tree', isClose ? 'hide-style': 'show-style']">
    <div :class="['drag-btn', isClose ? 'hide-drag-style': 'show-drag-style' ]"
         @click="handleClickDrag">
      <CaretLeftOutlined/>
    </div>
    <div class="tree-container">
      <div class="header">目录</div>
      <div class="control" v-if="isEditable">
        <ant-button
          v-if="isEditable"
          class="add-section-button"
          @click="openCreateSectionModal({
        type: 'Section', isRoot: true
      })">
          <template #icon>
            <PlusOutlined/>
          </template>
          创建目录
        </ant-button>
      </div>
      <div class="tree-scroll-content" :class="[isEditable ? 'edit-height' : 'readonly-height']">
        <div class="tree-content">
          <metagraph-tree
            v-if="sectionTree.metaTree.length"
            :activeItemId="sectionTree.selectedSectionId"
            @control="handleTreeControl"
            @selectedChange="handleSelectedTreeNode"
            :tree-list="sectionTree.metaTree"></metagraph-tree>
<!--          <ant-tree-->
<!--            style="display: none"-->
<!--            v-if="sectionTree.tree.length"-->
<!--            :tree-data="sectionTree.tree"-->
<!--            class="ant-tree-customer"-->
<!--            show-icon-->
<!--            defaultExpandAll-->
<!--            @select="handleSelectedTreeNode"-->
<!--            :selectedKeys="sectionTree.selectedTreeNodes">-->
<!--            <template #Section>-->
<!--              <FolderOutlined/>-->
<!--            </template>-->
<!--            <template #title="{ key: treeKey, title, entity, section }" v-if="isEditable">-->
<!--              <ant-dropdown :trigger="['contextmenu']" :disabled="entity !== undefined">-->
<!--                <span>{{ title }}</span>-->
<!--                <template #overlay>-->
<!--                  <ant-menu-->
<!--                    @click="({-->
<!--                      key: menuKey-->
<!--                    }) => handleContextMenuClick(treeKey, menuKey, section)">-->
<!--                    <ant-menu-item key="Section">插入子级目录</ant-menu-item>-->
<!--                    <ant-menu-item key="Delete">删除</ant-menu-item>-->
<!--                    <ant-menu-item key="Knowledge">绑定知识点</ant-menu-item>-->
<!--                    <ant-menu-item key="ChangeSection">修改目录信息</ant-menu-item>-->
<!--                  </ant-menu>-->
<!--                </template>-->
<!--              </ant-dropdown>-->
<!--            </template>-->
<!--          </ant-tree>-->
          <empty-view v-else></empty-view>
        </div>
      </div>
    </div>
    <div class="tree-bind-container">
      <div class="header">知识点</div>
      <div
        class="section-bind-scroll-container"
        v-if="currentSectionNode.entityList.length">
        <div class="section-bind-list">
          <metagraph-list
            v-if="currentSectionNode.entityList.length"
            :list-data="listData"></metagraph-list>
          <!--                <div-->
          <!--                  class="list-item"-->
          <!--                  v-for="item in currentSectionNode.entityList"-->
          <!--                  :key="item.entity.id">-->
          <!--                  <div class="text no-break-line-text" :title="item.content.name">-->
          <!--                    <SnippetsOutlined class="icon"/>-->
          <!--                    {{ item.content.name }}-->
          <!--                  </div>-->
          <!--                  <div class="control">-->
          <!--                    <ViewIcon @click="handleClickEntityItem(item)"></ViewIcon>-->
          <!--                  </div>-->
          <!--                </div>-->
        </div>
      </div>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { CaretLeftOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type {
  EntityCompletelyListItemType,
  KnowledgeResponseType,
  SectionModelType
} from 'metagraph-constant';
import { computed, defineEmits, inject, ref } from 'vue';
import MetagraphTree from '@/components/metagraph-tree/metagraph-tree.vue';
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Menu as AntMenu,
  Tree as AntTree
} from 'ant-design-vue';
import { isEditableKey } from '@/views/repository-editor/model/provide.type';
import { currentSectionNode, sectionTree } from '@/views/repository-editor/model/section.tree';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import MetagraphList from '@/components/metagraph-list.vue';

const AntMenuItem = AntMenu.Item;

type OperationType = 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection' | 'Delete';
const sectionTreeRef = ref();
const emit = defineEmits(['selectSection', 'createSection', 'widthChange']);
const knowledgePreview = new KnowledgePreview();
const isEditable = inject(isEditableKey, ref(false));
const isCreateSectionModalShown = ref(false);
const isClose = ref(false);

const listData = computed(() => {
  return currentSectionNode.entityList.map((item) => {
    return {
      title: (item.content as KnowledgeResponseType).name,
      name: (item.content as KnowledgeResponseType).name,
      key: item.entity.id,
      data: item
    };
  });
});

function handleClickDrag() {
  isClose.value = !isClose.value;
}

async function openCreateSectionModal(params: {
  type: OperationType,
  section?: SectionModelType,
  isRoot?: boolean
}) {
  emit('createSection', params);
}

async function handleSelectedTreeNode(params: {
  id: string
}) {
  emit('selectSection', params.id);
}

function handleTreeControl(params: {
  type: OperationType,
  data: SectionModelType
}) {
  console.log(params);
  openCreateSectionModal({
    type: params.type,
    section: params.data
  });
}

function handleContextMenuClick(
  treeKey: string,
  menuKey: OperationType,
  section?: SectionModelType
) {
  console.log(menuKey);
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

</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.show-style {
  width: 280px;
}

.hide-style {
  width: 0;
}

.section-tree {
  height: calc(100vh - 55px);
  position: relative;

  .drag-btn {
    box-sizing: border-box;
    z-index: 1000;
    position: absolute;
    top: 200px;
    height: 44px;
    width: 14px;

    cursor: pointer;
    line-height: 44px;
    text-align: center;
    background: #FFF;
    border: 1px solid #e7e9e8;
    border-radius: 4px;

    &:hover {
      padding: 1px;
      background: #e7e9e8;
      border: none;
      border-radius: 4px;
    }
  }

  .hide-drag-style {
    left: 0;
  }

  .show-drag-style {
    right: -7px;
  }

  .tree-container {
    height: 50%;
    border-bottom: 1px solid $borderColor;

    .header {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: left;
      padding-left: 20px;
      width: 100%;
      font-weight: bold;
      border-bottom: 1px solid $borderColor;
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
      //height: calc(100% - 74px);
      padding: 10px 8px;
    }

    .readonly-height {
      height: calc(100% - 32px);

    }

    .edit-height {
      height: calc(100% - 74px);
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
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: left;
      padding-left: 20px;
      width: 100%;
      font-weight: bold;
      background: #FFF;
      border-bottom: 1px solid $borderColor;
    }

    .section-bind-scroll-container {
      height: calc(100% - 32px);
      padding: 10px 0;
    }

    .section-bind-list {
      padding: 0 8px;
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
    width: 195px; /* 必须定义宽度 */
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
