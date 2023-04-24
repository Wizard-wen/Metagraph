<template>
  <div class="file-panel-list-header">
    <div class="left">
      <div class="left-container">
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
              <div class="divider-style"></div>
              <ant-menu-item class="menu-item-style">
                <ArrowLeftOutlined class="icon-size"/>
                回到首页
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
        <div class="page-title">知识地图</div>
        <m-tag :title="'体验版'"></m-tag>
      </div>
    </div>
    <div class="middle">
      <ant-select
        ref="select"
        v-model:value="sourceNode"
        :placeholder="`${direction === 'left' ? '目标知识点' : '起始知识点'}`"
        style="width: 200px">
        <ant-select-option v-for="(item, index) in nodes.list" :key="index" :value="item.id">
          {{ item.name }}
        </ant-select-option>
      </ant-select>
      <ArrowRightOutlined
        v-if="direction === 'right'"
        @click="direction = 'left'"></ArrowRightOutlined>
      <ArrowLeftOutlined
        v-if="direction === 'left'"
        @click="direction = 'right'"></ArrowLeftOutlined>
      <ant-select
        ref="select"
        v-model:value="targetNode"
        :placeholder="`${direction === 'right' ? '目标知识点' : '起始知识点'}`"
        style="width: 200px">
        <ant-select-option v-for="(item, index) in nodes.list" :key="index" :value="item.id">
          {{ item.name }}
        </ant-select-option>
      </ant-select>
      <ant-button
        type="primary"
        @click="findPath"
        :disabled="!targetNode || !sourceNode">查询
      </ant-button>
    </div>
    <div class="right-side"></div>
  </div>
</template>

<script lang="ts" setup>
import { RouterUtil } from '@/utils';
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Menu as AntMenu,
  Select as AntSelect
} from 'ant-design-vue';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  MenuOutlined
} from '@ant-design/icons-vue';
import { MButton, MTag } from '@/metagraph-ui';
import { defineEmits, ref } from 'vue';
import { nodes } from './knowledge.map';

const AntMenuItem = AntMenu.Item;
const AntSelectOption = AntSelect.Option;
const emit = defineEmits(['search']);

const sourceNode = ref();
const targetNode = ref();
const direction = ref<'right' | 'left'>('right');

function findPath() {
  emit('search', {
    sourceNode: sourceNode.value,
    targetNode: targetNode.value,
    direction: direction.value
  });
}

function goHomePage() {
  RouterUtil.jumpTo('/');
}

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.file-panel-list-header {
  height: 56px;
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $hoverDeepBackColor;

  .left {
    display: flex;
    align-items: center;

    .left-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      width: 288px;

      .page-title {
        font-size: 16px;
        margin-left: 15px;
        margin-right: 20px;
        font-weight: 600;
      }
    }
  }

  .middle {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .right-side {
    width: 200px;
  }
}
</style>
