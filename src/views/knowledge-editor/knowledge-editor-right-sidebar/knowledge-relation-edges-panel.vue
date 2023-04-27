<template>
  <div class="knowledge-name">
    <ReadOutlined class="icon-style"/>
    {{ knowledgeEdges.entity?.entity.name }}
  </div>
  <metagraph-tab-bar
    :is-editable="true"
    :current-key="currentBar"
    @selectedChange="handleBarChange"
    :element-tabs="toolbarElementList"></metagraph-tab-bar>
  <div class="search-bar">
    <SearchOutlined class="search-icon"/>
    <input type="text" class="search-input" placeholder="搜索知识关联">
    <ant-dropdown :placement="'bottomRight'">
      <m-button :size="'small'" :has-border="false">
        <template #icon>
          <ControlOutlined/>
        </template>
      </m-button>
      <template #overlay>
        <ant-menu class="dropdown-menu-style">
          <ant-menu-item class="menu-item-style">
            我的知识库
          </ant-menu-item>
          <ant-menu-item class="menu-item-style">
            我的知识库
          </ant-menu-item>
        </ant-menu>
      </template>
    </ant-dropdown>
  </div>
  <metagraph-tab-bar
    :is-editable="true"
    :current-key="currentMentionBar"
    @selectedChange="handleMentionBarChange"
    :element-tabs="mentionStatusList"></metagraph-tab-bar>
  <div class="content">
    <div class="card-content"
         v-if="currentShow === 'preMentioned'">
      <normal-relation-list
        :relation-list="knowledgeEdges.preInnerList"></normal-relation-list>
    </div>
    <div class="card-content"
         v-if="currentShow === 'preUnmentioned'">
      <normal-relation-list
        :relation-list="knowledgeEdges.preOuterList"
       ></normal-relation-list>
    </div>
    <div class="card-content"
         v-if="currentShow === 'extendMentioned'">
      <normal-relation-list
        :relation-list="knowledgeEdges.extendInnerList"></normal-relation-list>
    </div>
    <div class="card-content"
         v-if="currentShow === 'extendUnmentioned'">
      <normal-relation-list
        :relation-list="knowledgeEdges.extendOuterList"
        ></normal-relation-list>
    </div>
</div>
</template>

<script lang="ts" setup>
import { ControlOutlined, SearchOutlined, ReadOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import { MButton } from '@/metagraph-ui';
import { Menu as AntMenu, Dropdown as AntDropdown } from 'ant-design-vue';
import NormalRelationList
  from '@/views/repository-editor/knowledge-graph-panel/normal-relation-list.vue';
import {
  knowledgeEdges,
} from '../model/knowledge.edit';


const AntMenuItem = AntMenu.Item;

const toolbarElementList = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '前置',
    value: 'pre',
    isAuth: false
  },
  {
    label: '引申',
    value: 'extend',
    isAuth: false
  },
]);

const currentBar = ref<string>('pre');

function handleBarChange(value: string) {
  currentBar.value = value;
}


const mentionStatusList = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '全部',
    value: 'all',
    isAuth: false
  },
  {
    label: '已引用',
    value: 'mentioned',
    isAuth: false
  },
  {
    label: '未引用',
    value: 'unmentioned',
    isAuth: false
  },
]);

const currentMentionBar = ref<string>('mentioned');

function handleMentionBarChange(value: string) {
  currentMentionBar.value = value;
}

const currentShow = computed(() => {
  if (currentBar.value === 'pre' && currentMentionBar.value === 'mentioned') {
    return 'preMentioned';
  }
  if (currentBar.value === 'pre' && currentMentionBar.value === 'unmentioned') {
    return 'preUnmentioned';
  }
  if (currentBar.value === 'extend' && currentMentionBar.value === 'mentioned') {
    return 'extendMentioned';
  }
  if (currentBar.value === 'extend' && currentMentionBar.value === 'unmentioned') {
    return 'extendUnmentioned';
  }
  return 'preMentioned';
});

</script>

<style scoped lang="scss">
@import '../../../style/common.scss';

.hide-style {

}

.knowledge-name {
  display: flex;
  height: 45px;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  padding-left: 8px;
  font-weight: bold;
  .icon-style {
    margin-right: 8px;
    font-size: 14px;
  }
}

.search-bar {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $borderColor;

  .search-icon {
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .search-input {
    display: block;
    height: 32px;
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
  }

  .search-control {
    font-size: 16px;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.title {
  height: 32px;
  line-height: 32px;
  text-align: left;
  font-size: 12px;
  padding-left: 10px;
  color: #0006;
}

.content {
  font-size: 13px;
  height: calc(100vh - 88px);
  padding: 8px;

  .card-content {
    height: 100%;
    overflow-y: auto;
  }

  .dnd-rect {
    width: calc(100% - 6px);
    height: 32px;
    border: 1px solid $borderColor;
    text-align: center;
    line-height: 32px;
    margin: 3px auto;
    cursor: move;
  }

  .is-active {
    border: 1px solid #1890FF;
  }

  .card-header {
    & ::v-deep(.ant-card-head) {
      min-height: 35px;
    }

    & ::v-deep(.ant-card-head-title) {
      padding: 0;
      line-height: 35px;
      height: 35px;
      font-size: 14px;
    }

    & ::v-deep(.ant-card-body) {
      padding: 15px 5px;
      height: calc(100% - 35px);
    }
  }
}
</style>
