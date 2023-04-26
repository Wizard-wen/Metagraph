<template>
  <div class="label" v-for="(item, index) in mentionedKnowledge.list" :key="index">
    <div class="text">{{ item.content.name }}</div>
    <div class="control">
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        :overlayClassName="'dropdown-overlay'">
        <div class="icon-content-style">
          <MoreOutlined/>
        </div>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item
              class="menu-item-style"
              @click="handleRemoveEdge(item)">
              删除
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="icon-content-style" @click="showKnowledgeDrawer(item)">
        <eye-outlined/>
      </div>
    </div>
  </div>
<!--  <div class="bind-panel">-->
<!--    <div class="knowledge-connection">-->
<!--      <div class="content" v-if="mentionedKnowledge.list.length">-->
<!--        <div-->
<!--          class="content-item"-->
<!--          :key="index"-->
<!--          v-for="(item, index) in mentionedKnowledge.list">-->
<!--          {{ item.content.name }}-->
<!--          <div class="control-right">-->
<!--            <EyeOutlined @click="showKnowledgeDrawer(item)"/>-->
<!--            <delete-icon @click="handleRemoveEdge(item)"></delete-icon>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script lang="ts" setup>
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import { ExclamationCircleOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';
// import { Modal, message } from 'ant-design-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from '@metagraph/constant';
import {
  createVNode, inject, ref
} from 'vue';
import { DeleteIcon } from '@/components/icons';
import {
  mentionedKnowledge,
  KnowledgeEdit,
  draftKnowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from '../model/knowledge.edit';

// import { defineEmits, defineProps, PropType } from 'vue';
// import { EyeOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu, Modal, message } from 'ant-design-vue';

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const AntMenuItem = AntMenu.Item;

/**
 * 功能需求
 * 1.获取知识点引用的知识点
 * 2.编辑知识点基本信息
 * 3.动态增加信息项
 * 4.知识点的信息定义要有一个文字的上限
 * 5.可以为知识点引用静态资源？
 * 6.知识点之间的同义词
 * 7.引用数量 被引数量 建立的关系说明
 * 8.文本编辑器中的mention节点可以被点击，不但展示引用的知识点的信息，还要展示引用的理由
 * 9.引用知识点时，弹窗应该添加引用的原因
 * 10.可以选择一段文本，直接标记为引用
 * 11.可以考虑展示一下，同一个知识点之间的循环引用关系
 */

const repositoryEntityId = inject(repositoryEntityIdInjectKey, ref(''));
const knowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
const knowledgeEdit = new KnowledgeEdit();
const knowledgePreview = new KnowledgePreview();

function handleClickControl(item: EntityCompletelyListItemType) {
  // emit('control', {
  //   type: 'view',
  //   params: item
  // });
}

function handleRemoveEdge(item: EntityCompletelyListItemType & { edgeId: string }) {
  console.log(item);
  const knowledgeContent = item.content as KnowledgeResponseType;
  Modal.confirm({
    title: '确定删除知识点关联吗',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要删除与知识点"${knowledgeContent.name}"的关联吗?`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      await knowledgeEdit.removeMentionKnowledge(
        knowledgeEntityId.value,
        item.entity.id
      );
    },
    onCancel() {
      message.info('取消解绑！');
    },
  });
}

function showKnowledgeDrawer(item: EntityCompletelyListItemType) {
  knowledgePreview.handleShowKnowledgeDrawer(item.entity.id, 'published');
}

</script>

<style scoped lang="scss">
@import '../../../style/common.scss';

.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border-radius: 4px;

  .icon-content-style {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;

    .arrow-icon {
      font-size: 12px;
    }

    &:hover {
      background: #e7e9e8;
    }
  }

  &:hover {
    background: #eff0f0;
  }

  .text {
    text-align: left;
    cursor: pointer;
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .control {
    display: flex;
  }
}

.bind-panel {
  background: #FFFFFF;
  width: 100%;
  height: calc(100vh - 55px);
}

.knowledge-connection {
  width: 100%;
  height: 100%;

  .title {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    background: $lightGray;
    border-bottom: 1px solid $borderColor;
  }

  .content {
    padding: 10px 0;

    .content-item {
      padding: 0 10px;
      text-align: left;
      height: 35px;
      line-height: 35px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .control-right {
        display: flex;
        gap: 5px;
      }

      &:hover {
        @include list-item-highlight;
      }
    }
  }
}
</style>
