<template>
  <div :class="['section-tree', isClose ? 'hide-style': 'show-style']">
    <div :class="['drag-btn', isClose ? 'hide-drag-style': 'show-drag-style' ]"
         @click="handleClickDrag">
      <CaretLeftOutlined/>
    </div>
    <div class="tree-container">
      <div class="header">目录</div>
      <div class="control" v-if="isEditable">
        <m-button
          class="add-section-button"
          v-if="isEditable"
          :title="'创建目录'"
          @click="openCreateSectionModal({ type: 'Section', isRoot: true })">
          <template #icon>
            <PlusOutlined/>
          </template>
        </m-button>
      </div>
      <div class="tree-scroll-content" :class="[isEditable ? 'edit-height' : 'readonly-height']">
        <div class="tree-content">
          <metagraph-tree
            v-if="sectionTree.metaTree.length"
            :activeItemId="sectionTree.selectedSectionId"
            @control="handleTreeControl"
            @selectedChange="handleSelectedTreeNode"
            :tree-list="sectionTree.metaTree"></metagraph-tree>
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
            @control="handleClickEntityItem"
            v-if="currentSectionNode.entityList.length"
            :list-data="listData"></metagraph-list>
        </div>
      </div>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { CaretLeftOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type {
  EntityCompletelyListItemType,
  KnowledgeResponseType,
  SectionModelType
} from 'metagraph-constant';
import { computed, defineEmits, inject, ref } from 'vue';
import MetagraphTree from '@/components/metagraph-tree/metagraph-tree.vue';
import { isEditableKey } from '@/views/repository-editor/model/provide.type';
import { currentSectionNode, sectionTree } from '@/views/repository-editor/model/section.tree';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import MetagraphList from '@/components/metagraph-list.vue';
import { MButton } from '@/metagraph-ui';

type OperationType = 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection' | 'Delete';
const emit = defineEmits(['selectSection', 'createSection', 'widthChange']);
const knowledgePreview = new KnowledgePreview();
const isEditable = inject(isEditableKey, ref(false));
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
  openCreateSectionModal({
    type: params.type,
    section: params.data
  });
}

function handleClickEntityItem(params: { type: string, params: EntityCompletelyListItemType }) {
  knowledgePreview.handleShowKnowledgeDrawer(
    params.params.entity.id,
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
      padding: 10px 15px;

      .add-section-button {
        width: 100%;
      }
    }

    .tree-scroll-content {
      padding: 10px 8px;
      overflow-y: auto;
      @include custom-scroll-style;
    }

    .readonly-height {
      height: calc(100% - 32px);
    }

    .edit-height {
      height: calc(100% - 92px);
    }

    .tree-content {
      height: 100%;
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
      @include custom-scroll-style;

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
</style>
