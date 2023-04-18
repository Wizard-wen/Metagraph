<template>
  <div
    class="label"
    @mouseenter="handleMouseEnter($event)"
    @mouseleave="handleMouseLeave">
    <div
      v-if="articleItem.children.length"
      class="icon-content-style arrow"
      @click="handleClickArrow($event)">
      <caret-right-outlined
        class="arrow-icon"
        :class="{'arrow-rotate': expendItemId === articleItem.article.id}"/>
    </div>
    <div v-else class="no-icon"></div>
    <div class="text"
         :title="articleItem.article.name"
         @click="handleClickItem({id: articleItem.article.id})">
      {{ articleItem.article.name }}
    </div>
    <div class="control">
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :placement="'bottomRight'"
        :trigger="['click']">
        <div class="icon-content-style">
          <MoreOutlined/>
        </div>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item
              class="menu-item-style"
              @click="handleControlArticle('Delete')">
              <DeleteOutlined class="icon-size"/>
              删除文本
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
    </div>
  </div>
  <template v-if="articleItem.children.length && expendItemId === articleItem.article.id">
    <div
      v-for="(item, index) in articleItem.children" :key="index"
      class="label"
      style="padding-left: 30px"
      @mouseenter="handleMouseEnter($event)"
      @mouseleave="handleMouseLeave">
      <div class="text-container">
        <div class="text"
             @click="handleClickItem({id: item.id})">
          {{ item.name }}({{ item.weight.toFixed() }})
        </div>
      </div>
      <div class="control">
        <ant-dropdown
          :getPopupContainer="getPopupContainer"
          :trigger="['click']"
          :placement="'bottomRight'">
          <div class="icon-content-style">
            <MoreOutlined/>
          </div>
          <template #overlay>
            <ant-menu class="dropdown-menu-style">
              <ant-menu-item
                class="menu-item-style"
                @click="handleControlKnowledge('CreateKnowledge', item)">
                <ReadOutlined class="icon-size"/>
                创建词条
              </ant-menu-item>
              <ant-menu-item
                class="menu-item-style"
                @click="handleControlKnowledge('DeleteKnowledge', item)">
                <DeleteOutlined class="icon-size"/>
                删除词条
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
      </div>
    </div>
  </template>

</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType } from 'vue';
import { CaretRightOutlined, MoreOutlined, DeleteOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { Dropdown as AntDropdown, Menu as AntMenu } from 'ant-design-vue';
import type {
  AlternativeKnowledgeModelType,
  KnowledgeArticleModelType
} from '../metagraph-constant/dist/type/knowledge.type';

const AntMenuItem = AntMenu.Item;

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const emit = defineEmits(['expend', 'controlArticle', 'controlKnowledge', 'selectedChange']);

const props = defineProps({
  articleItem: {
    type: Object as PropType<{
      article: KnowledgeArticleModelType;
      children: AlternativeKnowledgeModelType[];
    }>,
    default: () => {
    }
  },
  expendItemId: {
    type: String,
    default: ''
  }
});

function handleClickItem(params: { id: string }) {
  emit('selectedChange', params);
}

function handleControlArticle(type: string) {
  emit('controlArticle', {
    type,
    data: props.articleItem?.article
  });
}

function handleControlKnowledge(type: string, params?: AlternativeKnowledgeModelType) {
  emit('controlKnowledge', {
    type,
    data: params
  });
}

function handleClickArrow(event: MouseEvent) {
  event.stopPropagation();
  emit('expend', props.articleItem.article.id);
}

function handleMouseEnter(event: MouseEvent) {
  event.stopPropagation();
}

function handleMouseLeave() {

}
</script>

<style scoped lang="scss">
.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  line-height: 32px;
  padding: 0 2px;
  border-radius: 4px;

  &:hover {
    background: #eff0f0;
  }

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

  .arrow {
    margin-right: 4px;
  }

  .arrow-rotate {
    transform: rotate(90deg);
  }

  .no-icon {
    padding-left: 28px;
  }

  .text {
    text-align: left;
    cursor: pointer;
    flex: 1;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }

  .text-container {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }

  .control {
    display: flex;
  }

}
</style>
